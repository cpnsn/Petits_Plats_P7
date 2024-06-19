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

const noRecipes = document.createElement('p');
noRecipes.classList.add('no-recipes');

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
    dropdown.style.display = 'block';
  });
  dropdownBtn.addEventListener('click', () => {
    button.style.display = 'flex';
    dropdown.style.display = 'none';
  });
}
toggleTagsVisibility('ingredients-btn', 'ingredients-dropdown', 'ingredients-dropdown-btn');
toggleTagsVisibility('appareils-btn', 'appareils-dropdown', 'appareils-dropdown-btn');
toggleTagsVisibility('ustensiles-btn', 'ustensiles-dropdown', 'ustensiles-dropdown-btn');

const searchInput = document.getElementById('search');
const searchIngredientsInput = document.getElementById('search-ingredients');
const ingredientsTagsContainer = document.getElementById('ingredients');
const searchAppareilsInput = document.getElementById('search-appareils');
const appareilsTagsContainer = document.getElementById('appareils');
const searchUstensilesInput = document.getElementById('search-ustensiles');
const ustensilesTagsContainer = document.getElementById('ustensiles');
const selectedTagsDiv = document.getElementById('selected-tags');

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
    createCard(recipe, recipesDiv);
  });
  updateRecipesCount(recipesCount);
  displayAllTags();
}

async function displayCardsBySearch() {
  const recipes = await getRecipes();
  const recipesDiv = document.getElementById("recipes");
  recipesDiv.innerHTML = "";
  let recipesCount = 0;
  const searchInputValue = searchInput.value.toLowerCase();
  let hasRecipes = false;

  recipes.forEach((recipe) => {
    if (
      recipe.name.toLowerCase().includes(searchInputValue) ||
      recipe.description.toLowerCase().includes(searchInputValue) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(searchInputValue)
      )
    ) {
      recipesCount++;
      createCard(recipe, recipesDiv);
      hasRecipes = true;
    }
  });

  if (!hasRecipes) {
    noRecipes.textContent = `Aucune recette ne contient "${searchInputValue}", vous pouvez chercher "tarte aux pommes", "poisson", etc.`;
    recipesDiv.appendChild(noRecipes);
  }

  updateRecipesCount(recipesCount);
  displayAllTags();
}

// RECIPES FILTERED BY SEARCH AND TAGS
async function displayCardsBySearchAndTags() {
    const recipes = await getRecipes();
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    let recipesCount = 0;
    const searchInputValue = searchInput.value.toLowerCase();

    const filteredRecipes = recipes.filter((recipe) => {
      const matchesSearch =
        searchInputValue === '' ||
        recipe.name.toLowerCase().includes(searchInputValue) ||
        recipe.description.toLowerCase().includes(searchInputValue) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(searchInputValue)
        );

        const matchesTags =
        selectedIngredients.every((selectedIngredient) =>
          recipe.ingredients.some((ingredient) =>
              ingredient.ingredient.toLowerCase() === selectedIngredient
          )
        ) &&
        selectedAppliances.every((selectedAppliance) =>
            recipe.appliance.toLowerCase() === selectedAppliance
        ) &&
        selectedUstensils.every((selectedUstensil) =>
          recipe.ustensils.some((ustensil) => ustensil.toLowerCase() === selectedUstensil
          )
        );
  
      return matchesSearch && matchesTags;
    });

    filteredRecipes.forEach((recipe) => {
      recipesCount++;
      createCard(recipe, recipesDiv);
    });

    if (recipesCount === 0) {
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

function createTag(tag) {
  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  const tagP = document.createElement('p');
  tagP.textContent = capitalizedTag;
  return tagP;
}

function handleTagClick(tag, type) {
  switch (type) {
    case 'ingredients':
      handleTagSelection(tag, selectedIngredients);
      break;
    case 'appliance':
      handleTagSelection(tag, selectedAppliances);
      break;
    case 'ustensils':
      handleTagSelection(tag, selectedUstensils);
      break;
    default:
      console.error('Unknown tag type:', type);
      return;
  }
  handleTagSelection(tag, selectedTags);
  displayCardsBySearchAndTags();
  displayAllTags();
}

function handleTagSelection(tag, selectedArray) {
  const index = selectedArray.indexOf(tag.toLowerCase());
  if (index === -1) {
    selectedArray.push(tag.toLowerCase());
  } else {
    selectedArray.splice(index, 1);
  }
}

function addCloseIcon(tag) {
  tag.addEventListener('mouseenter', () => {
    const closeIcon = document.createElement('img');
    closeIcon.setAttribute('src', 'assets/icons/close.svg');
    tag.appendChild(closeIcon);
    tag.style.fontWeight = '500';

    tag.addEventListener('mouseleave', () => {
      if (tag.contains(closeIcon)) {
        tag.removeChild(closeIcon);
      }
      tag.style.fontWeight = 'normal';
    });
  });
}

// DISPLAY TAGS
async function displayTags(tagType, tagsContainer) {
  const recipes = await getRecipes();
  const searchInputValue = searchInput.value.toLowerCase();
  tagsContainer.innerHTML = '';
  selectedTagsDiv.innerHTML = '';
  let uniqueTags = [];

  // récupération des recettes filtrées selon sélection de tags et recherche
  let filteredRecipes = recipes.filter(recipe =>
      (selectedIngredients.length === 0 || selectedIngredients.every(selectedIngredient =>
          recipe.ingredients.some(ingredient =>
              ingredient.ingredient.toLowerCase() === selectedIngredient
          )
        )) &&
      (selectedAppliances.length === 0 || selectedAppliances.some(selectedAppliance =>
            recipe.appliance.toLowerCase() === selectedAppliance
        )) &&
      (selectedUstensils.length === 0 || selectedUstensils.some(selectedUstensil =>
          recipe.ustensils.some(ustensil => ustensil.toLowerCase() === selectedUstensil
          )
        )) &&
      (selectedTags.length === 0 || selectedTags.every(selectedTag =>
            recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase() === selectedTag
            ) ||
            recipe.appliance.toLowerCase() === selectedTag ||
            recipe.ustensils.some(ustensil => ustensil.toLowerCase() === selectedTag
            )
        )) &&
      (searchInputValue === '' ||
        recipe.name.toLowerCase().includes(searchInputValue) ||
        recipe.description.toLowerCase().includes(searchInputValue) ||
        recipe.ingredients.some(ingredient =>
          ingredient.ingredient.toLowerCase().includes(searchInputValue)
        ))
  );

  selectedTags.forEach(selectedTag => {
    let currentTagType = null;
    if (selectedIngredients.includes(selectedTag.toLowerCase())) {
      currentTagType = 'ingredients';
    } else if (selectedAppliances.includes(selectedTag.toLowerCase())) {
      currentTagType = 'appliance';
    } else if (selectedUstensils.includes(selectedTag.toLowerCase())) {
      currentTagType = 'ustensils';
    }

    const tagP = createTag(selectedTag);
    tagP.addEventListener('click', () => handleTagClick(selectedTag, tagType));
    if (currentTagType === tagType) {
      tagsContainer.appendChild(tagP);
    }
    tagP.style.backgroundColor = '#FFD15B';
    if (!uniqueTags.includes(selectedTag.toLowerCase())) {
      uniqueTags.push(selectedTag.toLowerCase());
    }
    addCloseIcon(tagP);

    const selectedTagDiv = createTag(selectedTag);
    selectedTagDiv.addEventListener('click', () => handleTagClick(selectedTag, tagType))
    selectedTagDiv.classList.add('selected-tag-div');
    selectedTagsDiv.appendChild(selectedTagDiv);
    addCloseIcon(selectedTagDiv);
  });

  // gestion et affichage des tags
  filteredRecipes.forEach(recipe => {
    switch (tagType) {
      case 'ingredients':
        recipe.ingredients.forEach(ingredient => {
          const tag = ingredient.ingredient.toLowerCase();
          if (tag.includes(searchIngredientsInput.value.toLowerCase()) && !uniqueTags.includes(tag)) {
            uniqueTags.push(tag);
            const tagP = createTag(tag);
            tagP.addEventListener('click', () => handleTagClick(tag, 'ingredients'));
            tagsContainer.appendChild(tagP);
          }
        });
        break;
      case 'appliance':
        const applianceTag = recipe.appliance.toLowerCase();
        if (applianceTag.includes(searchAppareilsInput.value.toLowerCase()) && !uniqueTags.includes(applianceTag)) {
          uniqueTags.push(applianceTag);
          const tagP = createTag(applianceTag);
          tagP.addEventListener('click', () => handleTagClick(applianceTag, 'appliance'));
          tagsContainer.appendChild(tagP);
        }
        break;
      case 'ustensils':
        recipe.ustensils.forEach(ustensil => {
          const tag = ustensil.toLowerCase();
          if (tag.includes(searchUstensilesInput.value.toLowerCase()) && !uniqueTags.includes(tag)) {
            uniqueTags.push(tag);
            const tagP = createTag(tag);
            tagP.addEventListener('click', () => handleTagClick(tag, 'ustensils'));
            tagsContainer.appendChild(tagP);
          }
        });
        break;
      default:
        console.error('Unknown tag type:', tagType);
        break;
    }
  })
}

async function displayAllTags() {
  await displayTags('ingredients', ingredientsTagsContainer);
  await displayTags('appliance', appareilsTagsContainer);
  await displayTags('ustensils', ustensilesTagsContainer);
}

// DISPLAY SEARCH RESULTS
searchInput.addEventListener('input', () => {
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue.length >= 3 && selectedTags.length > 0) {
    displayCardsBySearchAndTags();
  } else if (searchValue.length >= 3) {
    displayCardsBySearch();
  } else if (searchValue === '') {
    if (selectedTags.length > 0) {
      displayCardsBySearchAndTags();
    } else {
      displayAllCards();
    }
  }
});

// DISPLAY TAGS SEARCH RESULTS
searchIngredientsInput.addEventListener('input', () => {
  displayTags('ingredients', ingredientsTagsContainer);
});

searchAppareilsInput.addEventListener('input', () => {
  displayTags('appliance', appareilsTagsContainer);
});

searchUstensilesInput.addEventListener('input', () => {
  displayTags('ustensils', ustensilesTagsContainer);
});

// REMOVE SELECTED TAG
selectedTagsDiv.addEventListener('click', (event) => {
  const tagToRemove = event.target.textContent.toLowerCase();
  selectedTags = selectedTags.filter((tag) => tag !== tagToRemove);
  selectedIngredients = selectedIngredients.filter(
    (tag) => tag !== tagToRemove
  );
  selectedAppliances = selectedAppliances.filter((tag) => tag !== tagToRemove);
  selectedUstensils = selectedUstensils.filter((tag) => tag !== tagToRemove);
  displayCardsBySearchAndTags();
  displayAllTags();
});

displayAllCards();