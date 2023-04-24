from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import bcrypt, db, app

class User(db.Model, SerializerMixin):
    __tablename__="users"

    id=db.Column(db.Integer, primary_key=True)
    first_name=db.Column(db.String, nullable=False)
    last_name=db.Column(db.String, nullable=False)
    image=db.Column(db.String)
    email_address=db.Column(db.String)
    phone_number=db.Column(db.Integer, nullable=False)
    _password_hash=db.Column(db.String, nullable=False)

class Relationship(db.Model, SerializerMixin):
    __tablename__="relationships"

    id=db.Column(db.Integer, primary_key=True)

    user_1=db.Column(db.Integer, default=None)
    user_2=db.Column(db.Integer, db.ForeignKey('users.id'))
    relationship_type=db.Column(db.Integer, db.ForeignKey('relationships_type.id'))

    

class RelationshipType(db.Model, SerializerMixin):
    __tablename__="relationshiptypes"

    id=db.Column(db.Integer, primary_key=True)
    type=db.Column(db.String)

class Message(db.Model, SerializerMixin):
    __tablename__="messages"

    id=db.Column(db.Integer, primary_key=True)
    message=db.Column(db.String)
    created_at=db.Column(db.DateTime, server_default=db.func.now())

    user_1=db.Column(db.Integer, default=None)
    user_2=db.Column(db.Integer, db.ForeignKey('users.id'))
