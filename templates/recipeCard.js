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