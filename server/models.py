from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class User(db.Model, SerializerMixin):
    pass

class Recipe(db.Model, SerializerMixin):
    pass

class Favorite(db.Model, SerializerMixin):
    pass