import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django

django.setup()

from django.contrib.auth.models import User
from django.test import Client, TestCase
from store.models import Category, Product


class TokenCartIntegrationTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='password123',
        )
        cls.category = Category.objects.create(name='TestCategory', slug='test-category')
        cls.product = Product.objects.create(
            name='Test Product',
            category=cls.category,
            description='Test product',
            price='9.99',
        )

    def test_signin_and_cart_flow(self):
        client = Client()
        response = client.post(
            '/api/auth/signin/',
            data=json.dumps({'email': 'test@example.com', 'password': 'password123'}),
            content_type='application/json',
            HTTP_HOST='127.0.0.1',
        )
        self.assertEqual(response.status_code, 200, response.content.decode('utf-8'))

        token = response.json().get('token')
        self.assertTrue(token)

        client.defaults['HTTP_AUTHORIZATION'] = f'Token {token}'
        add_response = client.post(
            '/api/cart/add/',
            data=json.dumps({'product_id': self.product.id}),
            content_type='application/json',
            HTTP_HOST='127.0.0.1',
        )
        self.assertEqual(add_response.status_code, 200, add_response.content.decode('utf-8'))

        cart_response = client.get('/api/cart/', HTTP_HOST='127.0.0.1')
        self.assertEqual(cart_response.status_code, 200, cart_response.content.decode('utf-8'))
        self.assertGreaterEqual(len(cart_response.json().get('items', [])), 1)
