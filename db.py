import pymysql
import pymysql.cursors

class Connexio(object):
    def conecta(self):
        self.db = pymysql.connect(
            host="localhost",  
            user="root",
            db="whatsapp2425",
            charset="utf8mb4",
            autocommit=True,
            cursorclass=pymysql.cursors.DictCursor,
        )
        self.cursor = self.db.cursor()

    def desconecta(self):
        self.db.close()

    def cargaUsuaris(self):
        sql = "select * from usuarisclase"
        self.cursor.execute(sql)
        ResQuery = self.cursor.fetchall()
        return ResQuery
