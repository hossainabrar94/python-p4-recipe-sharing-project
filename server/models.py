from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db, bcrypt


# One-to-Many Relationship - User has many Recipes
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-recipes.user', '-favorites.user' , '-favorites.recipe', '-_password_hash')

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, nullable = False, unique = True)
    email = db.Column(db.String, nullable = False, unique = True)
    _password_hash = db.Column(db.String, nullable = False)
    
    # Creating one-to-many relationship - a user can have many recipes
    recipes = db.relationship('Recipe', back_populates = 'user', cascade = 'all, delete-orphan')
    # creating many-to-many relationship - a user can have many favorite recipes
    favorites = db.relationship('Favorite', back_populates = 'user', cascade = 'all, delete-orphan')

    # Association Proxy connecting many-to-many between users and recipes table
    favorite_recipes = association_proxy('favorites', 'recipe')

    @property
    def password(self):
        raise AttributeError('Not a readable attribute')
    @password.setter
    def password(self, password):
        if len(password) < 4:
            raise ValueError('Please enter a password with at least 4 characters') 
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    @validates('email')
    def validate_email(self, key, address):
        if '@' not in address:
            raise ValueError('Please enter a valid email address')
        return address



# One-to-Many Relationship
class Recipe(db.Model, SerializerMixin):
    __tablename__ = 'recipes'

    serialize_rules = ('-user.recipes','-favorites.recipe', '-favorites.user')

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable = False)
    instructions = db.Column(db.String, db.CheckConstraint('LENGTH(instructions) > 49'), nullable = False)
    minutes_to_complete = db.Column(db.Integer)
    image = db.Column(db.String)

    # Foreign Key created on the many side to point to 1 user
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)

    # Relationship variables
    user = db.relationship('User', back_populates='recipes')
    # creating many-to-many relationship - a recipe can be favorited many times
    favorites = db.relationship('Favorite', back_populates = 'recipe', cascade = 'all, delete-orphan')

    # Association Proxy connecting many-to-many between users and recipes table
    users_who_favorited = association_proxy('favorites', 'user')
    
    # ensuring lengthy instructions
    @validates('instructions')
    def validate_instructions(self, key, instructions):
        if len(instructions) < 50:
            raise ValueError('Please add some more details to the recipe instruction')
        return instructions



# Many-to-Many Relationship - User can Favorite many Recipes and Recipes can be Favorited by many Users
class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    serialize_rules = ('-user.favorites', '-user.recipes', '-recipe.favorites', '-recipe.user')

    id = db.Column(db.Integer, primary_key = True)
    note = db.Column(db.String) # allows users to add a note-to-self when the favorite a recipe ie. 'add less sugar next time'
    
    # Foreign Key created on the many side to point to 1 user
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable = False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable = False)

    # Relationship variables
    user = db.relationship('User', back_populates = 'favorites')
    recipe = db.relationship('Recipe', back_populates = 'favorites')

    # Unique constraint to prevent duplicate favorites
    __table_args__ = (db.UniqueConstraint('user_id', 'recipe_id', name = 'unique_favorited_recipe'), )