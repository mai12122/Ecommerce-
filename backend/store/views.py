from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Product, Category, Cart, CartItem, Order, OrderItem, UserProfile
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer, OrderSerializer


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

    UserProfile.objects.create(user=user, phone_number=phone)

    return Response({
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
        'phone': phone,
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
    try:
        phone = user.userprofile.phone_number
    except UserProfile.DoesNotExist:
        pass

    return Response({
        'id': user.id,
        'name': user.get_full_name(),
        'email': user.email,
        'phone': phone,
    })