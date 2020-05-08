let itemsArray = getArrayOfProductIds();
displayCartSummary(itemsArray);

const firstNameField = document.querySelector('#firstName');
const lastNameField = document.querySelector('#lastName');
const emailField = document.querySelector('#email');
const addressField = document.querySelector('#address');
const cityField = document.querySelector('#city');

/* Validation Mail */
let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

/* Validation du formulaire */
let formFields = document.querySelectorAll('input');
for (let i = 0; i < 5; i++) {
    formFields[i].addEventListener('blur', ($event) => {
        if ($event.target.id == "email") {

            /* Email : Validation des expressions régulières */
            if ($event.target.value == "") {
                emailField.parentNode.querySelector('.blank-msg').style.display = "block";
                emailField.parentNode.querySelector('.incorrect-msg').style.display = "none";
            } else if (!re.test($event.target.value)) {
                emailField.parentNode.querySelector('.blank-msg').style.display = "none";
                emailField.parentNode.querySelector('.incorrect-msg').style.display = "block";
            } else {
                emailField.parentNode.querySelector('.blank-msg').style.display = "none";
                emailField.parentNode.querySelector('.incorrect-msg').style.display = "none";
            }
        } else {

            /* Autres : Validation si non vide */
            if ($event.target.value == "") {
                formFields[i].parentNode.querySelector('.blank-msg').style.display = "block";
            } else {
                formFields[i].parentNode.querySelector('.blank-msg').style.display = "none";
            }
        }
    });
}

/* Récupérer les données et les envoyer sur le serveur */
const processOrderButton = document.querySelector('.process-order-button');
processOrderButton.addEventListener('click', ($event) => {
    $event.preventDefault();
    if (firstNameField.value != "" && lastNameField.value != "" && emailField.value != "" && addressField.value != "" && cityField.value != "" && re.test(emailField.value)) {
        let contact = {
            "firstName": firstNameField.value,
            "lastName": lastNameField.value,
            "email": emailField.value,
            "address": addressField.value,
            "city": cityField.value
        };
        let products = JSON.parse(localStorage.cartItems, true);
        let data = {
            "contact": contact,
            "products": products
        };
        processOrder(JSON.stringify(data));
    } else {
        for (let i = 0; i < 5; i++) {
            if (formFields[i].value == "") {
                formFields[i].parentNode.querySelector('.blank-msg').style.display = "block";
            } else {
                formFields[i].parentNode.querySelector('.blank-msg').style.display = "none";
            }
        }
    }
});