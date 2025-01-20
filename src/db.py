import pymysql
import pymysql.cursors

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Email, Length

class Connexio(object):
    def conecta(self):
        self.db = pymysql.connect(
            host="localhost",
            user="root",
            db="",
            charset="utf8mb4",
            autocommit=True,
            cursorclass=pymysql.cursors.DictCursor,
        )
        self.cursor = self.db.cursor()

    def desconecta(self):
        self.db.close()
        
