const itemListForm = document.querySelector(".js-itemListForm"),
    itemListInput = itemListForm.querySelector("input"),
    itemList = document.querySelector(".js-itemList"),
    checkedItemList = document.querySelector(".js-checkedItemList")


const ITEMLIST_LS = "items";
const CHECKEDITEMLIST_LS = "checkeditems";

let items = [];

function deletItem(event) {
    const btn = event.target;
    const li = btn.parentNode;
    itemList.removeChild(li);
    const cleanItems = items.filter(function (item) {
        return item.id !== parseInt(li.id);
    }); // return the array with all the item with a check of function(toDo)
    items = cleanItems;
    saveItems();
}

function saveItems() {
    localStorage.setItem(ITEMLIST_LS, JSON.stringify(items));
}

function paintItem(text) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");
    const newId = items.length + 1
    delBtn.innerText = "❌"; // add <meta charset="utf-8" /> to <head> of HTML
    delBtn.addEventListener("click", deletItem);
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.id = newId;
    itemList.appendChild(li);
    const itemObj = {
        text: text,
        id: newId
    };
    items.push(itemObj);
    saveItems();
}

function handleSubmit(event) {
    event.preventDefault();
    const currentValue = itemListInput.value;
    paintItem(currentValue);
    itemListInput.value = "";
}

function loadItemList() {
    const loadedItems = localStorage.getItem(ITEMLIST_LS);
    if (loadedItems !== null) {
        const parsedItems = JSON.parse(loadedItems);
        parsedItems.forEach(function (item) {
            paintItem(item.text);
        });
    }
}

function init() {
    loadItemList();
    itemListForm.addEventListener("Submit", handleSubmit)
}

init();
