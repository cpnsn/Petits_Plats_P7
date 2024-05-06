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
const ingredientsTagsContainer = document.getElementById('ingredients');

const searchAppareilsInput = document.getElementById('search-appareils');
const appareilsTagsContainer = document.getElementById('appareils');

const searchUstensilesInput = document.getElementById('search-ustensiles');
const ustensilesTagsContainer = document.getElementById('ustensiles');

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
    displayAllTags()
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
    displayAllTags();
}

let selectedTags = [];
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];

function createTag(tag, type) {
    const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
    const tagP = document.createElement('p');
    tagP.textContent = capitalizedTag;

    tagP.addEventListener('click', () => {   
        if (type === 'ingredients') {
            const index = selectedIngredients.indexOf(tag.toLowerCase());
            if (index === -1) {
                selectedIngredients.push(tag.toLowerCase());
            } else {
                selectedIngredients.splice(index, 1);
            }
        }
        if (type === 'appliance') {
            const index = selectedAppliances.indexOf(tag.toLowerCase());
            if (index === -1) {
                selectedAppliances.push(tag.toLowerCase());
            } else {
                selectedAppliances.splice(index, 1);
            }
        }
        if (type === 'ustensils') {
            const index = selectedUstensils.indexOf(tag.toLowerCase());
            if (index === -1) {
                selectedUstensils.push(tag.toLowerCase());
            } else {
                selectedUstensils.splice(index, 1);
            }
        }

        const indexAllTags = selectedTags.indexOf(tag.toLowerCase());
        if (indexAllTags === -1) {
            selectedTags.push(tag.toLowerCase());
        } else {
            selectedTags.splice(indexAllTags, 1);
        }
        
        displayCardsByTags();
        displayAllTags()   
    });

    return tagP;
}

// DISPLAY TAGS
async function displayTags(tagType, tagsContainer) {
    const recipes = await getRecipes();
    const searchInputValue = searchInput.value.toLowerCase();
    tagsContainer.innerHTML = '';
    selectedTagsDiv.innerHTML = '';
    let uniqueTags = [];

    let filteredRecipes = recipes;

    if (selectedIngredients.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedIngredients.every(selectedIngredient =>
                recipe.ingredients.some(ingredient =>
                    ingredient.ingredient.toLowerCase() === selectedIngredient
                )
            )
        );
    }
    if (selectedAppliances.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedAppliances.some(selectedAppliance =>
                recipe.appliance.toLowerCase() === selectedAppliance
            )
        );
    }
    if (selectedUstensils.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            selectedUstensils.some(selectedUstensil =>
                recipe.ustensils.some(ustensil =>
                    ustensil.toLowerCase() === selectedUstensil
                )
            )
        );
    }
    if (selectedTags.length > 0) {
        filteredRecipes = recipes.filter(recipe => {
            return selectedTags.every(selectedTag => 
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === selectedTag) ||
                recipe.appliance.toLowerCase() === selectedTag ||
                recipe.ustensils.some(ustensil => ustensil.toLowerCase() === selectedTag)
            );
        });
    } 
    if (searchInputValue !== '') {
        filteredRecipes = recipes.filter(recipe => {
            return (
                recipe.name.toLowerCase().includes(searchInputValue) ||
                recipe.description.toLowerCase().includes(searchInputValue) ||
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchInputValue))
            );
        });
    }

    selectedTags.forEach(selectedTag => {
        let currentTagType = null;
        if (selectedIngredients.includes(selectedTag.toLowerCase())) {
            currentTagType = 'ingredients';
        } else if (selectedAppliances.includes(selectedTag.toLowerCase())) {
            currentTagType = 'appliance';
        } else if (selectedUstensils.includes(selectedTag.toLowerCase())) {
            currentTagType = 'ustensils';
        }

        const tagP = createTag(selectedTag, currentTagType);
        if (currentTagType === tagType) {
            tagsContainer.appendChild(tagP);
        }

        tagP.style.backgroundColor = '#FFD15B';
        if (!uniqueTags.includes(selectedTag.toLowerCase())) {
            uniqueTags.push(selectedTag.toLowerCase());
        }

        tagP.addEventListener('mouseenter', () => {
            const closeIcon = document.createElement('img');
            closeIcon.setAttribute('src', 'assets/icons/close.svg');
            tagP.appendChild(closeIcon);
            tagP.style.fontWeight = '500';

            tagP.addEventListener('mouseleave', () => {
                tagP.removeChild(closeIcon);
                tagP.style.fontWeight = 'normal';
            });
        })
    
        const selectedTagDiv = createTag(selectedTag, currentTagType);
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
    
        selectedTagDiv.addEventListener('click', () => {
            const index = selectedTags.indexOf(selectedTag);
            if (index !== -1) {
                selectedTags.splice(index, 1);
    
                let currentTagType = null;
                if (selectedIngredients.includes(selectedTag.toLowerCase())) {
                    currentTagType = 'ingredients';
                } else if (selectedAppliances.includes(selectedTag.toLowerCase())) {
                    currentTagType = 'appliance';
                } else if (selectedUstensils.includes(selectedTag.toLowerCase())) {
                    currentTagType = 'ustensils';
                }
    
                if (currentTagType === 'ingredients') {
                    const index = selectedIngredients.indexOf(selectedTag.toLowerCase());
                    if (index !== -1) {
                        selectedIngredients.splice(index, 1);
                    }
                } else if (currentTagType === 'appliance') {
                    const index = selectedAppliances.indexOf(selectedTag.toLowerCase());
                    if (index !== -1) {
                        selectedAppliances.splice(index, 1);
                    }
                } else if (currentTagType === 'ustensils') {
                    const index = selectedUstensils.indexOf(selectedTag.toLowerCase());
                    if (index !== -1) {
                        selectedUstensils.splice(index, 1);
                    }
                }
    
                displayCardsByTags();
                displayAllTags();
            }
        });
    });

    if (tagType === 'ingredients') {
        filteredRecipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                if ((ingredient.ingredient.toLowerCase().includes(searchIngredientsInput.value.toLowerCase())) && (!uniqueTags.includes(ingredient.ingredient.toLowerCase()))) {
                    const ingredientTag = createTag(ingredient.ingredient, 'ingredients');
                    ingredientsTagsContainer.appendChild(ingredientTag);
                    uniqueTags.push(ingredient.ingredient.toLowerCase());
                }
            });
        });
    }
    if (tagType === 'appliance') {
        filteredRecipes.forEach(recipe => {
            if ((recipe.appliance.toLowerCase().includes(searchAppareilsInput.value.toLowerCase())) && (!uniqueTags.includes(recipe.appliance.toLowerCase()))) {
                const appareilTag = createTag(recipe.appliance, 'appliance');
                appareilsTagsContainer.appendChild(appareilTag);
                uniqueTags.push(recipe.appliance.toLowerCase());
            }
        });
    }
    if (tagType === 'ustensils') {
        filteredRecipes.forEach(recipe => {
            recipe.ustensils.forEach(ustensil => {
                if ((ustensil.toLowerCase().includes(searchUstensilesInput.value.toLowerCase())) && (!uniqueTags.includes(ustensil.toLowerCase()))) {
                    const ustensilTag = createTag(ustensil, 'ustensils');
                    ustensilesTagsContainer.appendChild(ustensilTag);
                    uniqueTags.push(ustensil.toLowerCase());
                }
            });
        });
    }
}

function displayAllTags() {
    displayTags('ingredients', ingredientsTagsContainer);
    displayTags('appliance', appareilsTagsContainer);
    displayTags('ustensils', ustensilesTagsContainer);
}


// RECIPES FILTERED BY INGREDIENTS TAGS
async function displayCardsByTags() {
    const recipes = await getRecipes();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    let recipesCount = 0;

    if (selectedTags.length === 0) {
        recipes.forEach(recipe => {
            recipesCount++;
            createCard(recipe, recipesDiv);
        });
    } else {
        recipes.forEach(recipe => {
            if (
                selectedIngredients.every(selectedIngredient =>
                    recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === selectedIngredient)
                ) &&
                selectedAppliances.every(selectedAppliance =>
                    recipe.appliance.toLowerCase() === selectedAppliance
                ) &&
                selectedUstensils.every(selectedUstensil =>
                    recipe.ustensils.some(ustensil => ustensil.toLowerCase() === selectedUstensil)
                )
            ) {
                recipesCount++;
                createCard(recipe, recipesDiv);
            }
        });
    }
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
    displayTags('ingredients', ingredientsTagsContainer)
})

searchAppareilsInput.addEventListener('input', () => {
    displayTags('appliance', appareilsTagsContainer)
})

searchUstensilesInput.addEventListener('input', () => {
    displayTags('ustensils', ustensilesTagsContainer)
})

displayAllCards();