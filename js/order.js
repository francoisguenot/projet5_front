const queryParameters = getQueryStringParameters();

if (queryParameters.orderId) {

    /* Si orderId est présent dans les paramètres d'interrogation, vider le panier et afficher la confirmation de la commande */
    emptyShoppingCart();
    const orderId = queryParameters.orderId;
    document.querySelector('.order-confirmation').style.display = "block";
    document.querySelector('.order-id').textContent = orderId;
    document.querySelector('.order-price').innerHTML = "&euro;" + localStorage.totalTT;
} else {

    /* Sinon, affichez le message "Echec de la commande". */
    document.querySelector('.order-failure').style.display = "block";
}