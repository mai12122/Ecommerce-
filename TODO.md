# TODO

## Goal
Make Google `JWT-SESSION` requests always result in a backend-signed JWT cookie (`auth_token`) and reduce/limit reliance on `JWT-SESSION` for API auth.

## Plan
1. Update `backend/store/authentication.py`:
   - Prefer `auth_token` cookie.
   - If only `JWT-SESSION` is present, verify it with Google and authenticate the user (migration window), without pretending it has a backend signature.
2. Ensure `/api/auth/google/` continues to set `auth_token` via `_build_auth_response` (this is where backend signature is issued).
3. Optionally update frontend to always rely on backend cookie after google login (`credentials: 'include'`).
4. Run backend tests (`python manage.py test`) and (if possible) a quick token flow test.


