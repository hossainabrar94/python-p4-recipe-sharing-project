from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db, bcrypt

# Models go here!

# One-to-Many Relationship - User has many Recipes
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, nullable = False, unique = True)
    email = db.Column(db.String, nullable = False, unique = True)
    _password_hash = db.Column(db.String)
    
    # Creating one-to-many relationship - a user can have many recipes
    recipes = db.relationship('Recipe', back_populates = 'user', cascade = 'all')
    # Creating one-to-many relationship - a user can execute many ratings
    ratings = db.relationship('Rating', back_populates = 'user', cascase = 'all' )
    # creating many-to-many relationship - a user can have many favorite recipes
    favorites = db.relationship('Favorite', back_populates = 'user', cascade = 'all')

    @property
    def password(self):
        raise AttributeError('Not a readable attribute')
    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
    @validates('email')
    def validate_email(self, key, address):
        if '@' not in address:
            raise ValueError('Please enter a valid email address')



# One-to-Many Relationship - Recipe has many Ratings
class Recipe(db.Model, SerializerMixin):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable = False)
    instructions = db.Column(db.String, db.CheckConstraint('LENGTH(instructions) > 49'), nullable = False)
    minutes_to_complete = db.Column(db.Integer)
    image = db.Column(db.String)

    # Foreign Key created on the many side to point to 1 user
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Relationship variables
    user = db.relationship('User', back_populates='recipes')
    ratings = db.relationship('Rating', back_populates = 'recipe', cascade = 'all')
    # creating many-to-many relationship - a recipe can be favorited many times
    favorites = db.relationship('Favorite', back_populates = 'recipe', cascade = 'all')

    # Need to calculate avg rating for each cuisine
    def avg_rating(self):
        if self.ratings:
            rating_sum = sum(rate.rating for rate in self.ratings)
            return rating_sum/len(self.ratings)
        else:
            return None


# Many-to-Many Relationship - User can Favorite many Recipes and Recipes can be Favorited by many Users
class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key = True)
    note = db.Column(db.String) # allows users to add a note-to-self when the favorite a recipe ie. 'add less sugar next time'
    
    # Foreign Key created on the many side to point to 1 user
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'))

    # Relationship variables
    user = db.relationship('User', back_populates = 'favorites')
    recipe = db.relationship('Recipe', back_populates = 'favorites')



class Rating(db.Model, SerializerMixin):
    __tablename__ = 'ratings'
    id = db.Column(db.Integer, primary_key = True)
    rating = db.Column(db.Integer, db.CheckConstraint('1 < LENGTH(rating) < 6'))

    # Foreign Key created on the many side to point to 1 recipe
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # Relationship variables
    user = db.relationship('User', back_populates = 'ratings')
    recipe = db.relationship('Recipe', back_populates = 'ratings')