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

const recipesCountP = document.createElement('p');
recipesCountP.style.fontSize = '21px';
recipesCountP.style.fontFamily = 'Anton';
recipesCountP.style.textAlign = 'right';
recipesCountP.style.marginRight = '2rem';
const tagsDiv = document.getElementById('tags');
const container = document.querySelector('.container');
container.appendChild(recipesCountP);

async function createCard() {
    const recipes = await getRecipes();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    const searchInput = document.getElementById('search').value.toLowerCase();
    let recipesCount = 0;

    recipes.forEach(recipe => {
        if (
            recipe.name.toLowerCase().includes(searchInput) ||
            recipe.description.toLowerCase().includes(searchInput) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchInput))
        ) {
            recipesCount++;

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
        recipesCountP.textContent = `${recipesCount} recettes`;
    });
}

    const ingredientsBtn = document.getElementById('ingredients-btn');
    const ingredientsDropdown = document.getElementById('ingredients-dropdown');
    const ingedientsDropdownBtn = document.getElementById('ingredients-dropdown-btn');
    ingredientsBtn.addEventListener('click', () => {
        ingredientsBtn.style.display = 'none';
        ingredientsDropdown.style.display = 'block'
    })
    ingedientsDropdownBtn.addEventListener('click', () => {
        ingredientsBtn.style.display = 'flex';
        ingredientsDropdown.style.display = 'none'
    })


async function handleIngredientsTags(searchInput) {
    const recipes = await getRecipes();
    const searchTagsInput = document.getElementById('search-ingredients').value.toLowerCase();
    const ingredients = document.getElementById('ingredients');
    ingredients.innerHTML = '';

    const filteredRecipes = recipes.filter(recipe => {
        return (
            recipe.name.toLowerCase().includes(searchInput) ||
            recipe.description.toLowerCase().includes(searchInput) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchInput))
        );
    });

    const uniqueIngredients = [];

    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            if ((ingredient.ingredient.toLowerCase().includes(searchTagsInput)) && (!uniqueIngredients.includes(ingredient.ingredient.toLowerCase()))) {
                const ingredientName = document.createElement('p');
                ingredientName.textContent = ingredient.ingredient;
                ingredients.appendChild(ingredientName);
                uniqueIngredients.push(ingredient.ingredient.toLowerCase());
            }
        });
    });
}

const defaultSearchInput = document.getElementById('search').value.toLowerCase();
handleIngredientsTags(defaultSearchInput);

document.getElementById('search-ingredients').addEventListener('input', async () => {
    const searchInput = document.getElementById('search').value.toLowerCase();
    await handleIngredientsTags(searchInput);
});

document.getElementById('search').addEventListener('input', async () => {
    const searchInput = document.getElementById('search').value.toLowerCase();
    await handleIngredientsTags(searchInput);
    createCard();
});

if(document.getElementById('search').value.toLowerCase().length >= 3) {
    createCard();
} else {
createCard()
}