from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import bcrypt, db, app
import jwt as pyjwt
from datetime import datetime, timedelta, timezone


class User(db.Model, SerializerMixin):
    __tablename__="users"

    id=db.Column(db.Integer, primary_key=True)
    first_name=db.Column(db.String, nullable=False)
    last_name=db.Column(db.String, nullable=False)
    image=db.Column(db.String)
    email=db.Column(db.String, unique=True, nullable=False)
    phone_number=db.Column(db.Integer, nullable=False)
    _password_hash=db.Column(db.String, nullable=False)

    relationships = db.relationship('Relationship', back_populates= 'users')
    messages = db.relationship('Message', back_populates='users')

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
            password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
            self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
         return bcrypt.check_password_hash(
             self._password_hash, password.encode('utf-8'))
    
    def encode_auth_token(self, user_id):
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(days=0, seconds=5),
                'iat': datetime.utcnow(),
                'sub': user_id
            }
            return pyjwt.encode(
                payload,
                app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            raise Exception(f"{type(e).__name__}: {str(e)}")
        
    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = pyjwt.decode(auth_token, app.config.get('SECRET_KEY'))
            return payload['sub']
        except pyjwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except pyjwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'
        

class Relationship(db.Model, SerializerMixin):
    __tablename__="relationships"

    id=db.Column(db.Integer, primary_key=True)

    user_1=db.Column(db.Integer, default=None)
    user_2=db.Column(db.Integer, db.ForeignKey('users.id'))
    relationship_type=db.Column(db.Integer, db.ForeignKey('relationshiptypes.id'))

    users = db.relationship('User', back_populates='relationships')
    relationship_types=db.relationship('RelationshipType', back_populates='relationships')

class RelationshipType(db.Model, SerializerMixin):
    __tablename__="relationshiptypes"

    id=db.Column(db.Integer, primary_key=True)
    type=db.Column(db.String)
    
    relationships=db.relationship('Relationship', back_populates='relationship_types')

class Message(db.Model, SerializerMixin):
    __tablename__="messages"

    id=db.Column(db.Integer, primary_key=True)
    message=db.Column(db.String)
    created_at=db.Column(db.DateTime, server_default=db.func.now())

    user_1=db.Column(db.Integer, default=None)
    user_2=db.Column(db.Integer, db.ForeignKey('users.id'))

    users=db.relationship('User', back_populates='messages')
