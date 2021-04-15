//opening new google window for recipe section
function selectText() {
    let input = document.querySelector("#text_from_input_field")
    let input1 = input.value.replace(/\s/g, '+')
    window.open(`https://www.google.com/search?q=${input1}+recipe`)
}

let logOutButton = document.querySelector("#logoutButton")
logOutButton.addEventListener('click', logOut)
function logOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
    location.href = "../index.html"
}

// name customization in the header
function userFirstName() {
    firebase.auth().onAuthStateChanged(function (somebody) {
        if (somebody) {
            console.log(somebody.uid);
            db.collection("users")
                .doc(somebody.uid) //only getting one document. if this line wasn't here, we'd get whole collection and we'd need to loop over it. UID is in authentication in firebase
                .get()             //READ !!!
                .then(function (doc) {
                    console.log(doc.data().name);
                    var n = doc.data().name.split(' ')[0];
                    $("#name-goes-here").text(n); //jquery points to id and says the text in there is n (which was name from line 11)
                })
        }
    })
}