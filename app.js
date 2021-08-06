const alert = document.querySelector(".alert");
const form = document.querySelector(".form");
const input = document.querySelector(".input");
const submitButton = document.querySelector(".submit-button");
const itemList = document.querySelector(".item-list");
const clearButton = document.querySelector(".clear-button");

let isEditMode = false;
let editedElement;
let editedLabel;
let editedValue;
let editedID;
let editedStatus;

// ******** EVENTS ********
window.addEventListener("DOMContentLoaded", setUpItems);

form.addEventListener("submit", addItem);

clearButton.addEventListener("click", clearItems);

// ********** FUNCTIONS *************

// Add item
function addItem(e) {
  e.preventDefault();
  const value = input.value;
  const id = new Date().getTime().toString(); // may need to be converted to string
  let elementStatus = "not-checked";

  if (value !== "" && !isEditMode) {
    createItem(id, value, elementStatus);

    // display clear button
    if (itemList.children.length > 0) {
      clearButton.classList.add("active");
    }

    // display alert
    displayAlert("successfully added!", "success");

    // add to local storage
    addToLocalStorage(id, value, elementStatus);
    setBackToDefault();
  } else if (value !== "" && isEditMode) {
    editedValue = value;
    editedElement.className = "";
    editedElement.classList.add("item", elementStatus);

    editedLabel.childNodes[2].nodeValue = editedValue;

    // display alert
    displayAlert("successfully updated!", "success");

    // update local storage
    updateLocalStorage(editedID, editedValue, elementStatus);
    setBackToDefault();
  } else {
    displayAlert("invalid value!", "danger");
  }
}

// edit item
function editItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  editedLabel = item.querySelector(".todo-name");

  editedElement = item;
  isEditMode = true;
  editedID = item.dataset.id;
  editedStatus = item.classList[1];
  submitButton.textContent = "edit";
}

// delete item
function deleteItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  id = item.dataset.id;
  itemList.removeChild(item);

  if (itemList.children.length === 0) {
    clearButton.classList.remove("active");
  }

  removeItemFromLocalStorage(id);
  displayAlert("successfully deleted!", "danger");
}

// clear items
function clearItems() {
  const items = itemList.querySelectorAll(".item");
  items.forEach(function (item) {
    itemList.removeChild(item);
  });
  clearButton.classList.remove("active");

  localStorage.removeItem("list");
  displayAlert("all todos have been removed!", "danger");
}

// create item
function createItem(id, value, elementStatus) {
  const element = document.createElement("div");
  element.classList.add("item", elementStatus);
  element.setAttribute("data-id", id);
  element.innerHTML = `<div class="activity-container">
                            <label class="todo-name">
                                <input
                                type="checkbox"
                                class="checkbox"
                                name="to-do"
                                />${value}
                            </label>
                        </div>

                        <div class="button-container">
                            <button class="edit-button">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-button">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>`;

  // edit event
  const editButton = element.querySelector(".edit-button");
  editButton.addEventListener("click", editItem);

  // delete event
  const deleteButton = element.querySelector(".delete-button");
  deleteButton.addEventListener("click", deleteItem);

  // checkbox event
  const checkbox = element.querySelector(".checkbox");
  checkbox.addEventListener("change", clickedBox);

  if (elementStatus === "checked") {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }

  itemList.appendChild(element);
}

// checkbox
function clickedBox(e) {
  const item = e.currentTarget.parentElement.parentElement.parentElement;
  const label = e.currentTarget.nextSibling;

  const id = item.dataset.id;
  const value = label.textContent.replace("\n", "");
  let status = item.classList[1];

  if (item.classList.contains("not-checked")) {
    status = "checked";
    item.classList.replace("not-checked", status);
  } else {
    status = "not-checked";
    item.classList.replace("checked", status);
  }

  updateLocalStorage(id, value, status);
}

function setBackToDefault() {
  isEditMode = false;
  input.value = "";
  submitButton.textContent = "add";
}

function setUpItems() {
  let list = getLocalStorage();

  list.forEach(function (item) {
    createItem(item.id, item.value, item.status);
  });

  if (itemList.children.length > 0) {
    clearButton.classList.add("active");
  }
}

function displayAlert(text, indicator) {
  alert.textContent = text;
  if (indicator === "success") {
    alert.classList.add(indicator);
  } else {
    alert.classList.add(indicator);
  }

  setTimeout(function () {
    alert.classList.remove(indicator);
  }, 1000);
}

// ****** LOCAL STORAGE *********
function addToLocalStorage(id, value, status) {
  let list = getLocalStorage();
  const item = {
    id,
    value,
    status,
  };
  list.push(item);
  localStorage.setItem("list", JSON.stringify(list));
}

function updateLocalStorage(id, value, status) {
  let list = getLocalStorage();
  list = list.map(function (item) {
    if (item.id === id) {
      item.value = value;
      item.status = status;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(list));
}

function removeItemFromLocalStorage(id) {
  let list = getLocalStorage();
  list = list.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(list));
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("list")) || [];
}
