from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# JavaScript Object Signing and Encryption (JOSE)
# JSON Web Token (JWT)
from jose import JWTError, jwt  # importar pip install python-jose
from datetime import datetime, timedelta
from typing import Optional, List
from werkzeug.security import check_password_hash, generate_password_hash


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


""" per treure el json de tots els usuaris  """
@app.get("/llistaamics", response_model=Usuari)
def get_usuaris(username: str):
    db.conecta()  
    usuarios = db.cargaUsuarisProva(username) 
    return usuarios


@app.post("/grups", response_model=Usuari)
def autentificar(username: str, password: str):
    user = get_usuaris(username)

    
    if user and user["password"] == password:
        return Usuari(**user)  

    return None 


def crearToken(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        # Decodifica el token JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No se pudo validar las credenciales",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no válido",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/token", response_model=Token)
async def login(user: Usuari):
    authenticated_user = autentificar(user.username, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nombre de usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Genera el token de acceso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = crearToken(
        data={"sub": authenticated_user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
