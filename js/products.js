const queryParameters = getQueryStringParameters();
const productId = queryParameters.id;
getProduct(productId);
checkProductInCart(productId);


/* Produit sur page unique */
async function getProduct(productId) {
    const promise = makeRequest('GET', apiUrl + '/' + productId);
    const response = await promise;

    const itemImg = document.querySelector('.item-img-lg');
    itemImg.src = response.imageUrl;

    const itemName = document.querySelector('h2');
    itemName.textContent = response.name;

    const itemPrice = document.querySelector('h4');
    itemPrice.innerHTML = currencySymbol + response.price / 100;

    const itemCode = document.querySelector('.item-code');
    itemCode.textContent = productId;

    const itemDescription = document.querySelector('.item-desc');
    itemDescription.innerHTML = response.description;

    const itemSelect = document.querySelector('.item-select');
    const colors = response.colors;
    for (let i = 0; i < colors.length; i++) {
        let colorOption = document.createElement('option');
        colorOption.value = colors[i];
        colorOption.textContent = colors[i];
        itemSelect.appendChild(colorOption);
    }

    const productDiv = document.querySelector('.product-container');
    productDiv.style.visibility = 'visible';
}
/* Fonctionnalité du bouton Ajouter au panier */

const btnAddToCart = document.querySelector('.btn-add-to-cart');
btnAddToCart.addEventListener('click', () => {

    /* MàJ du nombre de produit dans le localstorage */
    if (localStorage.cartCount) {
        localStorage.cartCount = Number(localStorage.cartCount) + 1;
    } else {
        localStorage.cartCount = 1;
    }

    /* Ajouter les id produit dans le local storage */
    if (localStorage.cartItems) {
        let itemsArray = JSON.parse(localStorage.cartItems, true);
        itemsArray.push(productId);
        localStorage.cartItems = JSON.stringify(itemsArray);
    } else {
        let itemsArray = [productId];
        localStorage.cartItems = JSON.stringify(itemsArray);
    }

    /* MàJ du nombre de produit dans le panier */
    cartCountDisplay.style.display = "inline-block";
    cartCountDisplay.textContent = localStorage.cartCount;

    disableCartButton();
    removeFromCart.style.display = "inline-block";
});


/* Option suppression du panier */

const removeFromCart = document.querySelector('.remove-from-cart');
removeFromCart.addEventListener('click', ($event) => {
    $event.preventDefault();

    /* MàJ nombre article dans le panier */
    if (localStorage.cartCount) {
        localStorage.cartCount = Number(localStorage.cartCount) - 1;
    }

    /* Ajouter Id produit */
    if (localStorage.cartItems) {
        let itemsArray = JSON.parse(localStorage.cartItems, true);
        let index = itemsArray.indexOf(productId);
        if (index > -1) {
            itemsArray.splice(index, 1);
        }
        localStorage.cartItems = JSON.stringify(itemsArray);
    }

    /* MàJ nb produit du panier */
    if (localStorage.cartCount == 0) {
        cartCountDisplay.style.display = "none";
    } else {
        cartCountDisplay.textContent = localStorage.cartCount;
    }

    enableCartButton();
    removeFromCart.style.display = "none";
});