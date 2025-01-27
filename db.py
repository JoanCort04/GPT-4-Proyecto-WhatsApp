import pymysql
import pymysql.cursors

class Connexio(object):
    def conecta(self):
        self.db = pymysql.connect(
            host="192.168.193.133",  
            port=3306,
            user="joancortes",
            password="43481462P",
            db="gpt4",
            charset="utf8mb4",
            autocommit=True,
            cursorclass=pymysql.cursors.DictCursor,
        )
        self.cursor = self.db.cursor()

    def desconecta(self):
        self.db.close()

    def cargaUsuari(self, username):
        sql = "SELECT * FROM usuarisclase WHERE username LIKE %s"
        self.cursor.execute(sql, (username))
        ResQuery = self.cursor.fetchone()
        return ResQuery
    
    def cargaLlistaAmics(self):
        sql = "SELECT * FROM usuarisclase"
        self.cursor.execute(sql)
        ResQuery = self.cursor.fetchall()
        return ResQuery

    #/grupos
    def sacaGruposDelUser(self, username):
        sql = """SELECT gdu.grupo_id 
                FROM grupos_de_usuarios gdu
                JOIN usuarisclase u ON gdu.usuario_id = u.id
                WHERE u.username = %s" """
        self.cursor.execute(sql, (username))
        ResQuery = self.cursor.fetchall()
        return ResQuery
    
    def creaGrupos(self, nom, descripcio, creador_id):

        sql = """INSERT INTO grupos(nom, descripcio, creador_id)
                VALUES (%s, %s, %s, %s)"""
        self.cursor.execute(sql, (nom, descripcio, creador_id)) #creador el que crida a l'api
        ResQuery = self.cursor.fetchall()
        return ResQuery
    

    def cargaMensajesAmigos(self):
        sql = """SELECT emisor_id, receptor_id, contenido, fecha_envio, estado FROM  mensajes_usuarios mu 
                JOIN usuarisclase u ON mu.id = u.id"""
        self.cursor.execute(sql)
        ResQuery = self.cursor.fetchall()
        return ResQuery
    
    def cargaMensajesAmigo(self, username):
        sql = """SELECT emisor_id, receptor_id, contenido, fecha_envio, estado FROM  mensajes_usuarios mu 
                JOIN usuarisclase u ON mu.id = u.id
                WHERE u.username like '%s'
                """
        self.cursor.execute(sql, (username))
        ResQuery = self.cursor.fetchall()
        return ResQuery
    
    
    
    def enviaMensajesAmigos(self, emisor, receptor, contenido, fecha):
        sql = """ INSERT INTO mensajes_usuarios (emisor_id, receptor_id, contenido, fecha_envio) 
        VALUES (%s, %s, %s, %s); """
        self.cursor.execute(sql, (emisor, receptor, contenido, fecha))
        ResQuery = self.cursor.fetchall()
        return ResQuery
    
    def modificaEstatMissatgeUsuarios(self, estat, missatge_id):
        sql = """ UPDATE mensajes_usuarios 
                SET estado = "'%s'"
                WHERE id LIKE '%s' """
        self.cursor.execute(sql, (estat, missatge_id))
        ResQuery = self.cursor.fetchone()
        return ResQuery

                        
    def check_missatge (self,missatge_id,missatge_grup) :
        sql = "SELECT * FROM missatges WHERE missatge_id = %s and missatge_grup = %s"
        self.cursor.execute(sql, (missatge_id, missatge_grup))
        update_sql = "UPDATE missatges SET estat = 'vist' WHERE missatge_id = %s and missatge_grup = %s"
        self.cursor.execute(update_sql, (missatge_id, missatge_grup))
        ResQuery = self.cursor.fetchall()
        return ResQuery
    
    

