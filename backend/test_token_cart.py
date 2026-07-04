import os
import sys
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
import django

django.setup()

from django.contrib.auth.models import User
from django.test import Client
from store.models import Category, Product

user, created = User.objects.get_or_create(username='test@example.com', defaults={'email': 'test@example.com'})
user.set_password('password123')
user.save()

category, _ = Category.objects.get_or_create(name='TestCategory', slug='test-category')
product, _ = Product.objects.get_or_create(
    name='Test Product',
    category=category,
    defaults={'description': 'Test product', 'price': '9.99'},
)

client = Client()
res = client.post(
    '/api/auth/signin/',
    data=json.dumps({'email': 'test@example.com', 'password': 'password123'}),
    content_type='application/json',
    HTTP_HOST='127.0.0.1',
)
print('signin', res.status_code, res.content.decode('utf-8'))
if res.status_code != 200:
    sys.exit(1)

token = res.json().get('token')
print('token', token)

client.defaults['HTTP_AUTHORIZATION'] = f'Token {token}'
res2 = client.post(
    '/api/cart/add/',
    data=json.dumps({'product_id': product.id}),
    content_type='application/json',
    HTTP_HOST='127.0.0.1',
)
print('add_to_cart', res2.status_code, res2.content.decode('utf-8'))
res3 = client.get('/api/cart/', HTTP_HOST='127.0.0.1')
print('get_cart', res3.status_code, res3.content.decode('utf-8'))
