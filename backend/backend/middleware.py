class ContentSecurityPolicyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.setdefault(
            'Content-Security-Policy',
            "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; "
            "object-src 'none'; img-src 'self' data: https://*.googleusercontent.com https://*.gstatic.com; "
            "style-src 'self' 'unsafe-inline' https://accounts.google.com; "
            "script-src 'self' https://accounts.google.com https://www.gstatic.com; "
            "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com; "
            "frame-src 'self' https://accounts.google.com; form-action 'self'",
        )
        response.setdefault('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
        return response
