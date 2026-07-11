from django.contrib.auth.models import User
from django.conf import settings
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.test import TestCase
from unittest.mock import patch
from .models import Category, Product, Cart, CartItem, Notification

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

    def test_creating_product_creates_new_product_notification(self):
        Product.objects.create(
            category=self.category,
            name='New Arrival Product',
            description='A new product',
            price='12.50',
            discount_percentage=0,
        )

        notification = Notification.objects.filter(notification_type='new_product').order_by('-created_at').first()
        self.assertIsNotNone(notification)
        self.assertEqual(notification.title, 'New product available')
        self.assertIn('New Arrival Product', notification.message)

    def test_updating_discount_creates_new_discount_notification(self):
        self.product.discount_percentage = 20
        self.product.save()

        notification = Notification.objects.filter(notification_type='new_discount').order_by('-created_at').first()
        self.assertIsNotNone(notification)
        self.assertEqual(notification.title, 'New discount available')
        self.assertIn('20%', notification.message)

    def test_signin_sets_jwt_cookie_and_allows_cookie_auth(self):
        user = User.objects.create_user(username='cookie-user', email='cookie@example.com', password='password123')
        response = self.client.post(reverse('signin'), {
            'email': 'cookie@example.com',
            'password': 'password123',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('auth_token', response.cookies)
        self.assertTrue(response.cookies['auth_token']['httponly'])

        cookie_client = APIClient()
        cookie_client.cookies.load(response.cookies)
        cart_response = cookie_client.get(reverse('get_cart'))
        self.assertEqual(cart_response.status_code, status.HTTP_200_OK)

    @patch('store.views.requests.get')
    def test_google_oauth_signin_creates_user_and_returns_token(self, mock_get):
        mock_get.return_value.json.return_value = {
            'sub': 'google-user-1',
            'email': 'google@example.com',
            'email_verified': True,
            'aud': settings.VITE_GOOGLE_CLIENT_ID or 'test-client-id',
            'name': 'Google User',
            'picture': 'https://example.com/avatar.png',
        }
        mock_get.return_value.raise_for_status.return_value = None

        response = self.client.post(reverse('google_oauth'), {
            'id_token': 'fake-token'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'google@example.com')
        self.assertIn('token', response.data)
        self.assertTrue(User.objects.filter(email='google@example.com').exists())

    @patch('store.authentication.id_token.verify_oauth2_token')
    def test_google_oauth_token_without_verified_email_is_rejected(self, mock_verify):
        mock_verify.return_value = {
            'sub': 'google-user-2',
            'email': 'google-unverified@example.com',
            'email_verified': False,
        }

        self.client.cookies['JWT-SESSION'] = 'fake-google-token'
        response = self.client.get(reverse('get_cart'))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
