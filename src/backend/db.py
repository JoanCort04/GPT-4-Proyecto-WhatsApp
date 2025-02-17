import pymysql # type: ignore
import pymysql.cursors # type: ignore


class Connexio(object):
    def conecta(self):
        self.db = pymysql.connect(
            host="192.168.193.133",  
            # host="localhost",  
            port=3306,
            user="joancortes",
            # user="root",
            password="43481462P",
            db="gpt4",
            # db="whatsapp2425",
            charset="utf8mb4",
            autocommit=True,
            cursorclass=pymysql.cursors.DictCursor,
        )
        self.cursor = self.db.cursor()

    def desconecta(self):
        self.db.close()

    def cargaUsuari(self, username, password):
        sql = (" SELECT * FROM usuarisclase WHERE username = %s and password = %s ") 
        self.cursor.execute(sql, (username, password))
        ResQuery = self.cursor.fetchall()
        return ResQuery

    def cargaHashedPassword(self, username):
        sql = "SELECT password FROM usuarisclase WHERE username LIKE %s "
        self.cursor.execute(sql, (username))
        ResQuery = self.cursor.fetchone()
        return ResQuery['password']

    def cargaLlistaAmics(self):
        sql = "SELECT id,username FROM usuarisclase"
        self.cursor.execute(sql)
        ResQuery = self.cursor.fetchall()
        return ResQuery

    # /grupos
    def sacaGruposDelUser(self, username):
        sql = (
            " SELECT gdu.grupo_id , rol"
            " FROM grupos_de_usuarios gdu "
            " JOIN usuarisclase u ON gdu.usuario_id = u.id "
            " WHERE u.username = %s "
        )
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
        sql = """SELECT emisor_id, receptor_id, contenido, fecha_envio, estat FROM  mensajes_usuarios mu 
                JOIN usuarisclase u ON mu.id = u.id"""
        self.cursor.execute(sql)
        ResQuery = self.cursor.fetchall()
        return ResQuery

    def cargaMensajesAmigo(self, emisor_id, receptor_id):
        sql = """
            SELECT emisor_id, receptor_id, contenido, fecha_envio, estat
            FROM mensajes_usuarios
            WHERE (emisor_id = %s AND receptor_id = %s) 
            OR (emisor_id = %s AND receptor_id = %s)
            ORDER BY fecha_envio ASC;
        """
        self.cursor.execute(sql, (emisor_id, receptor_id, receptor_id, emisor_id))
        resultados = self.cursor.fetchall()
        print(f"Mensajes encontrados: {len(resultados)}")
        return resultados 
   
    def añadirAlGrupo(self, username):
        sql = (
                "INSERT INTO grupos_de_usuarios (grupo_id, usuario_id) "
                "VALUES (%s, (SELECT id FROM usuarisclase WHERE username = %s))"
            )

        self.cursor.execute(sql, (username))
        ResQuery = self.cursor.fetchall()
        return ResQuery

    # carga los mensajes de todos los grupos en los que este un usuario en concreto.
    def cargaMensajeGrupo(self, username):
        sql = """
        SELECT 
     	    g.nom AS nombre_grupo, 
            mg.contenido, 
            mg.fecha_envio,
            u_emisor.username AS emisor_username  -- Nombre del usuario que envió el mensaje
        FROM 
            mensajes_grupos mg 
        INNER JOIN 
            grupos g ON mg.id = g.id
        INNER JOIN 
            grupos_de_usuarios gdu ON gdu.grupo_id = g.id
        INNER JOIN 
            usuarisclase u ON u.id = gdu.usuario_id
        INNER JOIN 
            usuarisclase u_emisor ON u_emisor.id = mg.emisor_id  -- Unir con la tabla de usuarios para obtener el emisor
        WHERE 
            u.username = "%s" 
        ORDER BY 
            g.nom ASC, mg.fecha_envio ASC;
        """
        self.cursor.execute(sql, (username,))  # Asegúrate de pasar el parámetro como una tupla
        ResQuery = self.cursor.fetchall()
        return ResQuery

    def enviarMensajeGrupo(self, emisor, contenido, fecha, grup):
        sql = """ 
        INSERT INTO mensajes_grupo (emisor_id, contenido, fecha_envio) 
        SELECT %s, %s, %s 
        FROM grupos 
        WHERE grupos.nom = %s;
        """
        try:
            self.cursor.execute(sql, (emisor, contenido, fecha, grup))
            self.db.commit() 
            return True 
        except Exception as e:
            print(f"Error al enviar el mensaje: {e}")
            self.db.rollback() 
            return False

    def enviaMensajesAmigos(self, emisor_id, receptor_id, contenido):
            sql = """INSERT INTO mensajes_usuarios (emisor_id, receptor_id, contenido) 
                     VALUES (%s, %s, %s);"""
            self.cursor.execute(sql, (emisor_id, receptor_id, contenido))
     

    def transforma_Username_a_ID(self,username):
        sql = " SELECT id FROM usuarisclase WHERE username = %s; "
        self.cursor.execute(sql, (username,))
        ResQuery = self.cursor.fetchone()
        return ResQuery
    
    def transforma_Id_a_Username(self,id:int):
        sql = " SELECT username FROM usuarisclase WHERE id = %s; "
        self.cursor.execute(sql, (id,))
        ResQuery = self.cursor.fetchone()
        return ResQuery

    def modificaEstatMissatgeUsuarios(self, estat, missatge_id):
        sql = """ UPDATE mensajes_usuarios 
                SET estat = "'%s'"
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

    def sortir_grup(self, grup_id, usuari_id):
        update_sql = " DELETE FROM grupos_de_usuarios WHERE grupo_id = %s AND usuario_id LIKE = %s "
        
        self.cursor.execute(update_sql, (grup_id, usuari_id))
        ResQuery = self.cursor.fetchall()
        return ResQuery
