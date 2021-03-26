// Creates new item from input
document.getElementById('add_item_button').addEventListener('click', function (event) {
    let item_name = document.getElementById('add_item_input');

    writeNewItem(item_name.value)

    let new_item_div = document.createElement('div');
    new_item_div.setAttribute('class', 'form-check');

    let checkbox_new_item = document.createElement('input');
    checkbox_new_item.setAttribute('class', 'form-check-input');
    checkbox_new_item.setAttribute('type', 'checkbox');
    checkbox_new_item.setAttribute('value', '');
    checkbox_new_item.setAttribute('id', 'flexCheckDefault');

    let label_checkbox = document.createElement('label');
    label_checkbox.setAttribute('class', 'form-check-label');
    label_checkbox.setAttribute('for', 'flexCheckDefault');
    label_checkbox.textContent = item_name.value;

    item_name.value = '';

    new_item_div.appendChild(checkbox_new_item);
    new_item_div.appendChild(label_checkbox);
    new_item_div.appendChild(document.createElement('hr'));

    this.parentNode.parentNode.parentNode.append(new_item_div);
})

// Writes inputted item to firestore under user's current list
function writeNewItem(item) {
    firebase.auth().onAuthStateChanged(function (user) {
        current_list = document.getElementById('current-list').textContent;

        db.collection('users').doc(user.uid)
            .collection('lists').doc('shopping')
            .collection(current_list)
            .add({
                item: item
            })
    })
}

// Creates new HTML for new list
document.getElementById('create-new-list').addEventListener('click', function (event) {
    let list_name = prompt("Please enter a name for your new list:")

    let dropdown_menu_ul = document.getElementById("dropdown-menu-ul")

    new_li = document.createElement("li")
    new_li.setAttribute('class', 'dropdown-item')

    a1 = document.createElement('a')
    a1.innerHTML = list_name

    divider = document.createElement('hr')
    divider.setAttribute('class', 'dropdown-divider')

    dropdown_menu_ul.appendChild(new_li)
    new_li.appendChild(a1)
    new_li.appendChild(divider)

    writeList(list_name)
});

// Creates new shopping list in firestore
function writeList(text) {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('users').doc(user.uid)
            .collection('lists').doc('shopping')
            .collection(text)
            .set({
                list_name: text
            })
    })
};

// Populates list with items from firestore
function itemsQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        current_list = document.getElementById('current-list').textContent;

        db.collection('users').doc(user.uid)
            .collection('lists').doc('shopping')
            .collection(current_list)
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {
                    let item = doc.data().item;

                    let new_item_div = document.createElement('div');
                    new_item_div.setAttribute('class', 'form-check');

                    let checkbox_new_item = document.createElement('input');
                    checkbox_new_item.setAttribute('class', 'form-check-input');
                    checkbox_new_item.setAttribute('type', 'checkbox');
                    checkbox_new_item.setAttribute('value', '');
                    checkbox_new_item.setAttribute('id', 'flexCheckDefault');

                    let label_checkbox = document.createElement('label');
                    label_checkbox.setAttribute('class', 'form-check-label');
                    label_checkbox.setAttribute('for', 'flexCheckDefault');
                    label_checkbox.textContent = item;

                    new_item_div.appendChild(checkbox_new_item);
                    new_item_div.appendChild(label_checkbox);
                    new_item_div.appendChild(document.createElement('hr'));

                    place_to_add_item = document.getElementById('list-content')
                    place_to_add_item.append(new_item_div);
                })
            })
    })
}
itemsQuery();