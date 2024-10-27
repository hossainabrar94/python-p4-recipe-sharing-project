from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!

# One-to-Many Relationship - User has many Recipes
class User(db.Model, SerializerMixin):
    pass


# One-to-Many Relationship - Recipe has many Ratings
class Recipe(db.Model, SerializerMixin):
    pass


# Many-to-Many Relationship - User can Favorite many Recipes and Recipes can be Favorited by many Users
class Favorite(db.Model, SerializerMixin):
    pass


class Rate(db.Model, SerializerMixin):
    pass