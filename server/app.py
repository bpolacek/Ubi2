from flask import request, make_response, jsonify, session, Flask
from flask_restful import Resource, Api, reqparse
from models import db, User, Relationship, RelationshipType, Message, FriendRequest
from config import app, bcrypt
from sqlalchemy import or_
from functools import wraps
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime


api = Api(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace('Bearer ', '')

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            user_id = User.decode_auth_token(token)
            current_user = User.query.filter_by(id=user_id).first()
            print("this is the current user", {current_user})
        except Exception as e:
            return jsonify({'message': str(e)}), 401

        return f(current_user, *args, **kwargs)

    return decorated

class Signup(Resource):
    def post(self):
        data = request.get_json()
        new_user = User(
                first_name = data['first_name'],
                last_name = data['last_name'],
                email = data['email'],
                phone_number=data['phone_number'],
                password_hash = data['password']
            )
        
        db.session.add(new_user)
        db.session.commit()

        auth_token = new_user.encode_auth_token(new_user.id)

        
        response = make_response({'auth_token':auth_token, 'user': new_user.to_dict()}, 200)
        return response

api.add_resource(Signup, '/signup')

class Login(Resource):
    def post(self):
        data = request.get_json()

        user = User.query.filter_by(email=data['email']).first()
        password = data['password']

        if user.authenticate(password):  # use the check_password method
            try:
                auth_token = user.encode_auth_token(user.id)
                print(auth_token)
                user_data = {'id':user.id, 'first_name':user.first_name, 'email':user.email, 'password':password}
                return {'auth_token': auth_token, 'user_data':user_data}, 200  # Decode the byte string to normal string
            except Exception as e:
                return {"message": str(e)}, 500
        else:
            print("User not found")
            return {"message": "Invalid email or password"}, 401

api.add_resource(Login, '/login')

class Logout(Resource):
    def get(self):
        session.clear()
        return {"message":"You have successfully logged out."}, 200
    
api.add_resource(Logout, '/logout')

class Users(Resource):
    def get(self):
        users=User.query.all()
        user_dict=[user.to_dict() for user in users]
        return make_response(
            user_dict,
            200
        )
    
api.add_resource(Users, '/users')

class UserById(Resource):
     def patch(self, id):
        user = User.query.filter_by(id=id).first()
        data = request.get_json()
        
        if 'latitude' in data:
            user.latitude = data['latitude']
        if 'longitude' in data:
            user.longitude = data['longitude']

        db.session.add(user)
        db.session.commit()

        user_dict = user.to_dict()
        return make_response(user_dict, 200)

api.add_resource(UserById, '/users/<int:id>')

class FriendRequestResource(Resource):

    def get(self):
        requests=FriendRequest.query.all()
        requests_dict=[request.to_dict() for request in requests]
        return make_response(
            requests_dict,
            200
        )
    @token_required
    def post(self, current_user):
        parser = reqparse.RequestParser()
        parser.add_argument('requester_id', type=int, required=True, help="Requester ID is required.")
        parser.add_argument('requested_id', type=int, required=True, help="Requested ID is required.")
        args = parser.parse_args()

        friend_request = FriendRequest(requester_id=args['requester_id'], requested_id=args['requested_id'], status='pending')
        db.session.add(friend_request)
        db.session.commit()
        return {"message": "Friend request sent successfully."}, 201

api.add_resource(FriendRequestResource, '/friend_requests')

class FriendRequestResponseResource(Resource):
    def put(self, request_id):
        parser = reqparse.RequestParser()
        parser.add_argument('action', type=str, required=True, help="Action (accept/reject) is required.")
        args = parser.parse_args()

        friend_request = FriendRequest.query.get(request_id)
        if not friend_request:
            return {"message": "Friend request not found."}, 404

        if args['action'].lower() == 'accept':
            friend_request.status = 'accepted'
            db.session.commit()
            # Fetch the User objects from the database
            user_1 = User.query.get(friend_request.requester_id)
            user_2 = User.query.get(friend_request.requested_id)
            # Create a new Relationship and add the users to it
            relationship = Relationship(relationship_type=3)
            relationship.users.append(user_1)
            relationship.users.append(user_2)
            db.session.add(relationship)
            db.session.commit()
            return {"message": "Friend request accepted."}, 200
        # ...
api.add_resource(FriendRequestResponseResource, '/friend_requests/<int:request_id>/response')

class DeleteFriendResource(Resource):
    # @token_required
    # def delete(self, current_user, friendship_id):
    #     friendship = Relationship.query.get(friendship_id)
    #     if not friendship:
    #         return {"message": "Friendship not found."}, 404

    #     db.session.delete(friendship)
    #     db.session.commit()
    #     return {"message": "Friendship deleted successfully."}, 200
    @token_required
    def delete(self, current_user, friendship_id):
        friend_request = FriendRequest.query.get(friendship_id)
        if not friend_request:
            return {"message": "Friend request not found."}, 404

        db.session.delete(friend_request)
        db.session.commit()
        return {"message": "Friend request deleted successfully."}, 200

api.add_resource(DeleteFriendResource, '/friends/<int:friendship_id>')

class Relationships(Resource):
    def get(self):
        relationships=Relationship.query.all()
        relationship_dict=[r.to_dict() for r in relationships]
        return make_response(
            relationship_dict,
            200
        )

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_1', type=int, required=True, help="User 1 ID is required.")
        parser.add_argument('user_2', type=int, required=True, help="User 2 ID is required.")
        parser.add_argument('relationship_type', type=int, required=True, help="Relationship type is required.")
        args = parser.parse_args()

        # Fetch the User objects from the database
        user_1 = User.query.get(args['user_1'])
        user_2 = User.query.get(args['user_2'])
        # Create a new Relationship and add the users to it
        relationship = Relationship(relationship_type=args['relationship_type'])
        relationship.users.append(user_1)
        relationship.users.append(user_2)
        db.session.add(relationship)
        db.session.commit()
        return {"message": "Relationship created successfully."}, 201

api.add_resource(Relationships, '/relationships')

@app.route('/protected', methods=['GET'])
@token_required
def protected_route(current_user):
    return jsonify({'message': f'Hello, {current_user}!'})

class RelationshipbyId(Resource):
    def patch(self, id):
        relationship = Relationship.query.filter_by(id = id).first()
        data = request.get_json()
        for attr in data:
            setattr(relationship, attr, data[attr])
            db.session.add(relationship) 
            db.session.commit()
            relationship_dict=relationship.to_dict()

            return make_response(relationship_dict, 202)
        
    def delete(self, id):
        relationship = Relationship.query.get(id)
        if relationship:
            db.session.delete(relationship)
            db.session.commit()
            return {"message": "Relationship deleted successfully."}, 200
        else:
            return {"error": "Relationship not found."}, 404

api.add_resource(RelationshipbyId, '/relationships/<int:id>')

@socketio.on('send_message')
def handle_send_message(data):
    new_message = Message(message=data['message'], user_1=data['user_1'], user_2=data['user_2'])
    db.session.add(new_message)
    db.session.commit()
    print('Emitting new_message:', new_message.serialize())
    emit('new_message', new_message.serialize(), broadcast=True)

@socketio.on('get_messages')
def handle_get_messages():
    messages = Message.query.all()
    emit('load_messages', [message.serialize() for message in messages])

@socketio.on('edit_message')
def handle_edit_message(data):
    message = Message.query.get(data['id'])
    if message:
        message.message = data['message']
        db.session.commit()
        emit('message_edited', message.serialize(), broadcast=True)

@socketio.on('delete_message')
def handle_delete_message(data):
    message = Message.query.get(data['id'])
    if message:
        db.session.delete(message)
        db.session.commit()
        emit('message_deleted', {'id': data['id']}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, port=5555, debug=True, host="10.129.3.45")   

    # Home IP: http://192.168.86.120
# Flatiron IP: http://10.129.3.45:5555