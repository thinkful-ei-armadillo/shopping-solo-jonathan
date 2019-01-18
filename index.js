'use strict';

/* const STORE = [
  { name: "apples", checked: false },
  { name: "oranges", checked: false },
  { name: "milk", checked: true },
  { name: "bread", checked: false }
]; */

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
],
hideCompleted: false,
searchTerm: ''
}

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
          <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join("");
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let filteredItems = [...STORE.items];
  let searchedItems = [...STORE.items];
  let searchTerm = STORE.searchTerm;
  let shoppingListItemsString = generateShoppingItemsString(STORE.items);

  if (STORE.searchTerm !== '') {
    searchedItems = searchedItems.filter((item) => {
      if (searchTerm === item.name) {
        return item;
      }
    });  
  }
  
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter((item) => {
      return item.checked === false;
    });
  }
  
  if (STORE.searchTerm !== '') {
    shoppingListItemsString = generateShoppingItemsString(searchedItems);
  } else if (!STORE.hideCompleted) {
    shoppingListItemsString = generateShoppingItemsString(STORE.items);
  } else {
    shoppingListItemsString = generateShoppingItemsString(filteredItems);
  }
  

  console.log(searchedItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({ name: itemName, checked: false });
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function deleteItem(itemIndex) {
  STORE.items.splice(itemIndex, 1);
}

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function toggleHideCompleted() {
  STORE.hideCompleted = !STORE.hideCompleted;
  console.log("toggling hideCompleted property for STORE");
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function getSearchText() {
  const searchText = $('.js-shopping-list-search').val();
  console.log(searchText);
  return searchText;
}

function handleSearchClicked() {
  $('.js-searchBtn').click(() => {
    const searchText = getSearchText();
    STORE.searchTerm = searchText;
    renderShoppingList();
    $(searchText).val('');
  });
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteItem(itemIndex);
    renderShoppingList();
  
  });
  // item
  console.log('`handleDeleteItemClicked` ran')
}

function handleCheckboxClicked() {
  $('.js-shopping-list-checkbox').click(() => {
    console.log('`handleCheckboxClicked` ran');
    toggleHideCompleted();
    renderShoppingList();
    console.log(STORE.hideCompleted)
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleSearchClicked()
  handleCheckboxClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);