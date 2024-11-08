#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from itertools import product
import random

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Recipe, Favorite

if __name__ == '__main__':
    
    fake = Faker()
    
    with app.app_context():
        print("Deleting all records...")
        Favorite.query.delete()
        Recipe.query.delete()
        User.query.delete()
        db.session.commit()
        
        print("Start creating Users...")
        users = []

        for i in range(5):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                password= 'password123'
            )
            users.append(user)
        db.session.add_all(users)
        db.session.commit()

        print("Creating recipes...")
        recipes = []
        for i in range(20):
            recipe = Recipe(
                title=fake.sentence(nb_words=6),
                instructions=fake.paragraph(nb_sentences=6),
                minutes_to_complete=randint(10, 120),
                image=fake.image_url(),
                user_id=rc(users).id
            )
            recipes.append(recipe)
        db.session.add_all(recipes)
        db.session.commit()

        print("Creating favorites...")
        favorites = []
        user_recipe_pairs = list(product(users, recipes))
        random.shuffle(user_recipe_pairs)

        for user, recipe in user_recipe_pairs[:30]:
            favorite = Favorite(
                note=fake.sentence(nb_words=10),
                user_id=user.id,
                recipe_id=recipe.id
            )
            favorites.append(favorite)
        db.session.add_all(favorites)
        db.session.commit()
        print(f"Number of favorites created: {len(favorites)}")

        print("Seeding has completed!")