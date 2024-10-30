#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Recipe, Favorite


# Views go here!
class Signup(Resource):
    
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username and not email and not password:
            return {'Error':'All fields must be submitted'}, 400
        
        user = User()
        for field in ['username', 'email', 'password']:
            setattr(user, field, data.get(field))

        try:
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
        except IntegrityError:
            db.session.rollback()
            return {'Error': 'username or email already exists'}, 422
        
class Login(Resource):
    
    def post(self):
        user = User.query.filter(User.username == request.get_json().get('username')).first()
        if user and user.authenticate(request.get_json().get('password')):
            session['user_id'] = user.id
            return user.to_dict(), 200
        else:
            return {'Error':'Incorrect Username or password'}, 401

class Logout(Resource):
    
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None
            return {}, 204
        else:
            return {'Error': 'User not logged in'}, 401

class RecipeCollection(Resource):
    
    def get(self):
        recipes = [recipe.to_dict() for recipe in Recipe.query.all()]
        return recipes, 200
    
    def post(self):
        user_id = session.get('user_id')
        
        if not user_id:
            return {'Error':'Must be signed in'}, 401
        
        data = request.get_json()
        try:
            recipe = Recipe()
            for field in ['title', 'instructions', 'minutes_to_complete', 'image']:
                setattr(recipe, field, data.get(field))
            recipe.user_id = user_id 
            db.session.add(recipe)
            db.session.commit()
            return recipe.to_dict(), 201
        except ValueError as ve:
            db.session.rollback()
            return {'error': str(ve)}, 422

class RecipeDetail(Resource):
    
    def get(self, id):
        recipe = Recipe.query.filter(Recipe.id == id).first()
        if recipe:
            return recipe.to_dict(), 201
        else:
            return {'error' : 'Recipe not found'}, 404

    def put(self, id):
        user_id = session['user_id']
        if not user_id:
            return {'error' : 'Must be signed in'}, 401
        recipe = Recipe.query.filter(Recipe.id == id).first()
        if not recipe:
            return {'error': 'Recipe not found'}, 404
        if not recipe.user_id == user_id:
            return {'error' : 'Unauthorized Page'}, 403
        
        data = request.get_json()
        try:
            for field in ['title', 'instructions', 'minutes_to_complete', 'image']:
                if field in data:
                    setattr(recipe, field, data.get(field))
            db.session.commit()
            return recipe.to_dict(), 200
        except ValueError as ve:
            db.session.rollback()
            return {'error': str(ve)}, 422

    def delete(self, id):
        pass

class CheckSession(Resource):
    
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200
        return {'Error': 'Unauthorized'}, 401


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(RecipeCollection, '/recipes', endpoint='recipes')
api.add_resource(RecipeDetail, '/recipes/<int:id>', endpoint='recipes_detail')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

