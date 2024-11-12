# The Recipe Hub

Welcome to The Recipe Hub, a full-stack web application where users can share their favorite recipes, explore others’ creations, and keep a personalized collection of their own. Users can also favorite recipes and add personal notes to them.

## Tree

### Backend

├── __pycache__
│   └── app.cpython-38.pyc
├── app.py
├── config.py
├── instance
│   └── app.db
├── migrations
│   ├── README
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions
│       └── 61af465bb0e6_looks_like_my_previous_migrations_were_.py
├── models.py
└── seed.py

### Frontend

├── components
│   ├── App.js
│   ├── Header.js
│   ├── LoginForm.js
│   ├── RecipeCard.js
│   └── SignUpForm.js
├── index.css
├── index.js
├── pages
│   ├── CreateRecipePage.js
│   ├── EditRecipePage.js
│   ├── FavoritesPage.js
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── MyRecipesPage.js
│   ├── RecipeDetailPage.js
│   └── SignUpPage.js
└── styles
    ├── Box.js
    ├── Button.js
    ├── Error.js
    ├── FormField.js
    ├── Input.js
    ├── Label.js
    ├── Textarea.js
    └── index.js

## Features

	•	User Authentication: Sign up and log in securely.
	•	Recipe Management: Create, edit, and delete your own recipes.
	•	Recipe Browsing: View recipes shared by all users.
	•	Favorites: Add recipes to your favorites with personal notes.
	•	Personalized Notes: Add and edit notes on your favorited recipes.
	•	Responsive Design: User-friendly interface adaptable to various devices.

## Running the Application

Ensure both the backend and frontend servers are running:
	•	Backend: http://localhost:5000
	•	Frontend: http://localhost:3000

Visit http://localhost:3000 in your web browser to access the application.

## App Usage

Sign Up and Login

	•	Sign Up: Click on the “Sign Up” button and provide a username, email, and password to create a new account.
	•	Login: Use your credentials to log in to the application.

Creating Recipes

	•	Navigate to “Share a Recipe” to create a new recipe.
	•	Provide the recipe title, instructions, cook time, and an image URL.
	•	Submit the form to add the recipe to the shared collection.

Viewing Recipes

	•	The home page displays all recipes shared by users.
	•	Click on a recipe card to view its details.

Managing Your Recipes

	•	Navigate to “My Recipes” to view recipes you’ve created.
	•	From the recipe detail page, you can edit or delete your recipes.

Favoriting Recipes

	•	On a recipe detail page, click “Add to Favorites” to favorite a recipe.
	•	A prompt will appear to add a personal note.
	•	Your favorited recipes are accessible under “Favorites”.

Managing Favorites

	•	View all your favorited recipes under the “Favorites” section.
	•	Your personal notes are displayed alongside the recipes.
	•	You can remove a recipe from your favorites or edit your note.