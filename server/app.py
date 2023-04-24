from flask import request, make_response, jsonify, session
from flask_restful import Resource, Api
from models import db, User, Relationship, RelationshipType, Message
from config import app, bcrypt
from sqlalchemy import or_

api = Api(app)
app.secret_key = 'secretkey123'


if __name__ == '__main__':
    app.run(port=5555, debug=True)   