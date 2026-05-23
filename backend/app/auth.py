from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt
from jwt import PyJWKClient
from app.config import get_settings
import functools

settings = get_settings()
bearer_scheme = HTTPBearer()

# Cache the JWKS client — it fetches Supabase's public keys
# and caches them so we don't hit the network on every request
@functools.lru_cache()
def get_jwks_client():
    jwks_url = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
    return PyJWKClient(jwks_url)


class AuthenticatedUser(BaseModel):
    id: str
    email: str
    role: str = "authenticated"


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AuthenticatedUser:
    token = credentials.credentials

    try:
        jwks_client = get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "HS256"],
            options={"verify_aud": False}
        )

        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        role: str = payload.get("role", "authenticated")

        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return AuthenticatedUser(id=user_id, email=email, role=role)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )