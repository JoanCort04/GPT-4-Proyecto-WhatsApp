from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# JavaScript Object Signing and Encryption (JOSE)
# JSON Web Token (JWT)
from jose import JWTError, jwt  # importar pip install python-jose
from datetime import datetime, timedelta
from typing import Optional, List
import db

db = db.Connexio()

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class Usuari(BaseModel):
    id: int
    username: str  # Assuming the field is 'username' instead of 'name'
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


@app.get("/llistaamics", response_model=List[Usuari])
def get_usuaris():
    db.conecta()  # Connect to the database
    usuarios = db.cargaUsuaris()  # Get users from the database
    return usuarios


def crearToken(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/token", response_model=Token)
async def login(user: Usuari):
    authenticated_user = authenticate_user(user.name, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nombre de usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Genera el token de acceso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": authenticated_user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
