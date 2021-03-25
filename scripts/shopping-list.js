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

function writeNewItem(item) {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection('users')
            .doc(user.uid)
            .collection('shopping_list')
            .add({
                item: item
            })
    })
}