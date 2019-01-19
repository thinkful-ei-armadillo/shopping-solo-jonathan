'use strict';

// shopping list dictionary
const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
],
hideCompleted: false,
searchTerm: '',
hideEdit: false,
editInput: ''
}

// create shopping list element
function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <span class="js-edit hidden"><input type="text" name="shopping-item-edit" class="js-edit-text"></span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

// return string for insert into DOM
function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join("");
}

//--- this function is TO LONG
function renderShoppingList() {
  // render the shopping list in the DOM
  let filteredItems = [...STORE.items];
  let searchedItems = [...STORE.items];
  let searchTerm = STORE.searchTerm;
  let shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // return match from search bar
  if (STORE.searchTerm !== '') {
    searchedItems = searchedItems.filter((item) => {
      if (searchTerm === item.name) {
        return item;
      }
    });  
  }
  
  // return unchecked list items
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter((item) => {
      return item.checked === false;
    });
  }
  


  // decide to insert correct shopping items into DOM
  if (STORE.searchTerm !== '') {
    shoppingListItemsString = generateShoppingItemsString(searchedItems);
  } else if (!STORE.hideCompleted) {
    shoppingListItemsString = generateShoppingItemsString(STORE.items);
  } else {
    shoppingListItemsString = generateShoppingItemsString(filteredItems);
  }

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

// add shopping item to list
function addItemToShoppingList(itemName) {
  STORE.items.push({ name: itemName, checked: false });
}

// edit item name property for STORE dict
function editItem(itemIndex, editText) {
  if (editText.length !== 0) {
    STORE.items[itemIndex].name = editText;
  }
}

// delete item property for STORE dict
function deleteItem(itemIndex) {
  STORE.items.splice(itemIndex, 1);
}

// toggle boolean of item checked property
function toggleCheckedForListItem(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

// toggle boolean for completed shopping item
function toggleHideCompleted() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

// toggle boolean for an edited shopping item
function toggleEditForListItem(itemIndex) {
  STORE.items[itemIndex].edited != STORE.items[itemIndex].edited;
}
// toggle edit textbox
function toggleEditTextbox() {
  STORE.hideEdit = !STORE.hideEdit;
  $('.js-edit').toggle(() => {
  });
}

// return index of current target on generated li
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

// return edit text input
function getEditText() {
  //itemIndex
  const editText = $('.js-edit-text:focus').val()
  return editText;
}

// return search bar value
function getSearchText() {
  const searchText = $('.js-shopping-list-search').val();
  return searchText;
}

// handle new entry into shopping list
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

// handle search bar entry
function handleSearchClicked() {
  $('.js-searchBtn').click(() => {
    const searchText = getSearchText();
    STORE.searchTerm = searchText;
    renderShoppingList();
    $(searchText).val('');
  });
}

// handle checked item strike-through
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// handle edit shopping item
function handleEditItemClicked() {
  $('.js-item-edit').on('click', event => {
    let editText = STORE.editInput;
    toggleEditTextbox();
    if (STORE.hideEdit !== false) {
      $('.js-shopping-list').on('keydown', '.js-edit-text', event => {
        if (event.which === 13) {
          const itemIndex = getItemIndexFromElement(event.currentTarget);
          editText = getEditText();
          editItem(itemIndex, editText);
          toggleEditForListItem(itemIndex);
          renderShoppingList();
          STORE.editInput = '';
        }
      });
    }
  });
}

// handle delete shopping item
function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteItem(itemIndex);
    renderShoppingList();
  });
}

// handle hide completed items checkbox
function handleCheckboxClicked() {
  $('.js-shopping-list-checkbox').click(() => {
    toggleHideCompleted();
    renderShoppingList();
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
  handleEditItemClicked();
  handleSearchClicked();
  handleCheckboxClicked();
  
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);