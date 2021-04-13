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
