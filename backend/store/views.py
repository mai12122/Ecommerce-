import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Product, Category, Cart, CartItem, Order, OrderItem, UserProfile
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer, OrderSerializer


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
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=None)
    serializer = CartSerializer(cart, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
def add_to_cart(request):
    product_id = request.data.get('product_id')

    try:
        product = Product.objects.get(id=product_id)
        cart, created = Cart.objects.get_or_create(user=None)

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
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response({'error': 'Item ID and quantity are required'}, status=400)

    try:
        item = CartItem.objects.get(id=item_id)

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
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()

    return Response({'message': 'Product removed from cart'})

@api_view(['POST'])
def create_orders(request):
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method', 'COD')

        cart = Cart.objects.first()

        if not cart or not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=400)

        total = sum(float(item.product.price) * item.quantity for item in cart.items.all())

        # create order
        order = Order.objects.create(
            user=None,
            total_amount=total
        )

        # create order items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        # clear cart
        cart.items.all().delete()

        return Response({
            'message': 'Order created successfully',
            'order_id': order.id
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def get_orders(request):
    orders = Order.objects.prefetch_related('items__product').order_by('-created_at')
    serializer = OrderSerializer(orders, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
def signup(request):
    data = request.data
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')

    if not name or not email or not password:
        return Response({'error': 'Name, email, and password are required'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=400)

    # Use email as username since the frontend works with email
    if User.objects.filter(username=email).exists():
        return Response({'error': 'Email already registered'}, status=400)

    name_parts = name.split(' ', 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ''

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )

    profile = UserProfile.objects.create(user=user, phone_number=phone)

    avatar_data = data.get('avatar', '')
    if avatar_data:
        save_base64_avatar(profile, avatar_data)

    return Response({
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
        'phone': phone,
        'avatar': get_avatar_url(profile),
    }, status=201)


@api_view(['POST'])
def signin(request):
    data = request.data
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=400)

    user = authenticate(username=email, password=password)

    if user is None:
        return Response({'error': 'Invalid email or password'}, status=401)

    phone = ''
    avatar_url = ''
    try:
        phone = user.userprofile.phone_number
        avatar_url = get_avatar_url(user.userprofile)
    except UserProfile.DoesNotExist:
        pass

    return Response({
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
        'phone': phone,
        'avatar': avatar_url,
    })


@api_view(['PUT'])
def update_profile(request):
    data = request.data
    user_id = data.get('id')

    if not user_id:
        return Response({'error': 'User ID is required'}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()

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
    profile.save()

    avatar_data = data.get('avatar', '')
    if avatar_data and avatar_data.startswith('data:image/'):
        save_base64_avatar(profile, avatar_data)

    return Response({
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
        'phone': phone,
        'avatar': get_avatar_url(profile),
    })