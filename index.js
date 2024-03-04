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

async function createCard() {
    const recipes = await getRecipes();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    const searchInput = document.getElementById('search').value.toLowerCase();
    const container = document.querySelector('.container');
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

            card.appendChild(cardImage);
            card.appendChild(cardContent);

            recipesDiv.appendChild(card);
        }
    });
    const recipesCountP = document.createElement('p');
    recipesCountP.textContent = `${recipesCount} recettes`;
    container.appendChild(recipesCountP);
}

document.getElementById('search').addEventListener('input', createCard);

if(document.getElementById('search').value.toLowerCase().length >= 3) {
    createCard();
} else {
createCard()
}