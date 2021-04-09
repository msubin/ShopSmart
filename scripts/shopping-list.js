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
                'category': 'shopping',
                'quantity': 1
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
            .collection('lists').doc(text)
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
            .collection('lists')
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

// Populates list with items from firestore
function itemsQuery() {
    firebase.auth().onAuthStateChanged(function (user) {
        current_list = document.getElementById('current-list').textContent;

        db.collection('users').doc(user.uid)
            .collection('lists')
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

// Increment counter
function incrementCounter(current_object) {
    let current_num = current_object.nextSibling.value;
    let incremented_num = (parseInt(current_num) + 1)
    current_object.nextSibling.value = incremented_num

    firebase.auth().onAuthStateChanged(function (user) {
        let current_list = document.getElementById('current-list').textContent;
        let item = current_object.previousSibling.textContent;

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
            let item = current_object.previousSibling.previousSibling.previousSibling.textContent;

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
// and add them to My Pantry List
document.getElementById('move-button').addEventListener('click', function () {
    firebase.auth().onAuthStateChanged(function (user) {

        var current_list = document.getElementById('current-list').textContent;
        var checkboxes = document.getElementsByClassName('form-check-input');

        Array.from(checkboxes).forEach((box) => {
            if (box.checked === true) {
                let quantity_value = parseInt(box.nextSibling.nextSibling.nextSibling.value);
                let item_name = box.nextSibling.textContent;
                box.parentNode.remove();

                db.collection('users').doc(user.uid)
                    .collection('lists').doc('My Pantry List-' + item_name)
                    .set({
                        'name': item_name,
                        'list_name': 'My Pantry List',
                        'category': 'pantry',
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