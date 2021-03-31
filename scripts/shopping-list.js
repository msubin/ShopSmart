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

    more_button = document.createElement('i');
    more_button.setAttribute('class', 'fas fa-ellipsis-h');
    more_button.setAttribute('id', 'more-button-' + item_name.value)
    more_button.setAttribute('style', 'float: right; width: 25px; height: 25px;')

    item_name.value = '';

    new_item_div.appendChild(checkbox_new_item);
    new_item_div.appendChild(label_checkbox);
    new_item_div.appendChild(more_button);
    new_item_div.appendChild(document.createElement('hr'));

    this.parentNode.parentNode.parentNode.append(new_item_div);

    checkbox_new_item.addEventListener('click', function () {
        if (checkbox_new_item.checked === true) {
            console.log(this.nextSibling.textContent + ' is checked!');
            checkCheckBoxes();
        }
        else if (checkbox_new_item.checked === false) {
            console.log(this.nextSibling.textContent + ' is not checked!');
            checkCheckBoxes();
        }
    })
})

// Writes inputted item to firestore under user's current list
function writeNewItem(item) {
    firebase.auth().onAuthStateChanged(function (user) {
        let current_list = document.getElementById('current-list').textContent;

        db.collection('users').doc(user.uid)
            .collection('lists').doc('shopping')
            .collection(current_list).doc(item)
            .set({
                item: item
            })
    })
}

// Creates new HTML for new list
document.getElementById('create-new-list').addEventListener('click', function (event) {
    let list_name = prompt("Please enter a name for your new list:")

    if (list_name != null) {
        let dropdown_menu_ul = document.getElementById("dropdown-menu-ul")

        new_li = document.createElement("li")
        new_li.setAttribute('class', 'dropdown-item')

        span = document.createElement('span')
        span.innerHTML = list_name

        divider = document.createElement('hr')
        divider.setAttribute('class', 'dropdown-divider')

        dropdown_menu_ul.appendChild(new_li)
        new_li.appendChild(span)
        new_li.appendChild(divider)

        span.addEventListener('click', function () {
            var other_list_items = document.getElementsByClassName('form-check');

            while (other_list_items[0]) {
                other_list_items[0].parentNode.removeChild(other_list_items[0])
            }

            let current_list = document.getElementById('current-list').textContent;
            document.getElementById('current-list').textContent = span.textContent
            span.textContent = current_list

            itemsQuery();
        })
        writeList(list_name)
    }
});

// Creates new shopping list in firestore
function writeList(text) {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('users').doc(user.uid)
            .collection('lists').doc('shopping')
            .collection(text)
            .add({
                list_name: text
            })
    })
};

function testerQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('users').doc(user.uid)
            .collection('lists').doc('shopping')
            .collection('brian')
            .where('list_name', '!=', 'undefined')
            .get()
            .then(function (snap) {
                snap.forEach(function (coll) {
                    let list = coll.data().list_name
                    console.log(list)
                    let dropdown_menu_ul = document.getElementById("dropdown-menu-ul")

                    new_li = document.createElement("li")
                    new_li.setAttribute('class', 'dropdown-item')

                    span = document.createElement('span')
                    span.innerHTML = list

                    divider = document.createElement('hr')
                    divider.setAttribute('class', 'dropdown-divider')

                    dropdown_menu_ul.appendChild(new_li)
                    new_li.appendChild(span)
                    new_li.appendChild(divider)

                    span.addEventListener('click', function () {
                        var other_list_items = document.getElementsByClassName('form-check');

                        while (other_list_items[0]) {
                            other_list_items[0].parentNode.removeChild(other_list_items[0])
                        }

                        let current_list = document.getElementById('current-list').textContent;
                        document.getElementById('current-list').textContent = span.textContent
                        span.textContent = current_list

                        itemsQuery();
                    })
                })
            })
    })
}

// Populates page with previously made lists
function listsQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('users').doc(user.uid)
            .collection('lists').doc('shopping')
            .collection('brian')
            .where('list_name', '!=', 'undefined')
            .get()
            .then(function (snap) {
                snap.forEach(function (coll) {
                    let list = coll.data().list_name
                    console.log(list)
                    let dropdown_menu_ul = document.getElementById("dropdown-menu-ul")

                    new_li = document.createElement("li")
                    new_li.setAttribute('class', 'dropdown-item')

                    span = document.createElement('span')
                    span.innerHTML = list

                    divider = document.createElement('hr')
                    divider.setAttribute('class', 'dropdown-divider')

                    dropdown_menu_ul.appendChild(new_li)
                    new_li.appendChild(span)
                    new_li.appendChild(divider)

                    span.addEventListener('click', function () {
                        var other_list_items = document.getElementsByClassName('form-check');

                        while (other_list_items[0]) {
                            other_list_items[0].parentNode.removeChild(other_list_items[0])
                        }

                        let current_list = document.getElementById('current-list').textContent;
                        document.getElementById('current-list').textContent = span.textContent
                        span.textContent = current_list

                        itemsQuery();
                    })
                })
            })
    })
}

// Populates list with items from firestore
function itemsQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        current_list = document.getElementById('current-list').textContent;

        db.collection('users').doc(user.uid)
            .collection('lists').doc('shopping')
            .collection(current_list)
            .where('item', '!=', 'undefined')
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

                    more_button = document.createElement('i');
                    more_button.setAttribute('class', 'fas fa-ellipsis-h');
                    more_button.setAttribute('id', 'more-button-' + item)
                    more_button.setAttribute('style', 'float: right; width: 25px; height: 25px;')

                    new_item_div.appendChild(checkbox_new_item);
                    new_item_div.appendChild(label_checkbox);
                    new_item_div.appendChild(more_button);
                    new_item_div.appendChild(document.createElement('hr'));

                    place_to_add_item = document.getElementById('list-content')
                    place_to_add_item.append(new_item_div);

                    checkbox_new_item.addEventListener('click', function () {
                        if (checkbox_new_item.checked === true) {
                            console.log(this.nextSibling.textContent + ' is checked!');
                            checkCheckBoxes();
                        }
                        else if (checkbox_new_item.checked === false) {
                            console.log(this.nextSibling.textContent + ' is not checked!');
                            checkCheckBoxes();
                        }
                    })
                })
            })
    })
}

// Makes remove button appear or disappear
function checkCheckBoxes() {
    remove_button = document.getElementById('remove-button')
    if ($('input[type="checkbox"]:checked').length > 0) {
        console.log('A checkbox is still checked.')
        remove_button.setAttribute('style', 'visibility: visible;')
    } else {
        console.log('No more checked boxes.')
        remove_button.setAttribute('style', 'visibility: hidden;')
    }
}

document.getElementById('remove-button').addEventListener('click', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        
        var current_list = document.getElementById('current-list').textContent;
        var checkboxes = document.getElementsByClassName('form-check-input');

        Array.from(checkboxes).forEach((box) => {
            if (box.checked === true) {
                box.parentNode.remove();
                db.collection('users').doc(user.uid)
                    .collection('lists').doc('shopping')
                    .collection(current_list).doc(box.nextSibling.textContent)
                    .delete()
            }
        })
        remove_button = document.getElementById('remove-button')
        remove_button.setAttribute('style', 'visibility: hidden;')
    })
});