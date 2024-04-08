async function getRecipes() {
    try {
        const response = await fetch('recipes.js');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error fetching data', error);
        return [];
    }
}

// RECIPES COUNT PARAGRAPH
const recipesCountP = document.createElement('p');
recipesCountP.classList.add('recipes-count');
const tagsDiv = document.getElementById('tags');
const container = document.querySelector('.container');
container.appendChild(recipesCountP);

// TOGGLE VISIBILITY OF INGREDIENTS TAGS
const ingredientsBtn = document.getElementById('ingredients-btn');
const ingredientsDropdown = document.getElementById('ingredients-dropdown');
const ingedientsDropdownBtn = document.getElementById('ingredients-dropdown-btn');
ingredientsBtn.addEventListener('click', () => {
    ingredientsDropdown.style.display = 'block'
})
ingedientsDropdownBtn.addEventListener('click', () => {
    ingredientsBtn.style.display = 'flex';
    ingredientsDropdown.style.display = 'none'
})

// CREATE CARD
async function createCard(recipe, recipesDiv) {
    const card = document.createElement('div');
    card.classList.add('card');
            
    const cardImage = document.createElement('img');
    cardImage.classList.add('card-image');
    cardImage.setAttribute('src', `assets/images/plats/${recipe.image}`);
    cardImage.setAttribute('alt', recipe.name);

    const time = document.createElement('p');
    time.classList.add('time');
    time.textContent = `${recipe.time}min`;

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');
            
    const cardTitle = document.createElement('h2');
    cardTitle.textContent = recipe.name;

    const cardSection = document.createElement('h3');
    cardSection.textContent = "RECETTE";

    const recetteDiv = document.createElement('div');
    recetteDiv.classList.add('recette');

    const recette = document.createElement('p');
    recette.textContent = recipe.description;

    const cardSection2 = document.createElement('h3');
    cardSection2.textContent = "INGRÉDIENTS";

    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.classList.add('ingredients');
            
    recipe.ingredients.forEach(ingredient => {
        const ingredientDiv = document.createElement('div');
        ingredientDiv.classList.add('ingredient');

        const ingredientName = document.createElement('p');
        ingredientName.textContent = ingredient.ingredient;

        const ingredientQty = document.createElement('p');
        ingredientQty.textContent = ingredient.quantity;
        ingredientQty.classList.add('quantity');

        ingredientDiv.appendChild(ingredientName);
        ingredientDiv.appendChild(ingredientQty);
        ingredientsDiv.appendChild(ingredientDiv);
    });
            
    cardContent.appendChild(cardTitle);
    cardContent.appendChild(cardSection);
    cardContent.appendChild(recetteDiv);
    cardContent.appendChild(cardSection2);
    cardContent.appendChild(ingredientsDiv);

    recetteDiv.appendChild(recette);

    card.appendChild(time);
    card.appendChild(cardImage);
    card.appendChild(cardContent);

    recipesDiv.appendChild(card);
}

///////////////    ///////////////    ///////////////    ///////////////

const searchInput = document.getElementById('search');
const searchIngredientsInput = document.getElementById('search-ingredients');
const ingredients = document.getElementById('ingredients');
const ingredientTags = document.querySelectorAll('.ingredient-tag');

// UPDATE RECIPES COUNT
function updateRecipesCount(count) {
    recipesCountP.textContent = `${count} recettes`;
}

// DISPLAY ALL RECIPES
async function displayAllCards() {
    const recipes = await getRecipes();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    let recipesCount = 0;

    recipes.forEach(recipe => {
        recipesCount++;
        createCard(recipe, recipesDiv)
    })
    updateRecipesCount(recipesCount);
    displayIngredientsTags();
}

// RECIPES FILTERED BY SEARCH
async function displayCardsBySearch() {
    const recipes = await getRecipes();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    let recipesCount = 0;
    const searchInputValue = searchInput.value.toLowerCase();

    recipes.forEach(recipe => {
        if (
            recipe.name.toLowerCase().includes(searchInputValue) ||
            recipe.description.toLowerCase().includes(searchInputValue) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchInputValue))
        ) {
            recipesCount++;
            createCard(recipe, recipesDiv)
        }
    });
    updateRecipesCount(recipesCount);
    displayIngredientsTags();
}

// DISPLAY INGREDIENTS TAGS
async function displayIngredientsTags() {
    const recipes = await getRecipes();
    const searchInputValue = searchInput.value.toLowerCase();
    ingredients.innerHTML = '';
    let uniqueIngredients = [];

    let filteredRecipes = recipes;

    if (searchInputValue !== '') {
        filteredRecipes = recipes.filter(recipe => {
            return (
                recipe.name.toLowerCase().includes(searchInputValue) ||
                recipe.description.toLowerCase().includes(searchInputValue) ||
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchInputValue))
            );
        });
    }

    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            if ((ingredient.ingredient.toLowerCase().includes(searchIngredientsInput.value.toLowerCase())) && (!uniqueIngredients.includes(ingredient.ingredient.toLowerCase()))) {
                const ingredientTag = document.createElement('p');
                ingredientTag.textContent = ingredient.ingredient;
                ingredientTag.classList.add('ingredient-tag');

                ingredientTag.addEventListener('click', () => {
                    if (!selectedIngredients.includes(ingredient.ingredient.toLowerCase())) {
                        selectedIngredients = [...selectedIngredients, ingredient.ingredient.toLowerCase()];
                        ingredients.prepend(ingredientTag);
                        ingredientTag.style.backgroundColor = '#FFD15B';
                    } else {
                        selectedIngredients = selectedIngredients.filter(item => item !== ingredient.ingredient.toLowerCase());
                        ingredientTag.remove();
                        ingredientTag.style.backgroundColor = ''; 
                    }
                    displayCardsByIngredientTags();
                });
                
                
                ingredients.appendChild(ingredientTag);
                uniqueIngredients.push(ingredient.ingredient.toLowerCase());
            }
        });
    });
}

let selectedIngredients = [];

// RECIPES FILTERED BY INGREDIENTS TAGS
async function displayCardsByIngredientTags() {
    const recipes = await getRecipes();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    let recipesCount = 0;
    
    recipes.forEach(recipe => {
        if (selectedIngredients.every(selectedIngredient => recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === selectedIngredient))) {
            recipesCount++;
            createCard(recipe, recipesDiv);
        }
    });
    updateRecipesCount(recipesCount);
    displayIngredientsTags()
} 

// EVENT LISTENERS
searchInput.addEventListener('input', () => {
    if (searchInput.value.toLowerCase().length >= 3) {
        displayCardsBySearch();
    } else {
        displayAllCards()
        displayIngredientsTags();
    }
    displayIngredientsTags();
});

searchIngredientsInput.addEventListener('input', () => {
    displayIngredientsTags()
})


displayIngredientsTags()
displayAllCards();