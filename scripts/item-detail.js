/*
save the food API (category) data in firebase
read the data from category, and add item search bar
*/

function readLocalJSON() {
    fetch("food.json")
        .then(function (response) {
            response.json()
                .then(function (data) {
                    data.forEach(function (item) {
                        var food = {
                            "name": item["name"],
                            "food-group": item["food_group"]
                        }
                        db.collection("foods")
                            .add(food);
                    })
                })
        })
}


// Add the category automatically if the product name === input product name
// otherwise, make an input block

function displayFoodGroup() {
    db.collection("foods").get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var name = doc.data()["name"];
                var group = doc.data()["food-group"];
                const itemName = document.getElementById("js-itemName").innerText
                if (itemName != name) {

                }
                else {
                    document.getElementById('js-inputFoodGroup').remove();

                    input_div = document.getElementById('inputFoodGroup');

                    span = document.createElement('span');
                    span.setAttribute('id', 'js-Foodgroup');
                    span.textContent = group;

                    input_div.append(span);
                }
            })
        })
}
displayFoodGroup();
