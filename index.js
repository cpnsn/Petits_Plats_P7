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
// const tagsDiv = document.getElementById('tags');
const container = document.querySelector('.container');
container.appendChild(recipesCountP);

// TOGGLE TAGS VISIBILITY
function toggleTagsVisibility(buttonId, dropdownId, dropdownBtnId) {
    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);
    const dropdownBtn = document.getElementById(dropdownBtnId);
    button.addEventListener('click', () => {
        dropdown.style.display = 'block'
    })
    dropdownBtn.addEventListener('click', () => {
        button.style.display = 'flex';
        dropdown.style.display = 'none'
    })
}
toggleTagsVisibility('ingredients-btn', 'ingredients-dropdown', 'ingredients-dropdown-btn');
toggleTagsVisibility('appareils-btn', 'appareils-dropdown', 'appareils-dropdown-btn');
toggleTagsVisibility('ustensiles-btn', 'ustensiles-dropdown', 'ustensiles-dropdown-btn');

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



const searchInput = document.getElementById('search');
const searchIngredientsInput = document.getElementById('search-ingredients');
const ingredients = document.getElementById('ingredients');
// const ingredientTags = document.querySelectorAll('.ingredient-tag');
const selectedTagsDiv = document.getElementById('selected-tags')

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
    let hasRecipes = false;

    recipes.forEach(recipe => {
        if (
            recipe.name.toLowerCase().includes(searchInputValue) ||
            recipe.description.toLowerCase().includes(searchInputValue) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchInputValue))
        ) {
            recipesCount++;
            createCard(recipe, recipesDiv)
            hasRecipes = true;
        }
    });

    if (!hasRecipes) { 
        const noRecipes = document.createElement('p');
        noRecipes.classList.add('no-recipes');
        noRecipes.textContent = `Aucune recette ne contient "${searchInputValue}", vous pouvez chercher "tarte aux pommes", "poisson", etc.`;
        recipesDiv.appendChild(noRecipes);
    }

    updateRecipesCount(recipesCount);
    displayIngredientsTags();
}

function createIngredientTag(ingredient) {
    const capitalizedIngredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);

    const ingredientTag = document.createElement('p');
    ingredientTag.textContent = capitalizedIngredient;
    // ingredientTag.classList.add('ingredient-tag');

    ingredientTag.addEventListener('click', () => {
        const index = selectedIngredients.indexOf(ingredient.toLowerCase());
        if (index === -1) {
            selectedIngredients.push(ingredient.toLowerCase());
        } else {
            selectedIngredients.splice(index, 1);
        }
        displayCardsByIngredientTags();
        displayIngredientsTags();     
    });

    return ingredientTag;
}

// DISPLAY INGREDIENTS TAGS
async function displayIngredientsTags() {
    const recipes = await getRecipes();
    const searchInputValue = searchInput.value.toLowerCase();
    ingredients.innerHTML = '';
    selectedTagsDiv.innerHTML = '';
    let uniqueIngredients = [];

    let filteredRecipes = recipes;

    if (selectedIngredients.length > 0) {
        filteredRecipes = recipes.filter(recipe => {
            return selectedIngredients.every(selectedIngredient =>
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === selectedIngredient)
            );
        });
    } else if (searchInputValue !== '') {
        filteredRecipes = recipes.filter(recipe => {
            return (
                recipe.name.toLowerCase().includes(searchInputValue) ||
                recipe.description.toLowerCase().includes(searchInputValue) ||
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchInputValue))
            );
        });
    }

    selectedIngredients.forEach(selectedIngredient => {
        const selectedTag = createIngredientTag(selectedIngredient);

        ingredients.appendChild(selectedTag);
        selectedTag.style.backgroundColor = '#FFD15B';
        uniqueIngredients.push(selectedIngredient);

        selectedTag.addEventListener('mouseenter', () => {
            const closeIcon = document.createElement('img');
            closeIcon.setAttribute('src', 'assets/icons/close.svg');
            selectedTag.appendChild(closeIcon);
            selectedTag.style.fontWeight = '500';

            selectedTag.addEventListener('mouseleave', () => {
                selectedTag.removeChild(closeIcon);
                selectedTag.style.fontWeight = 'normal';
            });
        })

        const selectedTagDiv = createIngredientTag(selectedIngredient);
        selectedTagDiv.classList.add('selected-tag-div')
        selectedTagsDiv.appendChild(selectedTagDiv); 
         
        selectedTagDiv.addEventListener('mouseenter', () => {
            const closeIcon = document.createElement('img');
            closeIcon.setAttribute('src', 'assets/icons/close.svg');
            selectedTagDiv.appendChild(closeIcon);
            selectedTagDiv.style.fontWeight = '500';

            selectedTagDiv.addEventListener('mouseleave', () => {
                selectedTagDiv.removeChild(closeIcon);
                selectedTagDiv.style.fontWeight = 'normal';
            });
        })  
    });

    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            if ((ingredient.ingredient.toLowerCase().includes(searchIngredientsInput.value.toLowerCase())) && (!uniqueIngredients.includes(ingredient.ingredient.toLowerCase()))) {
                const ingredientTag = createIngredientTag(ingredient.ingredient);
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
} 

// EVENT LISTENERS
searchInput.addEventListener('input', () => {
    if (searchInput.value.toLowerCase().length >= 3) {
        displayCardsBySearch();
    } else {
        displayAllCards()
    }
});

searchIngredientsInput.addEventListener('input', () => {
    displayIngredientsTags()
})

displayAllCards();