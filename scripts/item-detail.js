/*
save the food API (category) data in firebase
read the data from category, and add item search bar
*/

// Save FoodGroup data 
function writeFoodGroup() {
    var foodGroupsRef = db.collection("FoodGroup");

    foodGroupsRef.add({
        name: "Peanut",
        foodGroup: "Nuts",
    });
    foodGroupsRef.add({
        name: "Red rice",
        foodGroup: "Cereals",
    });
    foodGroupsRef.add({
        name: "Banana",
        foodGroup: "Fruits",
    });
    foodGroupsRef.add({
        name: "Cucumber",
        foodGroup: "Gourds",
    });
    foodGroupsRef.add({
        name: "Kiwi",
        foodGroup: "Fruits",
    });
    foodGroupsRef.add({
        name: "Milk",
        foodGroup: "Dairy",
    });
}

// writeFoodGroup();


// Add the category automatically if the product name === input product name
// otherwise, make an input block

function displayFoodGroup() {
    db.collection("FoodGroup").get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var n = doc.data().name;
                var group = doc.data().foodGroup;
                const itemName = document.getElementById("js-itemName").innerText
                if (itemName != n) {

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