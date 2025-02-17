import pymysql # type: ignore
import pymysql.cursors # type: ignore


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
        sql = """
             SELECT 
    gdu.grupo_id, 
    gdu.rol, 
    g.nom, 
    g.descripcio, 
    g.data_creacio, 
    g.creador_id
FROM 
    grupos_de_usuarios gdu
JOIN 
    grupos g ON gdu.grupo_id = g.id
JOIN 
	usuarisclase u ON gdu.usuario_id = u.id
	 WHERE u.username = %s;
        """

        self.cursor.execute(sql, (username))
        ResQuery = self.cursor.fetchall()
        return ResQuery

    def sacaIntegrantesGrupo(self, grupo_id):
        sql = """
            SELECT 
                u.id, u.username
            FROM 
                grupos_de_usuarios gdu
            JOIN 
                grupos g ON gdu.grupo_id = g.id
            JOIN 
                usuarisclase u ON gdu.usuario_id = u.id
            WHERE 
                gdu.grupo_id = %s;
        """

        self.cursor.execute(sql, (grupo_id))
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

    def cargaMensajesAmigo(self, emisor_id, receptor_id):
        sql = """
            SELECT emisor_id, receptor_id, contenido, fecha_envio, estado
            FROM mensajes_usuarios
            WHERE (emisor_id = %s AND receptor_id = %s) 
            OR (emisor_id = %s AND receptor_id = %s)
            ORDER BY fecha_envio DESC;
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

    def enviaMensajesAmigos(self, emisor_id, receptor_id, contenido):
        # Insertar mensaje con estado 'enviado'
        sql = """
        INSERT INTO mensajes_usuarios (emisor_id, receptor_id, contenido, estat) 
        VALUES (%s, %s, %s, 'enviado');
        """
        self.cursor.execute(sql, (emisor_id, receptor_id, contenido))
        self.conn.commit()  # Confirmar inserción

        # Ahora actualizamos el estado a 'rebut' después de la inserción
        update_sql = """
        UPDATE mensajes_usuarios 
        SET estat = 'rebut' 
        WHERE emisor_id = %s AND receptor_id = %s AND contenido = %s AND estat = 'enviado';
        """
        self.cursor.execute(update_sql, (emisor_id, receptor_id, contenido))
        self.conn.commit()  # Confirmar actualización

        return {"status": "success", "message": "Mensaje enviado y marcado como 'rebut'"}

    
    def enviaMensajesAmigos(self, emisor_id, receptor_id, contenido):
        sql = """ 
        INSERT INTO mensajes_usuarios (emisor_id, receptor_id, contenido) 
        VALUES (%s, %s, %s);
        """
        self.cursor.execute(sql, (emisor_id, receptor_id, contenido))

        return {"status": "success", "message": "Mensaje enviado correctamente"}

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
                SET estado = "'%s'"
                WHERE id LIKE '%s' """
        self.cursor.execute(sql, (estat, missatge_id))
        ResQuery = self.cursor.fetchone()
        return ResQuery

    def sortir_grup(self, grup_id, usuari_id):
        update_sql = " DELETE FROM grupos_de_usuarios WHERE grupo_id = %s AND usuario_id LIKE = %s "

        self.cursor.execute(update_sql, (grup_id, usuari_id))
        ResQuery = self.cursor.fetchall()
        return ResQuery


def marcar_como_visto(self, missatge_id, receptor_id):
    # Verificar si el mensaje está en estado 'rebut' y pertenece al receptor
    sql = """
    SELECT * FROM mensajes_usuarios 
    WHERE missatge_id = %s AND receptor_id = %s AND estat = 'rebut'
    """
    self.cursor.execute(sql, (missatge_id, receptor_id))
    mensaje = self.cursor.fetchone()

    if mensaje:
        update_sql = """
        UPDATE mensajes_usuarios 
        SET estat = 'llegit' 
        WHERE missatge_id = %s AND receptor_id = %s
        """
        self.cursor.execute(update_sql, (missatge_id, receptor_id))

        self.conn.commit()  # Confirmar cambios
        return {"status": "success", "message": "Estado actualizado a 'llegit'"}
    else:
        return {
            "status": "error",
            "message": "Mensaje no encontrado o no está en estado 'rebut'",
        }
