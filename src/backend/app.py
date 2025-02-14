from fastapi import FastAPI, Depends, HTTPException, status # type: ignore # type: ignore
from fastapi.security import OAuth2PasswordBearer # type: ignore
from pydantic import BaseModel # type: ignore
from jose import JWTError, jwt  # type: ignore # importar pip install python-jose
from datetime import datetime, timedelta
from typing import Optional, List
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


class Usuari(BaseModel):
    id: int
    username: str 
    password: str

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

# Funcionament bàsic 4/5
@app.patch("/check")
def cambiaEstadoLeído_(id_missatge: str, estat: str):
    db.conecta()  

    # afegir la llògica dels tiks. Quan arriba i quan es llegit.
    tick = db.modificaEstatMissatgeUsuarios(id_missatge, estat)
    db.desconecta()
    return tick

@app.get("/treuID")
def treuID(username):
    db.conecta()
    ID_Usuari = db.transforma_Username_a_ID(username)
    db.desconecta()
    return ID_Usuari;

# Funcionament bàsic 1/5
# per treure el json de tots els usuaris  """
@app.get("/llistaamics", response_model=List[Usuari])
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


@app.post("/login")
def login(login_request: LoginRequest):
    db.conecta()

    try:
        username = login_request.username
        passwd = login_request.passwd

        # Load hashed password from the database
        hashed_password = db.cargaHashedPassword(username)
        if not hashed_password:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        # Verify the password
        if not verificar_password(passwd, hashed_password):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        # Load user data
        usuariLogeat = db.cargaUsuari(username, hashed_password)
        if not usuariLogeat:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        return {"user": usuariLogeat}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.desconecta()


# Funcionament bàsic 2/5


@app.get("/grups")
def autentificarGrups(username: str):
    db.conecta()
    grupos = db.sacaGruposDelUser(username) 
    db.desconecta()
    return grupos

"""/missatgesAmics: permet enviar missatges a un amic o rebre els missatges d’aquest amic. Inicialment rebrà els 10 missatges més recents, 
tant els que hem enviat com els que hem rebut, cronològicament. 
Després el sistema ha de permetre anar rebent els missatges més antics de 10 en 10. 
Els missatges enviats ha d’indicar l’estat del missatge (enviat, rebut, llegit)"""


@app.get("/missatgesAmics")
def recibirMensaje(username: str):
    db.conecta()  

    current_dateTime = datetime.now()
    print(current_dateTime)
    mensajes_amigo = db.cargaMensajesAmigo(username, current_dateTime)

    if mensajes_amigo:
        current_dateTime = mensajes_amigo[-1][
            "fecha_envio"
        ]  

    db.desconecta()  # Disconnect from the database

    return mensajes_amigo


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
