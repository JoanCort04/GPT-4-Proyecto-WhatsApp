from fastapi import FastAPI, Depends, HTTPException, status # type: ignore # type: ignore
from fastapi.security import OAuth2PasswordBearer # type: ignore
from pydantic import BaseModel # type: ignore
from jose import JWTError, jwt  # type: ignore # importar pip install python-jose
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


class RequestBody(BaseModel):
    requested : str
    requested2: str

# Utilizar aquest nomes per login
class UsuariLogin(BaseModel):
    id: int
    username: str 
    password: str

# Utilizar aquest per obtenir les dades dels usuaris
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

# Bypass politica CORS per iniciar sessió
origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Funcionament bàsic 4/5
@app.patch("/check")
def cambiaEstadoLeído_(missatge_id, emisor_id, receptor_id):
    db.conecta()  
    
    tick = db.marcar_como_recibido_usuario(missatge_id, emisor_id, receptor_id)
    db.desconecta()
    return tick


@app.get("/treuID")
def treuID(username: str):
    db.conecta()
    usuariId = db.transforma_Username_a_ID(username)
    db.desconecta()
    return usuariId

# contrari que treu id, treu nom amb la id
@app.get("/treuNom")
async def treuNom(id: int):  # Change `username` to `id`
    db.conecta()
    usuariNom = db.transforma_Id_a_Username(id)  # Pass id instead of username
    db.desconecta()
    return usuariNom


# Funcionament bàsic 1/5
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

class LoginRequest(BaseModel):
    username: str
    passwd: str

# Login modificat per crear token al iniciar sessio, i recuperar-lo
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

        # Generar el token JWT con expiración
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
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/verify-token")
def verify_token_endpoint(token_data: dict = Depends(verify_token)):
    # Si llegamos aquí, el token es válido
    return {"message": "Token is valid"}


# ----
# Login anterior
# @app.post("/login")
# def login(login_request: LoginRequest):
#     db.conecta()

#     try:
#         username = login_request.username
#         passwd = login_request.passwd

#         # Load hashed password from the database
#         hashed_password = db.cargaHashedPassword(username)
#         if not hashed_password:
#             raise HTTPException(status_code=401, detail="Invalid username or password")

#         # Verify the password
#         if not verificar_password(passwd, hashed_password):
#             raise HTTPException(status_code=401, detail="Invalid username or password")

#         # Load user data
#         usuariLogeat = db.cargaUsuari(username, hashed_password)
#         if not usuariLogeat:
#             raise HTTPException(status_code=401, detail="Invalid username or password")

#         return {"user": usuariLogeat}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

#     finally:
#         db.desconecta()
# ----


@app.get("/grups")
def autentificarGrups(username: str):
    db.conecta()  # Conecta a la base de datos

    # Obtener los grupos del usuario
    grupos = db.sacaGruposDelUser(username)
    if not grupos:
        db.desconecta()
        raise HTTPException(
            status_code=404, detail="El usuario no pertenece a ningún grupo"
        )

    grupo_id = grupos[0]["grupo_id"]
    integrantes = db.sacaIntegrantesGrupo(grupo_id)

    db.desconecta() 
    
    return {"grupos": grupos, "integrantes": integrantes}


# Lo seu tendria que ser que emisor/receptor id siguin parametres int
# El problema es que tenim un usuari amb id 0,
# solucions eliminar el usuario amb id 0,o canviarli la id a l'ultim
# per ara no utlizar usuario id 0 per fer proves
@app.get("/missatgesAmics")
def recibirMensaje(emisor_id:int, receptor_id:int):
    db.conecta()

    # Aseguramos que la validación no rechace el 0
    if emisor_id is None or receptor_id is None:
        return {"error": "Emisor o receptor no válidos"}
    
    chatAmic = db.cargaMensajesAmigo(emisor_id, receptor_id)
    db.desconecta()
    
    return chatAmic



# Funcionament bàsic 3/5
@app.post("/missatgesAmics")
def enviarMensaje(mensaje: Mensaje):
    db.conecta()
    result = db.enviaMensajesAmigos(mensaje.emisor_id, mensaje.receptor_id, mensaje.contenido)
    db.desconecta()
    return "Missatge enviat" 


""""
@app.post("/missatgesGrup")
async def enviarMissatgeGrup(contenido: Mensaje,usuario_actual: dict = Depends(get_current_user)):
    db.conecta()
    try:
        db.conecta()
        emisor_id = usuario_actual["user_id"]
        
        if db.enviarMensajeGrupo(emisor_id, contenido.contenido, contenido.fecha_envio, contenido.grupo_nom):
            return {"message": "Mensaje enviado correctamente"}
        else:
            raise HTTPException(status_code=400, detail="Error al enviar el mensaje")
    except Exception as e:
        print(f"Error en el endpoint: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        db.desconecta()

@app.get("/missatgesGrup")

"""
