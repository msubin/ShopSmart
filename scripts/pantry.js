// Creates new item from input
document.getElementById('add_item_button').addEventListener('click', function (event) {
    let item_name = document.getElementById('add_item_input');

    if (item_name.value != '') {
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
        more_button.setAttribute('style', 'float: right; width: 25px; height: 25px; padding-top: 5px;')
        more_button.type = 'button'
        more_button.setAttribute('data-bs-toggle', 'modal')
        more_button.setAttribute('data-bs-target', '#exampleModal')

        more_button.addEventListener('click', function () {
            itemDetailsPage(this);
            var test = document.getElementById('exampleModal');
            test.focus();
        })

        quantity_number = document.createElement('input');
        quantity_number.type = 'number';
        quantity_number.value = 1;
        quantity_number.setAttribute('style', 'float: right; width: 25px; text-align: center;');

        minus_quantity = document.createElement('input');
        minus_quantity.type = 'button';
        minus_quantity.value = '-';
        minus_quantity.setAttribute('style', 'float: right; width: 25px;');

        minus_quantity.addEventListener('click', function () {
            decrementCounter(this);
        })

        plus_quantity = document.createElement('input');
        plus_quantity.type = 'button';
        plus_quantity.value = '+';
        plus_quantity.setAttribute('style', 'float: right; width: 25px; margin-right: 10px;');

        plus_quantity.addEventListener('click', function () {
            incrementCounter(this);
        })

        item_name.value = '';

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
            .collection('lists').doc(current_list + '-' + item)
            .set({
                'name': item,
                'list_name': current_list,
                'category': 'pantry',
                'quantity': 1
            })
    })
};

// Creates new HTML for new list
document.getElementById('create-new-list').addEventListener('click', function (event) {
    let list_name = prompt("Please enter a name for your new list:")

    if (list_name != null) {
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
            .collection('lists').doc(text)
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
            .collection('lists')
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
}

// Populates list with items from firestore
function itemsQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        current_list = document.getElementById('current-list').textContent;

        db.collection('users').doc(user.uid)
            .collection('lists')
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

                    let checkbox_new_item = document.createElement('input');
                    checkbox_new_item.setAttribute('class', 'form-check-input');
                    checkbox_new_item.setAttribute('type', 'checkbox');
                    checkbox_new_item.setAttribute('value', '');

                    let label_checkbox = document.createElement('label');
                    label_checkbox.setAttribute('class', 'form-check-label');
                    label_checkbox.setAttribute('for', 'flexCheckDefault');
                    label_checkbox.textContent = item;

                    quantity_number = document.createElement('input');
                    quantity_number.type = 'number';
                    quantity_number.value = quantity_value;
                    quantity_number.setAttribute('style', 'float: right; width: 25px; text-align: center;');

                    minus_quantity = document.createElement('input');
                    minus_quantity.type = 'button';
                    minus_quantity.value = '-';
                    minus_quantity.setAttribute('style', 'float: right; width: 25px;');

                    minus_quantity.addEventListener('click', function () {
                        decrementCounter(this);
                    })

                    plus_quantity = document.createElement('input');
                    plus_quantity.type = 'button';
                    plus_quantity.value = '+';
                    plus_quantity.setAttribute('style', 'float: right; width: 25px; margin-right: 10px;');

                    plus_quantity.addEventListener('click', function () {
                        incrementCounter(this);
                    })

                    more_button = document.createElement('i');
                    more_button.setAttribute('class', 'fas fa-ellipsis-h');
                    more_button.setAttribute('id', 'more-button-' + item)
                    more_button.setAttribute('style', 'float: right; width: 25px; height: 25px; padding-top: 5px;')
                    more_button.type = 'button'
                    more_button.setAttribute('data-bs-toggle', 'modal')
                    more_button.setAttribute('data-bs-target', '#exampleModal')

                    more_button.addEventListener('click', function () {
                        itemDetailsPage(this);
                        var test = document.getElementById('exampleModal');
                        test.focus();
                    })

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

// Function for Item Details
function itemDetailsPage(current_object) {
    var item_name = current_object.previousSibling.textContent;
    document.getElementById('modal-header').textContent = item_name;

    // var plural_item = item_name.slice(0, item_name.length);

    var quantity = current_object.nextSibling.nextSibling.value;
    document.getElementById('item-detail-quantity').value = quantity;

    db.collection("foods").get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var name = doc.data()["name"];
                var group = doc.data()["food-group"];
                if (item_name.toLowerCase() === name.toLowerCase()) {
                    document.getElementById('js-inputFoodGroup').setAttribute('style', 'display: none;')

                    // input_div = document.getElementById('inputFoodGroup');

                    // span = document.createElement('span');
                    // span.setAttribute('id', 'js-FoodGroup');
                    item = document.getElementById('js-FoodGroup')
                    item.setAttribute('style', 'display: block;')
                    item.textContent = group;

                    // input_div.appendChild(span);
                }
            })
        })

    modal = document.getElementById('exampleModal');
    modal.addEventListener('click', function () {
        item.setAttribute('style', 'display: none;')
        document.getElementById('js-inputFoodGroup').setAttribute('style', 'display: block;')
    })

    close_button = document.getElementById('closeBtn');
    close_button.addEventListener('click', function () {
        item.setAttribute('style', 'display: none;')
        document.getElementById('js-inputFoodGroup').setAttribute('style', 'display: block;')
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
            .collection('lists').doc(current_list + '-' + item)
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
                .collection('lists').doc(current_list + '-' + item)
                .update({
                    'quantity': decremented_num
                })
        })
    }
}

// Makes remove button appear or disappear
function checkCheckBoxes() {
    remove_button = document.getElementById('remove-button')
    move_button = document.getElementById('move-button')
    if ($('input[type="checkbox"]:checked').length > 0) {
        console.log('A checkbox is still checked.')
        remove_button.setAttribute('style', 'visibility: visible;')
        move_button.setAttribute('style', 'visibility: visible;')
    } else {
        console.log('No more checked boxes.')
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
                    .collection('lists')
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
                    .collection('lists').doc('My Shopping List-' + item_name)
                    .set({
                        'name': item_name,
                        'list_name': 'My Shopping List',
                        'category': 'shopping',
                        'quantity': quantity_value
                    })

                db.collection('users').doc(user.uid)
                    .collection('lists')
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