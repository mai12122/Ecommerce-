import base64
import uuid
import jwt
from datetime import datetime, timedelta, timezone
from django.core.files.base import ContentFile
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
import logging
import requests
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Product, Category, Cart, CartItem, Order, OrderItem, UserProfile, Notification
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CartItemSerializer,
    OrderSerializer,
    SignupSerializer,
    OrderCreateSerializer,
    NotificationSerializer,
)


def _issue_jwt(user):
    payload = {
        'user_id': user.id,
        'exp': datetime.now(tz=timezone.utc) + timedelta(seconds=settings.JWT_ACCESS_TOKEN_LIFETIME_SECONDS),
        'iat': datetime.now(tz=timezone.utc),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256', headers={'typ': 'JWT'})



def _set_auth_cookie(response, token):
    response.set_cookie(
        key=settings.JWT_AUTH_COOKIE,
        value=token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite='Lax' if not settings.DEBUG else 'None',
        max_age=settings.JWT_ACCESS_TOKEN_LIFETIME_SECONDS,
        path='/',
    )


def _build_auth_response(user, profile=None, status=200):
    if profile is None:
        try:
            profile = user.userprofile
        except UserProfile.DoesNotExist:
            profile = None

    phone = ''
    address = ''
    avatar_url = ''
    if profile is not None:
        phone = profile.phone_number
        address = profile.address
        avatar_url = get_avatar_url(profile)

    token = _issue_jwt(user)
    response = Response({
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
        'phone': phone,
        'address': address,
        'avatar': avatar_url,
        'token': token,
    }, status=status)
    _set_auth_cookie(response, token)
    return response


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
def get_notifications(request):
    notifications = Notification.objects.filter(is_read=False).order_by('-created_at')[:10]
    for notification in notifications:
        notification.is_read = True
        notification.save(update_fields=['is_read'])

    serializer = NotificationSerializer(notifications, many=True)
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
    return _build_auth_response(user, profile, status=201)


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
        candidate = User.objects.filter(email__iexact=email).order_by('id').first()
        if candidate is not None:
            user = authenticate(username=candidate.username, password=password)

    if user is None:
        logger = logging.getLogger(__name__)
        logger.warning('Failed signin attempt', extra={'email': email})
        return Response({'error': 'Invalid email or password'}, status=401)

    logger = logging.getLogger(__name__)
    logger.info('User signed in and token created', extra={'user_id': user.id, 'email': user.email})
    return _build_auth_response(user)


@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def google_oauth(request):
    token_id = request.data.get('id_token') or request.data.get('credential')
    if not token_id:
        return Response({'error': 'Google token is required'}, status=400)

    try:
        response = requests.get(
            'https://oauth2.googleapis.com/tokeninfo',
            params={'id_token': token_id},
            timeout=5,
        )
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException:
        return Response({'error': 'Unable to verify Google token'}, status=400)

    if payload.get('aud') and settings.VITE_GOOGLE_CLIENT_ID and payload.get('aud') != settings.VITE_GOOGLE_CLIENT_ID:
        return Response({'error': 'Google token audience is invalid'}, status=400)

    if payload.get('email_verified') is not True:
        return Response({'error': 'Google account email must be verified'}, status=400)

    email = (payload.get('email') or '').strip().lower()
    if not email:
        return Response({'error': 'Google account email is required'}, status=400)

    user, created = User.objects.get_or_create(
        username=email,
        defaults={
            'email': email,
            'first_name': (payload.get('name') or email.split('@', 1)[0]).split(' ', 1)[0],
            'last_name': (payload.get('name') or email.split('@', 1)[0]).split(' ', 1)[1] if ' ' in (payload.get('name') or email.split('@', 1)[0]) else '',
        },
    )
    if created:
        user.set_unusable_password()
        user.save()

    if not hasattr(user, 'userprofile'):
        UserProfile.objects.get_or_create(user=user)

    profile = user.userprofile
    if payload.get('name') and not user.get_full_name().strip():
        first_name, _, last_name = payload.get('name').partition(' ')
        user.first_name = first_name
        user.last_name = last_name
        user.save()

    return _build_auth_response(user, profile)


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