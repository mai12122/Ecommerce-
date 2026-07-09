from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.test import TestCase
from .models import Category, Product, Cart, CartItem

class StoreAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123'
        )
        self.category = Category.objects.create(name='TestCategory', slug='test-category')
        self.product = Product.objects.create(
            category=self.category,
            name='Test Product',
            description='A test product',
            price='9.99'
        )

    def test_get_products(self):
        response = self.client.get(reverse('get_products'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_signup_signin_and_cart(self):
        signup_data = {
            'name': 'Test User',
            'email': 'user2@example.com',
            'password': 'password123',
        }
        response = self.client.post(reverse('signup'), signup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        token = response.data['token']

        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = self.client.get(reverse('get_cart'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['items'], [])

        add_response = self.client.post(reverse('add_to_cart'), {'product_id': self.product.id}, format='json')
        self.assertEqual(add_response.status_code, status.HTTP_200_OK)
        self.assertEqual(add_response.data['cart']['items'][0]['product'], self.product.id)

        cart_response = self.client.get(reverse('get_cart'))
        self.assertEqual(cart_response.status_code, status.HTTP_200_OK)
        self.assertEqual(cart_response.data['items'][0]['product'], self.product.id)
