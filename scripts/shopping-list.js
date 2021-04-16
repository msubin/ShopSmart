// Capitalize first letter of input item
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Create checkbox for new item
function createCheckbox() {
    let checkbox_new_item = document.createElement('input');
    checkbox_new_item.setAttribute('class', 'form-check-input');
    checkbox_new_item.setAttribute('type', 'checkbox');
    checkbox_new_item.setAttribute('value', '');
    checkbox_new_item.setAttribute('id', 'flexCheckDefault');
    return checkbox_new_item;
};

// Create checkbox label for new item
function createCheckboxLabel(item) {
    let label_checkbox = document.createElement('label');
    label_checkbox.setAttribute('class', 'form-check-label');
    label_checkbox.textContent = item;
    return label_checkbox;
};

// Create quantity box to increment/decrement
function createQuantityBox(value) {
    let quantity_number = document.createElement('span');
    quantity_number.textContent = value;
    quantity_number.setAttribute('id', 'quantity-number');
    quantity_number.setAttribute('style', 'float: right; width: 30px; height: 30px; text-align: center; border-bottom: 1px solid black;');
    return quantity_number;
};

// Create in/decrement button
function createPlusOrMinusButton(button_value) {
    if (button_value === '-') {
        let minus_quantity = document.createElement('button');
        minus_quantity.type = 'button';
        minus_quantity.value = '-';
        let minus_icon = document.createElement('i');
        minus_icon.className = 'fas fa-minus';
        minus_quantity.appendChild(minus_icon);
        minus_quantity.setAttribute('style', 'float: right; width: 25px; background-color: #f4f1e9; border: none;');
        return minus_quantity;
    } else if (button_value === '+') {
        let plus_quantity = document.createElement('button');
        plus_quantity.type = 'button';
        plus_quantity.value = '+';
        let plus_icon = document.createElement('i');
        plus_icon.className = 'fas fa-plus';
        plus_quantity.appendChild(plus_icon);
        plus_quantity.setAttribute('style', 'float: right; width: 25px; margin-right: 10px; background-color: #f4f1e9; border: none;');
        return plus_quantity;
    }
};

// Creates new item from input
document.getElementById('add_item_button').addEventListener('click', function (event) {
    let item_name = document.getElementById('add_item_input').value;

    if (item_name != '') {
        // Capitalize the first word of input text
        item_name = capitalizeFirstLetter(item_name)
        // Write to database
        writeNewItem(item_name);
        // Update that new doc in database with the correct food group, if applicable
        getFoodGroup(item_name);

        let new_item_div = document.createElement('div');
        new_item_div.setAttribute('class', 'form-check');

        let checkbox_new_item = createCheckbox();
        let label_checkbox = createCheckboxLabel(item_name);
        let quantity_number = createQuantityBox(1);
        let minus_quantity = createPlusOrMinusButton('-');
        let plus_quantity = createPlusOrMinusButton('+');

        minus_quantity.addEventListener('click', function () {
            decrementCounter(this);
        });

        plus_quantity.addEventListener('click', function () {
            incrementCounter(this);
        });

        document.getElementById('add_item_input').value = '';

        checkbox_new_item.addEventListener('click', function () {
            if (checkbox_new_item.checked === true) {
                checkCheckBoxes();
            }
            else if (checkbox_new_item.checked === false) {
                checkCheckBoxes();
            }
        });

        new_item_div.appendChild(checkbox_new_item);
        new_item_div.appendChild(label_checkbox);
        new_item_div.appendChild(plus_quantity);
        new_item_div.appendChild(quantity_number);
        new_item_div.appendChild(minus_quantity);
        new_item_div.appendChild(document.createElement('hr'));

        this.parentNode.parentNode.parentNode.append(new_item_div);
    }
});

// Writes inputted item to firestore under user's current list
function writeNewItem(item) {
    firebase.auth().onAuthStateChanged(function (user) {
        let current_list = document.getElementById('current-list').textContent;

        db.collection('users').doc(user.uid)
            .collection('shopping').doc(current_list + '-' + item)
            .set({
                'name': item,
                'list_name': current_list,
                'category': 'shopping',
                'quantity': 1,
                'food-group': 'Enter the food group',
                'shelf_life': 0,
                'scale': 'each'
            })
    })
};

// Update food group for item from foods database
function getFoodGroup(item) {
    let current_list = document.getElementById('current-list').textContent;
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('foods').get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                if (doc.data()["name"] == item) {
                    food_group = doc.data()["food-group"];
                    db.collection('users').doc(user.uid)
                    .collection('shopping').doc(current_list + '-' + item)
                    .update({
                        'food-group': food_group
                    })
                }
            })
        })
    })
};

// Populates list with items from firestore
function itemsQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        current_list = document.getElementById('current-list').textContent;

        db.collection('users').doc(user.uid)
            .collection('shopping')
            .where('list_name', '==', current_list)
            .where('category', '==', 'shopping')
            .where('name', '!=', 'undefined')
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {
                    let item = doc.data().name;
                    let quantity_value = doc.data().quantity;

                    let new_item_div = document.createElement('div');
                    new_item_div.setAttribute('class', 'form-check');

                    let checkbox_new_item = createCheckbox();
                    let label_checkbox = createCheckboxLabel(item);
                    let quantity_number = createQuantityBox(quantity_value);
                    let minus_quantity = createPlusOrMinusButton('-');
                    let plus_quantity = createPlusOrMinusButton('+');

                    minus_quantity.addEventListener('click', function () {
                        decrementCounter(this);
                    })

                    plus_quantity.addEventListener('click', function () {
                        incrementCounter(this);
                    })

                    checkbox_new_item.addEventListener('click', function () {
                        if (checkbox_new_item.checked === true) {
                            checkCheckBoxes();
                        }
                        else if (checkbox_new_item.checked === false) {
                            checkCheckBoxes();
                        }
                    })

                    new_item_div.appendChild(checkbox_new_item);
                    new_item_div.appendChild(label_checkbox);
                    new_item_div.appendChild(plus_quantity);
                    new_item_div.appendChild(quantity_number);
                    new_item_div.appendChild(minus_quantity);
                    new_item_div.appendChild(document.createElement('hr'));

                    place_to_add_item = document.getElementById('list-content');
                    place_to_add_item.append(new_item_div);
                })
            })
    })
};

// Creates new HTML for new list
document.getElementById('create-new-list').addEventListener('click', function (event) {
    let list_name = prompt("Please enter a name for your new list:")

    if (list_name != null && list_name.length != 0) {
        let dropdown_menu_ul = document.getElementById("dropdown-menu-ul")

        new_li = document.createElement("li")
        new_li.setAttribute('class', 'dropdown-item')

        span = document.createElement('span')
        span.innerHTML = list_name

        dropdown_menu_ul.appendChild(new_li)
        new_li.appendChild(span)

        new_li.addEventListener('click', function () {
            var other_list_items = document.getElementsByClassName('form-check');

            while (other_list_items[0]) {
                other_list_items[0].parentNode.removeChild(other_list_items[0])
            }
            checkCheckBoxes();
            changeLists(this);
            itemsQuery();
        })
        writeList(list_name)
    }
});

// Creates new shopping list in firestore
function writeList(text) {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('users').doc(user.uid)
            .collection('shopping').doc(text)
            .set({
                'list_name': text,
                'category': 'shopping',
                'list': true
            })
    })
};

// Populates page with previously made lists
function listsQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('users').doc(user.uid)
            .collection('shopping')
            .where('category', '==', 'shopping')
            .where('list', "==", true)
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {
                    let list = doc.data().list_name
                    let dropdown_menu_ul = document.getElementById("dropdown-menu-ul")

                    new_li = document.createElement("li")
                    new_li.setAttribute('class', 'dropdown-item')

                    span = document.createElement('span')
                    span.innerHTML = list

                    dropdown_menu_ul.appendChild(new_li)
                    new_li.appendChild(span)

                    new_li.addEventListener('click', function () {
                        var other_list_items = document.getElementsByClassName('form-check');

                        while (other_list_items[0]) {
                            other_list_items[0].parentNode.removeChild(other_list_items[0])
                        }
                        checkCheckBoxes();
                        changeLists(this);
                        itemsQuery();
                    })
                })
            })
    })
};

// Swaps text for current list with selected list
function changeLists(current_object) {
    let current_list = document.getElementById('current-list').textContent;
    document.getElementById('current-list').textContent = current_object.firstChild.textContent;
    current_object.firstChild.textContent = current_list;
}

// Increment counter
function incrementCounter(current_object) {
    let current_num = current_object.nextSibling.textContent;
    let incremented_num = (parseInt(current_num) + 1)
    current_object.nextSibling.textContent = incremented_num

    firebase.auth().onAuthStateChanged(function (user) {
        let current_list = document.getElementById('current-list').textContent;
        let item = current_object.previousSibling.textContent;

        db.collection('users').doc(user.uid)
            .collection('shopping').doc(current_list + '-' + item)
            .update({
                'quantity': incremented_num
            })
    })
}

// Decrement counter
function decrementCounter(current_object) {
    let current_num = current_object.previousSibling.textContent;
    if (current_num >= 2) {
        let decremented_num = (parseInt(current_num) - 1)
        current_object.previousSibling.textContent = decremented_num

        firebase.auth().onAuthStateChanged(function (user) {
            let current_list = document.getElementById('current-list').textContent;
            let item = current_object.previousSibling.previousSibling.previousSibling.textContent;

            db.collection('users').doc(user.uid)
                .collection('shopping').doc(current_list + '-' + item)
                .update({
                    'quantity': decremented_num
                })
        })
    }
}

// Makes remove button appear or disappear
function checkCheckBoxes() {
    let remove_button = document.getElementById('remove-button');
    let move_button = document.getElementById('move-button');
    if ($('input[type="checkbox"]:checked').length > 0) {
        remove_button.setAttribute('style', 'visibility: visible;')
        move_button.setAttribute('style', 'visibility: visible;')
    } else {
        remove_button.setAttribute('style', 'visibility: hidden;')
        move_button.setAttribute('style', 'visibility: hidden;')
    }
};

// If user clicks the Remove Checked Items button, will delete the items from list and firestore
document.getElementById('remove-button').addEventListener('click', function () {
    firebase.auth().onAuthStateChanged(function (user) {

        var current_list = document.getElementById('current-list').textContent;
        var checkboxes = document.getElementsByClassName('form-check-input');

        Array.from(checkboxes).forEach((box) => {
            if (box.checked === true) {
                box.parentNode.remove();
                db.collection('users').doc(user.uid)
                    .collection('shopping')
                    .where('name', '==', box.nextSibling.textContent)
                    .where('list_name', '==', current_list)
                    .get()
                    .then(function (snap) {
                        snap.forEach(function (doc) {
                            doc.ref.delete();
                        })
                    })
            }
        })
        document.getElementById('remove-button').setAttribute('style', 'visibility: hidden;');
        document.getElementById('move-button').setAttribute('style', 'visibility: hidden;');
    })
});

// If user clicks the Move Checked Items to Pantry button, will delete the items from this list and firestore
// and add them to My Pantry List
document.getElementById('move-button').addEventListener('click', function () {
    firebase.auth().onAuthStateChanged(function (user) {

        var current_list = document.getElementById('current-list').textContent;
        var checkboxes = document.getElementsByClassName('form-check-input');

        Array.from(checkboxes).forEach((box) => {
            if (box.checked === true) {
                let quantity_value = parseInt(box.nextSibling.nextSibling.nextSibling.textContent);
                let item_name = box.nextSibling.textContent;
                box.parentNode.remove();
                db.collection('users').doc(user.uid)
                .collection('shopping').doc(current_list + '-' + item_name)
                .get()
                .then(function (doc) {
                    let food_group = doc.data()['food-group']
                    let scale_value = doc.data()['scale']
                    let shelf_value = doc.data()['shelf_life']
                    db.collection('users').doc(user.uid)
                    .collection('pantry').doc('My Pantry List-' + item_name)
                    .set({
                        'name': item_name,
                        'list_name': 'My Pantry List',
                        'category': 'pantry',
                        'quantity': quantity_value,
                        'food-group': food_group,
                        'shelf_life': shelf_value,
                        'scale': scale_value
                    })
                })
                db.collection('users').doc(user.uid)
                    .collection('shopping')
                    .where('name', '==', item_name)
                    .where('list_name', '==', current_list)
                    .get()
                    .then(function (snap) {
                        snap.forEach(function (doc) {
                            doc.ref.delete();
                        })
                    })
            }
        })
        document.getElementById('remove-button').setAttribute('style', 'visibility: hidden;');
        document.getElementById('move-button').setAttribute('style', 'visibility: hidden;');
    })
});