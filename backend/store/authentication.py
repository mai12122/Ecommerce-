import jwt
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from functools import lru_cache
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token


@lru_cache(maxsize=1)
def get_google_public_keys():
    """Fetch and cache Google's public keys for JWT verification."""
    try:
        response = requests.get('https://www.googleapis.com/oauth2/v1/certs')
        response.raise_for_status()
        return response.json()
    except Exception as exc:
        raise AuthenticationFailed('Unable to fetch Google public keys') from exc


def verify_google_jwt(token):
    """Verify a Google OAuth JWT token and return the decoded payload."""
    try:
        payload = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.VITE_GOOGLE_CLIENT_ID,
        )
        email_verified = payload.get('email_verified')
        if str(email_verified).lower() != 'true':
            raise AuthenticationFailed('Google token email is not verified')
        if not payload.get('email'):
            raise AuthenticationFailed('Google token payload is missing an email')
        return payload
    except AuthenticationFailed:
        raise
    except Exception as exc:
        raise AuthenticationFailed(f'Invalid Google token: {str(exc)}') from exc


def verify_django_jwt(token):
    """Verify a Django-generated JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=['HS256'],
            options={'verify_exp': True},
        )
        return payload
    except jwt.ExpiredSignatureError as exc:
        raise AuthenticationFailed('Token has expired') from exc
    except jwt.InvalidTokenError as exc:
        raise AuthenticationFailed('Invalid token') from exc


class JWTCookieAuthentication(BaseAuthentication):
    """Authenticate users via JWT cookies (Django-generated or Google OAuth) or Authorization headers.

    Policy:
    - Prefer backend cookie: settings.JWT_AUTH_COOKIE (auth_token)
    - If JWT-SESSION (Google) is present and auth_token is missing, verify Google token and then authenticate the user.
      (The backend also issues its own token during /api/auth/google/ via _build_auth_response.)
    """

    def authenticate(self, request):
        # 1) Prefer backend-issued cookie
        django_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE)

        # 2) Optional fallback: Google OAuth session cookie
        google_token = None
        if not django_token:
            jwt_session = request.COOKIES.get('JWT-SESSION')
            if jwt_session and jwt_session.count('.') == 2:
                google_token = jwt_session

        # 3) Optional header fallback (used by tests / non-cookie clients)
        if not django_token and not google_token:
            auth_header = request.META.get('HTTP_AUTHORIZATION', '')
            if auth_header.startswith('Bearer '):
                django_token = auth_header.split(' ', 1)[1].strip()
            elif auth_header.startswith('Token '):
                django_token = auth_header.split(' ', 1)[1].strip()

        if not django_token and not google_token:
            return None

        # Decode/verify
        if google_token:
            payload = verify_google_jwt(google_token)
            user_id = payload.get('user_id')
            if user_id:
                # Extremely unlikely for Google tokens, but support it if present
                token_user = get_user_model().objects.filter(pk=user_id).first()
                if not token_user:
                    raise AuthenticationFailed('User not found')
                if not token_user.is_active:
                    raise AuthenticationFailed('User account is inactive')
                return token_user, google_token

            email = (payload.get('email') or '').strip().lower()
            if not email:
                raise AuthenticationFailed('Invalid Google token payload (missing email)')

            user_model = get_user_model()
            try:
                user = user_model.objects.get(email=email)
            except user_model.DoesNotExist as exc:
                raise AuthenticationFailed(f'User with email {email} not found') from exc

            if not user.is_active:
                raise AuthenticationFailed('User account is inactive')
            return user, google_token

        # Backend token path
        payload = verify_django_jwt(django_token)
        user_id = payload.get('user_id')
        if not user_id:
            raise AuthenticationFailed('Invalid token payload')

        user_model = get_user_model()
        try:
            user = user_model.objects.get(pk=user_id)
        except user_model.DoesNotExist as exc:
            raise AuthenticationFailed('User not found') from exc

        if not user.is_active:
            raise AuthenticationFailed('User account is inactive')

        return user, django_token

