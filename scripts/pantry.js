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
    label_checkbox.setAttribute('for', 'flexCheckDefault');
    label_checkbox.textContent = item;
    return label_checkbox;
};

// Create "more" button for new items
function createMoreButton(item){
    let more_button = document.createElement('i');
    more_button.setAttribute('class', 'fas fa-ellipsis-h');
    more_button.setAttribute('id', 'more-button-' + item)
    more_button.setAttribute('style', 'float: right; width: 25px; height: 25px; padding-top: 5px;')
    more_button.type = 'button'
    more_button.setAttribute('data-bs-toggle', 'modal')
    more_button.setAttribute('data-bs-target', '#exampleModal')
    return more_button;
};

// Create quantity box to increment/decrement
function createQuantityBox(value) {
    let quantity_number = document.createElement('input');
    quantity_number.type = 'number';
    quantity_number.value = value;
    quantity_number.setAttribute('style', 'float: right; width: 25px; text-align: center;');
    return quantity_number;
};

// Create in/decrement button
function createPlusOrMinusButton(button_value) {
    if (button_value === '-') {
        let minus_quantity = document.createElement('input');
        minus_quantity.type = 'button';
        minus_quantity.value = '-';
        minus_quantity.setAttribute('style', 'float: right; width: 25px;');
        return minus_quantity;
    } else if (button_value === '+') {
        let plus_quantity = document.createElement('input');
        plus_quantity.type = 'button';
        plus_quantity.value = '+';
        plus_quantity.setAttribute('style', 'float: right; width: 25px; margin-right: 10px;');
        return plus_quantity;
    }
};

// Creates new item from input
document.getElementById('add_item_button').addEventListener('click', function (event) {
    let item_name = document.getElementById('add_item_input').value;

    if (item_name != '') {
        item_name = capitalizeFirstLetter(item_name)
        writeNewItem(item_name)

        let new_item_div = document.createElement('div');
        new_item_div.setAttribute('class', 'form-check');

        let checkbox_new_item = createCheckbox();
        let label_checkbox = createCheckboxLabel(item_name);
        let more_button = createMoreButton(item_name);

        more_button.addEventListener('click', function () {
            itemDetailsPage(this);
            var modal = document.getElementById('exampleModal');
            modal.focus();
        })

        let quantity_number = createQuantityBox(1);
        let minus_quantity = createPlusOrMinusButton('-');
        let plus_quantity = createPlusOrMinusButton('+');

        minus_quantity.addEventListener('click', function () {
            decrementCounter(this);
        })

        plus_quantity.addEventListener('click', function () {
            incrementCounter(this);
        })

        document.getElementById('add_item_input').value = '';

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
        new_item_div.appendChild(more_button);
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
            .collection('pantry').doc(current_list + '-' + item)
            .set({
                'name': item,
                'list_name': current_list,
                'category': 'pantry',
                'quantity': 1
            })
    })
};

// Populates list with items from firestore
function itemsQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        current_list = document.getElementById('current-list').textContent;

        db.collection('users').doc(user.uid)
            .collection('pantry')
            .where('list_name', '==', current_list)
            .where('category', '==', 'pantry')
            .where('name', '!=', 'undefined')
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {
                    let item = doc.data().name;
                    let quantity_value = doc.data().quantity;

                    let new_item_div = document.createElement('div');
                    new_item_div.setAttribute('class', 'form-check');

                    let checkbox_new_item = createCheckbox()
                    let label_checkbox = createCheckboxLabel(item);
                    let quantity_number = createQuantityBox(quantity_value);
                    let minus_quantity = createPlusOrMinusButton('-');
                    let plus_quantity = createPlusOrMinusButton('+')

                    minus_quantity.addEventListener('click', function () {
                        decrementCounter(this);
                    })

                    plus_quantity.addEventListener('click', function () {
                        incrementCounter(this);
                    })

                    let more_button = createMoreButton(item);

                    more_button.addEventListener('click', function () {
                        itemDetailsPage(this);
                        var test = document.getElementById('exampleModal');
                        test.focus();
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
                    new_item_div.appendChild(more_button);
                    new_item_div.appendChild(plus_quantity);
                    new_item_div.appendChild(quantity_number);
                    new_item_div.appendChild(minus_quantity);
                    new_item_div.appendChild(document.createElement('hr'));

                    place_to_add_item = document.getElementById('list-content')
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

// Creates new pantry list in firestore
function writeList(text) {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('users').doc(user.uid)
            .collection('pantry').doc(text)
            .set({
                'list_name': text,
                'category': 'pantry',
                'list': true
            })
    })
};

// Populates page with previously made lists
function listsQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('users').doc(user.uid)
            .collection('pantry')
            .where('category', '==', 'pantry')
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
};

// Function for Item Details
function itemDetailsPage(current_object) {

    var item_name = current_object.previousSibling.textContent;
    document.getElementById('modal-header').textContent = item_name;

    var quantity = current_object.nextSibling.nextSibling.value;
    document.getElementById('item-detail-quantity').value = quantity;

    var item = document.getElementById('modal-header').textContent;

    // get user saved info
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("users").doc(user.uid).collection('pantry')
            .where('name', '==', item)
            .where('list_name', '==', current_list)
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) {
                    var scale = doc.data().scale;
                    var food_group_by_user = doc.data().food_group_by_user;
                    var shelf_life_user = doc.data().shelf_life_user;
                    var name = doc.data().name;

                    if (item_name.toLowerCase() === name.toLowerCase()) {
                        document.getElementById("inputGroupSelectUnit").value = scale;
                        document.getElementById("js-inputFoodGroup").value = food_group_by_user;
                        document.getElementById("js-inputShelfLife").value = shelf_life_user;
                    }
                })
            })
    })

    // get preset food group from db
    db.collection("foods").get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var name = doc.data()["name"];
                var group = doc.data()["food-group"];
                if (item_name.toLowerCase() === name.toLowerCase()) {
                    document.getElementById('js-inputFoodGroup').setAttribute('placeholder', group);
                    document.getElementById('js-inputFoodGroup').setAttribute('value', group);
                }
            })
        })

    // Save Changes
    document.getElementById("saveBtn").addEventListener("click", function (current_object) {
        let scale = document.getElementById("inputGroupSelectUnit").value;
        let input_food_group = document.getElementById("js-inputFoodGroup").value;
        let input_shelf_life = document.getElementById("js-inputShelfLife").value;
        let notify_switch = document.getElementById("notify_me_switch").checked;

        firebase.auth().onAuthStateChanged(function (user) {
            let current_list = document.getElementById('current-list').textContent;
            let item = document.getElementById("modal-header").textContent;

            db.collection('users').doc(user.uid).collection('lists').doc(current_list + '-' + item).update({
                'scale': scale,
                'food_group_by_user': input_food_group,
                'shelf_life_user': input_shelf_life,
                'notify_me': notify_switch
            })
        })
        item = document.getElementById('js-FoodGroup')
        item.setAttribute('style', 'display: none;')
        document.getElementById('js-inputFoodGroup').setAttribute('style', 'display: block;')

        $('#exampleModal').modal('hide');
    })
}


// Increment counter
function incrementCounter(current_object) {
    let current_num = current_object.nextSibling.value;
    let incremented_num = (parseInt(current_num) + 1)
    current_object.nextSibling.value = incremented_num

    firebase.auth().onAuthStateChanged(function (user) {
        let current_list = document.getElementById('current-list').textContent;
        let item = current_object.previousSibling.previousSibling.textContent;

        db.collection('users').doc(user.uid)
            .collection('pantry').doc(current_list + '-' + item)
            .update({
                'quantity': incremented_num
            })
    })
}

// Decrement counter
function decrementCounter(current_object) {
    let current_num = current_object.previousSibling.value;
    if (current_num >= 2) {
        let decremented_num = (parseInt(current_num) - 1)
        current_object.previousSibling.value = decremented_num

        firebase.auth().onAuthStateChanged(function (user) {
            let current_list = document.getElementById('current-list').textContent;
            let item = current_object.previousSibling.previousSibling.previousSibling.previousSibling.textContent;

            db.collection('users').doc(user.uid)
                .collection('pantry').doc(current_list + '-' + item)
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
    let recipes_button = document.getElementById('recipes-button');
    let list_content = document.getElementById('list-content');
    if ($('input[type="checkbox"]:checked').length > 0) {
        remove_button.setAttribute('style', 'visibility: visible;');
        move_button.setAttribute('style', 'visibility: visible;');
        recipes_button.setAttribute('style', 'visibility: visible;');
        list_content.setAttribute('style', 'height: 500px')
    } else {
        remove_button.setAttribute('style', 'visibility: hidden;');
        move_button.setAttribute('style', 'visibility: hidden;');
        recipes_button.setAttribute('style', 'visibility: hidden;');
        list_content.setAttribute('style', 'height: 600px')
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
                    .collection('pantry')
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
        document.getElementById('recipes-button').setAttribute('style', 'visibility: hidden;');
    })
});

// If user clicks the Move Checked Items to Pantry button, will delete the items from this list and firestore
// and add them to My Shopping List
document.getElementById('move-button').addEventListener('click', function () {
    firebase.auth().onAuthStateChanged(function (user) {

        var current_list = document.getElementById('current-list').textContent;
        var checkboxes = document.getElementsByClassName('form-check-input');

        Array.from(checkboxes).forEach((box) => {
            if (box.checked === true) {
                let quantity_value = parseInt(box.nextSibling.nextSibling.nextSibling.nextSibling.value);
                let item_name = box.nextSibling.textContent;
                box.parentNode.remove();

                db.collection('users').doc(user.uid)
                    .collection('shopping').doc('My Shopping List-' + item_name)
                    .set({
                        'name': item_name,
                        'list_name': 'My Shopping List',
                        'category': 'shopping',
                        'quantity': quantity_value
                    })

                db.collection('users').doc(user.uid)
                    .collection('pantry')
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
        document.getElementById('recipes-button').setAttribute('style', 'visibility: hidden;');
    })
});

// Search for recipe inspiration with checked items
document.getElementById('recipes-button').addEventListener('click', function () {
    let recipe_search = [];
    var checkboxes = document.getElementsByClassName('form-check-input');
    var search_url = 'https://www.google.com/search?q=';
    Array.from(checkboxes).forEach((box) => {
        if (box.checked === true) {
            recipe_search.push(box.nextSibling.textContent);
        }
    })
    for (let i = 0; i < recipe_search.length; i++) {
        search_url += recipe_search[i];
        search_url += '+';
    }
    window.open(search_url + 'recipe')
});