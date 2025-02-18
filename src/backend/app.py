from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
import scrypt
import db

db = db.Connexio()

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
class LoginRequest(BaseModel):
    username: str
    passwd: str
class RequestBody(BaseModel):
    requested: str
    requested2: str

class UsuariLogin(BaseModel):
    id: int
    username: str 
    password: str

class UsuariPublic(BaseModel):
    id: int
    username: str 

class Token(BaseModel):
    access_token: str
    token_type: str

class Mensaje(BaseModel):
    emisor_id: int
    receptor_id: int
    contenido: str

class Amigo(BaseModel):
    username: str
    id: int 

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.patch("/check")
def cambiaEstadoLeído_(id_missatge: str, estat: str):
    db.conecta()  
    tick = db.modificaEstatMissatgeUsuarios(id_missatge, estat)
    db.desconecta()
    return tick

@app.get("/treuID")
def treuID(username: str):
    db.conecta()
    usuariId = db.transforma_Username_a_ID(username)
    db.desconecta()
    return usuariId

@app.get("/treuNom")
async def treuNom(id: int):
    db.conecta()
    usuariNom = db.transforma_Id_a_Username(id)
    db.desconecta()
    return usuariNom

@app.get("/llistaamics", response_model=List[UsuariPublic])
def get_usuaris():
    db.conecta()  
    usuarios = db.cargaLlistaAmics() 
    db.desconecta()
    return usuarios

def verificar_password(password: str, hashed_password: str) -> bool:
    parts = hashed_password.split("$")
    if len(parts) != 3:
        return False  

    salt = parts[1]
    stored_key = parts[2]

    hashed_input_password = scrypt.hash(
        password.encode(), salt.encode(), N=32768, r=8, p=1
    ).hex()

    return hashed_input_password == stored_key



@app.post("/login", response_model=Token)
def login(login_request: LoginRequest):
    db.conecta()
    try:
        username = login_request.username
        passwd = login_request.passwd

        hashed_password = db.cargaHashedPassword(username)
        if not hashed_password:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        if not verificar_password(passwd, hashed_password):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        usuariLogeat = db.cargaUsuari(username, hashed_password)
        if not usuariLogeat:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        if isinstance(usuariLogeat, list):
            user_data = usuariLogeat[0]
        else:
            user_data = usuariLogeat

        user_id = user_data["id"]
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": username, "id": user_id}, 
            expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print("Error en /login:", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.desconecta()
        
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token no contiene el ID del usuario",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/verify-token")
def verify_token_endpoint(token_data: dict = Depends(verify_token)):
    return {"message": "Token is valid"}

@app.get("/obtener-id-usuario")
def obtener_id_usuario(user_id: int = Depends(verify_token)):
    return {"user_id": user_id}

@app.get("/grups")
def autentificarGrups(username: str):
    db.conecta()  
    grupos = db.sacaGruposDelUser(username)
    if not grupos:
        db.desconecta()
        raise HTTPException(status_code=404, detail="El usuario no pertenece a ningún grupo")
    
    grupo_id = grupos[0]["grupo_id"]
    integrantes = db.sacaIntegrantesGrupo(grupo_id)

    db.desconecta()

    return {
        "grupos": grupos,
        "integrantes": integrantes
    }

@app.get("/missatgesAmics")
def recibirMensaje(emisor_id: int, receptor_id: int, fecha_envio: str = None):
    db.conecta()
    if emisor_id is None or receptor_id is None:
        return {"error": "Emisor o receptor no válidos"}

    chatAmic = db.cargaMensajesAmigo(emisor_id, receptor_id, fecha_envio)
    db.desconecta()

    return chatAmic

@app.post("/missatgesAmics")
def enviarMensaje(mensaje: Mensaje):
    try:
        db.conecta()
        result = db.enviaMensajesAmigos(mensaje.emisor_id, mensaje.receptor_id, mensaje.contenido)
        db.desconecta()
        return {"message": "Missatge enviat"}
    except Exception as e:
        db.desconecta()
        return {"error": f"An error occurred: {str(e)}"}
