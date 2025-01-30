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
    username: str 
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


class Missatge(BaseModel):
    id: int



# per treure el json de tots els usuaris  """
@app.get("/llistaamics", response_model=List[Usuari])
def get_usuaris():
    db.conecta()  
    usuarios = db.cargaLlistaAmics() 
    db.desconecta()
    return usuarios

# per treure només un usuari i contrastar la seva informació"""
@app.get("/login", response_model=Usuari)
def get_(username: str):
    db.conecta()  
    usuari = db.cargaUsuari(username) 
    #afegir la llògica del token jwt?????
    db.desconecta()
    return usuari


@app.post("/grups", response_model=List[Usuari])
def autentificar(username: str):
    db.conecta()
    grupos = db.sacaGruposDelUser(username)

    db.desconecta()
    return grupos
    


@app.api_route("/grups", methods=["GET", "POST"], response_model=List[Usuari])
async def autentificar(username: str):
    db.conecta()
    grupos = db.sacaGruposDelUser(username)

    
    db.desconecta()
    return grupos

"""/missatgesAmics: permet enviar missatges a un amic o rebre els missatges d’aquest amic. Inicialment rebrà els 10 missatges més recents, 
tant els que hem enviat com els que hem rebut, cronològicament. 
Després el sistema ha de permetre anar rebent els missatges més antics de 10 en 10. 
Els missatges enviats ha d’indicar l’estat del missatge (enviat, rebut, llegit)"""

@app.post("/missatgesAmics", response_model=List)
def get_mensajesAmigo(username):
    db.conecta()  
    mensajes_amigo = []
    mensajes_amigo = db.cargaMensajesAmigos(username)
    #afegir la llògica dels 10 missatges i tal 

    db.desconecta()
    return mensajes_amigo



"""
@app.post("/grups", response_model=Usuari)
def autentificar(username: str, password: str):
user = get_usuaris(username)
If user and user["password"] == password:
            return user
        raise HTTPException(status_code=401, detail="Nom o contrasenya invàlid. Verificació ha fallat.  ")
"""

@app.patch("/check", response_model=Missatge)
def cambiaEstadoLeído_(id_missatge: str, estat: str):
    db.conecta()  
     
    #afegir la llògica dels tiks. Quan arriba i quan es llegit. 
    tick = db.modificaEstatMissatgeUsuarios(id_missatge, estat)
    db.desconecta()
    return tick


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
