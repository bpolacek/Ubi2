from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import bcrypt, db, app
import jwt as pyjwt
from datetime import datetime, timedelta, timezone
from sqlalchemy import Table, Text
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room

association_table = Table('association', db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('relationship_id', db.Integer, db.ForeignKey('relationships.id'))
)

class Relationship(db.Model, SerializerMixin):
    __tablename__="relationships"

    id=db.Column(db.Integer, primary_key=True)

    # user_1=db.Column(db.Integer, default=None)
    # user_2=db.Column(db.Integer, db.ForeignKey('users.id'))
    relationship_type=db.Column(db.Integer, db.ForeignKey('relationshiptypes.id'))

    users = db.relationship('User', secondary=association_table, back_populates='relationships')
    relationship_types=db.relationship('RelationshipType', back_populates='relationships')

    serialize_rules=('-relationship_types', 'users')

    @property
    def user_1_name(self):
        return f"{self.users[0].first_name} {self.users[0].last_name}"

    @property
    def user_2_name(self):
        return f"{self.users[1].first_name} {self.users[1].last_name}"

class User(db.Model, SerializerMixin):
    __tablename__="users"

    id=db.Column(db.Integer, primary_key=True)
    first_name=db.Column(db.String, nullable=False)
    last_name=db.Column(db.String, nullable=False)
    image=db.Column(db.String)
    email=db.Column(db.String, unique=True, nullable=False)
    phone_number=db.Column(db.String, nullable=False)
    _password_hash=db.Column(db.String, nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    relationships = db.relationship('Relationship', secondary=association_table, back_populates='users')
    messages = db.relationship('Message', back_populates='users')


    serialize_rules=('-relationships', '-messages', )

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
            password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
            self._password_hash = password_hash.decode('utf-8')
    
    def authenticate(self, password):
        is_authenticated = bcrypt.check_password_hash(self._password_hash.encode('utf-8'), password.encode('utf-8'))
        print(f'Is authenticated: {is_authenticated}')
        return is_authenticated
    
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

    def serialize(self):
        return{
            'id':self.id,
            'message':self.message,
            'user_1':self.user_1,
            'user_2':self.user_2,
            'timestamp': self.created_at.isoformat() if self.created_at else None
        }

class FriendRequest(db.Model, SerializerMixin):
    __tablename__="friendrequests"

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    requested_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    requester = db.relationship('User', foreign_keys=[requester_id])
    requested = db.relationship('User', foreign_keys=[requested_id])


