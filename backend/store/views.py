import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
import logging
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Product, Category, Cart, CartItem, Order, OrderItem, UserProfile
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CartItemSerializer,
    OrderSerializer,
    SignupSerializer,
    OrderCreateSerializer,
)


def save_base64_avatar(profile, base64_string):
    """Save a base64-encoded image string to the profile's avatar field."""
    if not base64_string or not base64_string.startswith('data:image/'):
        return
    try:
        header, data = base64_string.split(';base64,')
        ext = header.split('/')[-1].split('+')[0]
        if ext not in ('png', 'jpeg', 'jpg', 'gif', 'webp'):
            return
        file_name = f"{uuid.uuid4().hex}.{ext}"
        profile.avatar.save(file_name, ContentFile(base64.b64decode(data)), save=True)
    except (ValueError, Exception):
        pass


def get_avatar_url(profile, request=None):
    """Return the full avatar URL or empty string."""
    if profile.avatar:
        return profile.avatar.url
    return ''


@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')

    try:
        product = Product.objects.get(id=product_id)
        cart, created = Cart.objects.get_or_create(user=request.user)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            item.quantity += 1
            item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response({
            'message': 'Product added to cart',
            'cart': serializer.data
        })

    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)


@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response({'error': 'Item ID and quantity are required'}, status=400)

    try:
        item = CartItem.objects.get(id=item_id)
        if item.cart.user != request.user:
            return Response({'error': 'Unauthorized'}, status=403)

        if int(quantity) < 1:
            item.delete()
            return Response({'message': 'Item removed from cart'})

        item.quantity = quantity
        item.save()

        serializer = CartItemSerializer(item)
        return Response(serializer.data)

    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)


@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    try:
        item = CartItem.objects.get(id=item_id)
        if item.cart.user != request.user:
            return Response({'error': 'Unauthorized'}, status=403)
        item.delete()
        return Response({'message': 'Product removed from cart'})
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_orders(request):
    serializer = OrderCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'errors': serializer.errors}, status=400)

    cart = Cart.objects.filter(user=request.user).first()
    if not cart or not cart.items.exists():
        return Response({'error': 'Cart is empty'}, status=400)

    total = sum(float(item.product.price) * item.quantity for item in cart.items.all())

    order = Order.objects.create(user=request.user, total_amount=total)
    for item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price,
        )

    cart.items.all().delete()
    logger = logging.getLogger(__name__)
    logger.info('Order created', extra={'user_id': request.user.id, 'order_id': order.id, 'total': total})
    return Response({'message': 'Order created successfully', 'order_id': order.id})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    orders = Order.objects.filter(user=request.user).prefetch_related('items__product').order_by('-created_at')
    serializer = OrderSerializer(orders, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
@throttle_classes([ScopedRateThrottle])
def signup(request):
    logger = logging.getLogger(__name__)
    logger.info(f'Signup request data: {request.data}')
    serializer = SignupSerializer(data=request.data)
    if not serializer.is_valid():
        logger.error(f'Signup validation errors: {serializer.errors}')
        return Response({'errors': serializer.errors}, status=400)

    user = serializer.save()
    profile = UserProfile.objects.get(user=user)
    logger.info('User signup', extra={'user_id': user.id, 'email': user.email})
    # create auth token for SPA usage
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
        'phone': profile.phone_number,
        'address': profile.address,
        'avatar': get_avatar_url(profile),
        'token': token.key,
    }, status=201)


signup.throttle_scope = 'login'


@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
@throttle_classes([ScopedRateThrottle])
def signin(request):
    data = request.data
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=400)

    user = authenticate(username=email, password=password)

    if user is None:
        logger = logging.getLogger(__name__)
        logger.warning('Failed signin attempt', extra={'email': email})
        return Response({'error': 'Invalid email or password'}, status=401)

    logger = logging.getLogger(__name__)
    logger.info('User signed in and token created', extra={'user_id': user.id, 'email': user.email})

    phone = ''
    avatar_url = ''
    address = ''
    phone = ''
    avatar_url = ''
    try:
        profile = user.userprofile
        phone = profile.phone_number
        address = profile.address
        avatar_url = get_avatar_url(profile)
    except UserProfile.DoesNotExist:
        profile = None

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
        'phone': phone,
        'address': address,
        'avatar': avatar_url,
        'token': token.key,
    })


signin.throttle_scope = 'login'


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    data = request.data
    user_id = data.get('id')

    if not user_id:
        return Response({'error': 'User ID is required'}, status=400)

    # only allow updating the authenticated user's profile
    if int(user_id) != request.user.id:
        return Response({'error': 'Unauthorized'}, status=403)
    user = request.user

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    address = data.get('address', '').strip()

    if name:
        name_parts = name.split(' ', 1)
        user.first_name = name_parts[0]
        user.last_name = name_parts[1] if len(name_parts) > 1 else ''

    if email:
        if User.objects.filter(email=email).exclude(id=user.id).exists():
            return Response({'error': 'Email already in use'}, status=400)
        user.email = email
        user.username = email

    user.save()

    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.phone_number = phone
    profile.address = address
    profile.save()

    avatar_data = data.get('avatar', '')
    if avatar_data and avatar_data.startswith('data:image/'):
        save_base64_avatar(profile, avatar_data)

    return Response({
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
        'phone': phone,
        'address': profile.address,
        'avatar': get_avatar_url(profile),
    })