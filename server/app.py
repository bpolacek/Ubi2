from flask import request, make_response, jsonify, session, Flask
from flask_restful import Resource, Api, reqparse
from models import db, User, Relationship, RelationshipType, Message, FriendRequest
from config import app, bcrypt
from sqlalchemy import or_
from functools import wraps


api = Api(app)

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
        print(password)
        print("User Object", user.email)

        if user:
            print("User found")
        if user.authenticate(password):  # use the check_password method
            print("Password authenticated.")
            try:
                auth_token = user.encode_auth_token(user.id)
                print(auth_token)
                user_data = {'id':user.id, 'email':user.email, 'password':password}
                return {'auth_token': auth_token, 'user_data':user_data}, 200  # Decode the byte string to normal string
            except Exception as e:
                print(e)
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

class FriendRequestResource(Resource):
    @token_required
    def get(self, current_user):
        requests=FriendRequest.query.all()
        requests_dict=[request.to_dict() for request in requests]
        return make_response(
            requests_dict,
            200
        )
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
            return {"message": "Friend request accepted."}, 200
        elif args['action'].lower() == 'reject':
            db.session.delete(friend_request)
            db.session.commit()
            return {"message": "Friend request rejected."}, 200
        else:
            return {"message": "Invalid action. Allowed actions are 'accept' and 'reject'."}, 400

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
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_1', type=int, required=True, help="User 1 ID is required.")
        parser.add_argument('user_2', type=int, required=True, help="User 2 ID is required.")
        parser.add_argument('relationship_type', type=int, required=True, help="Relationship type is required.")
        args = parser.parse_args()

        relationship = Relationship(
            user_1=args['user_1'],
            user_2=args['user_2'],
            relationship_type=args['relationship_type']
        )
        db.session.add(relationship)
        db.session.commit()
        return {"message": "Relationship created successfully."}, 201

api.add_resource(Relationships, '/relationships')

@app.route('/protected', methods=['GET'])
@token_required
def protected_route(current_user):
    return jsonify({'message': f'Hello, {current_user.first_name}!'})


if __name__ == '__main__':
    app.run(port=5555, debug=True, host="10.129.3.45")   