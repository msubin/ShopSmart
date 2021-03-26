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

function replacedInput() {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "form-control");
    input.setAttribute("id", "js-inputFoodGroup");

    const div = document.getElementById("inputFoodGroup");

    const span = document.getElementById("js-foodGroup");
    span.remove();

    div.appendChild(input);
}

function displayFoodGroup() {
    db.collection("FoodGroup").get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var n = doc.data().name;
                console.log(n);
                var group = doc.data().foodGroup;
                console.log(group);
                const itemName = document.getElementById("js-itemName").innerText
                if (itemName != n) {
                    replacedInput();
                }
                else {
                    document.getElementById("js-foodGroup").textContent = group;
                }
            })
        })
}

displayFoodGroup();