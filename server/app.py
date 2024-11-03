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
        if not username or not email or not password:
            return {'Error':'All fields must be submitted'}, 400
        
        user = User()
        for field in ['username', 'email', 'password']:
            setattr(user, field, data.get(field))

        try:
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return user.to_dict(), 201
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
            return {'Error': str(ve)}, 422

class RecipeDetail(Resource):
    
    def get(self, id):
        recipe = Recipe.query.filter(Recipe.id == id).first()
        if recipe:
            return recipe.to_dict(), 200
        else:
            return {'Error' : 'Recipe not found'}, 404

    def put(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'Error' : 'Must be signed in'}, 401
        recipe = Recipe.query.filter(Recipe.id == id).first()
        if not recipe:
            return {'Error': 'Recipe not found'}, 404
        if not recipe.user_id == user_id:
            return {'Error' : 'Unauthorized Page'}, 403
        
        data = request.get_json()
        try:
            for field in ['title', 'instructions', 'minutes_to_complete', 'image']:
                if field in data:
                    setattr(recipe, field, data.get(field))
            db.session.commit()
            return recipe.to_dict(), 200
        except ValueError as ve:
            db.session.rollback()
            return {'Error': str(ve)}, 422

    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'Error' : 'Must be signed in'}, 401
        recipe = Recipe.query.filter(Recipe.id == id).first()
        if not recipe:
            return {'Error': 'Recipe not found'}, 404
        if not recipe.user_id == user_id:
            return {'Error' : 'Unauthorized Page'}, 403
        
        try:
            db.session.delete(recipe)
            db.session.commit()
            return {'message': 'Recipe deleted'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500


class FavoriteCollection(Resource):

    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'Error':'Must be signed in'}, 401
        
        favorites = Favorite.query.filter(Favorite.user_id == user_id).all()
        return [favorite.to_dict() for favorite in favorites], 200

    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {'Error':'Must be signed in'}, 401
        
        data = request.get_json()
        note = data.get('note', '')
        recipe_id = data.get('recipe_id')

        if not recipe_id:
            return {'Error': 'Please provide the id of the recipe you wish to be favorited'}
        
        existing_favorite = Favorite.query.filter(Favorite.user_id == user_id, Favorite.recipe_id == recipe_id).first()
        if existing_favorite:
            return {'Error': 'Recipe is already in your Favorites'}, 401
        
        favorite = Favorite(user_id = user_id, recipe_id=recipe_id, note=note)

        try:
            db.session.add(favorite)
            db.session.commit()
            return favorite.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'Error': str(e)}, 500

class FavoriteDetail(Resource):

    def get(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'Error':'Must be signed in'}, 401
        favorite = Favorite.query.filter(Favorite.id == id, Favorite.user_id == user_id).first()
        if not favorite:
            return {'Error' : 'Favorite not found'}, 404

        return favorite.to_dict(), 200

    def put(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'Error' : 'Must be signed in'}, 401
        favorite = Favorite.query.filter(Favorite.id == id, Favorite.user_id == user_id).first()
        if not favorite:
            return {'Error': 'Favorite not found'}, 404
        
        data = request.get_json()
        if 'note' in data:
            favorite.note = data['note']
        else:
            return {'Error': 'No data provided to update'}, 400
        
        try:
            db.session.commit()
            return favorite.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {'Error': str(e)}, 500
        

    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {'Error': 'Must be signed in'}, 401

        favorite = Favorite.query.filter_by(id=id, user_id=user_id).first()
        if not favorite:
            return {'Error': 'Favorite not found'}, 404

        try:
            db.session.delete(favorite)
            db.session.commit()
            return {'message': 'Favorite deleted'}, 200
        except Exception as e:
            db.session.rollback()
            return {'Error': str(e)}, 500


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
api.add_resource(RecipeDetail, '/recipes/<int:id>', endpoint='recipe_detail')
api.add_resource(FavoriteCollection, '/favorites', endpoint='favorites')
api.add_resource(FavoriteDetail, '/favorites/<int:id>', endpoint='favorites_detail')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

