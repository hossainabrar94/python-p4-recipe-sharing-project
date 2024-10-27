#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Recipe, Favorite


# Views go here!
class Signup(Resource):
    pass

class Login(Resource):
    pass

class Logout(Resource):
    pass

class RecipeList(Resource):
    pass

class RecipeDetail(Resource):
    pass

class Favorite(Resource):
    pass

class Rating(Resource):
    pass

class New_Recipe(Resource):
    pass

class CheckSession(Resource):
    pass


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Favorite, '/favorites', endpoint='favorites')
api.add_resource(RecipeList, '/recipes', endpoint='recipes')
api.add_resource(RecipeDetail, '/recipes/<int:id>', endpoint='recipes_detail')
api.add_resource(Rating, '/recipes/rating', endpoint='rated_recipes')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

