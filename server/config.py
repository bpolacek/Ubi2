from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_migrate import Migrate
from flask_cors import CORS
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)


app = Flask(__name__)
bcrypt = Bcrypt(app)
# CORS(app)
CORS(app)

app.config['SECRET_KEY']='secretkey123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

# Home IP: http://192.168.1.30
# Flatiron IP: http://10.129.3.45:5555