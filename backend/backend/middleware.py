class ContentSecurityPolicyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.setdefault(
            'Content-Security-Policy',
            "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; "
            "object-src 'none'; img-src 'self' data:; "
            "style-src 'self' 'unsafe-inline'; script-src 'self'; form-action 'self'",
        )
        response.setdefault('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
        return response
