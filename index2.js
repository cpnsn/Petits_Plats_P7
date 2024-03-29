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
const container = document.querySelector('.container');
container.appendChild(recipesCountP);

async function createCard() {
    const recipes = await getRecipes();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    const searchInput = document.getElementById('search').value.toLowerCase();
    let recipesCount = 0;

    for (let i = 0; i < recipes.length; i++) {
        if (
            recipes[i].name.toLowerCase().includes(searchInput) ||
            recipes[i].description.toLowerCase().includes(searchInput) ||
            recipes[i].ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchInput))
        ) {
            recipesCount++;

            const card = document.createElement('div');
            card.classList.add('card');
            
            const cardImage = document.createElement('img');
            cardImage.classList.add('card-image');
            cardImage.setAttribute('src', `assets/images/plats/${recipes[i].image}`);
            cardImage.setAttribute('alt', recipes[i].name);

            const time = document.createElement('p');
            time.classList.add('time');
            time.textContent = `${recipes[i].time}min`;

            const cardContent = document.createElement('div');
            cardContent.classList.add('card-content');
            
            const cardTitle = document.createElement('h2');
            cardTitle.textContent = recipes[i].name;

            const cardSection = document.createElement('h3');
            cardSection.textContent = "RECETTE";

            const recetteDiv = document.createElement('div');
            recetteDiv.classList.add('recette');

            const recette = document.createElement('p');
            recette.textContent = recipes[i].description;

            const cardSection2 = document.createElement('h3');
            cardSection2.textContent = "INGRÉDIENTS";

            const ingredientsDiv = document.createElement('div');
            ingredientsDiv.classList.add('ingredients');
            
            recipes[i].ingredients.forEach(ingredient => {
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
    };
}

document.getElementById('search').addEventListener('input', createCard);

if(document.getElementById('search').value.toLowerCase().length >= 3) {
    createCard();
} else {
createCard()
}