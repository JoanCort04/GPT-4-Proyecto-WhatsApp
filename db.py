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
    
    
    def check_missatge (self,missatge_id,missatge_grup) :
        sql = "SELECT * FROM missatges WHERE missatge_id = %s and missatge_grup = %s"
        self.cursor.execute(sql, (missatge_id, missatge_grup))
        update_sql = "UPDATE missatges SET estat = 'vist' WHERE missatge_id = %s and missatge_grup = %s"
        self.cursor.execute(update_sql, (missatge_id, missatge_grup))
        ResQuery = self.cursor.fetchall()
        return ResQuery
    
    

