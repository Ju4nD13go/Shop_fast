from fastapi import APIRouter, HTTPException, status, Depends
from beanie import PydanticObjectId
from app.models import User
from app.schemas import UserCreate, UserResponse, TokenResponse, UserLogin
from app.core.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Registro
@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    # Verificar si el email ya existe
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Verificar si el username ya existe
    existing_username = await User.find_one(User.username == user_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya está en uso"
        )
    
    # Crear usuario
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_password
    )
    await new_user.insert()
    
    # Crear token
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(new_user, from_attributes=True)
    )

# Login
@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    # Buscar usuario por email
    user = await User.find_one(User.email == credentials.email)
    
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Crear token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user, from_attributes=True)
    )

# Obtener usuario actual
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user, from_attributes=True)

# Logout (opcional, solo limpia el token del lado del cliente)
@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Sesión cerrada exitosamente"}