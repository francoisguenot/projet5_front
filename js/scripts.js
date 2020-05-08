const apiUrl = "http://localhost:3000/api/teddies";
const currencySymbol = "&euro;";


/* Nombre de produit panier */
const cartCountDisplay = document.querySelector('.cart-count');
if (localStorage.cartCount && localStorage.cartCount != 0) {
    cartCountDisplay.style.display = "inline-block";
    cartCountDisplay.textContent = localStorage.cartCount;
}

/* Fonction pour obtenir les paramètres de requête à partir de l'URL */
const getQueryStringParameters = url => {
    let query = "";
    if (url) {
        if (url.split("?").length > 0) {
            query = url.split("?")[1];
        }
    } else {
        url = window.location.href;
        query = window.location.search.substring(1);
    }
    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
            let [key, value] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
        }, {});
};

/* Requête API */
function makeRequest(verb, url, data) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(verb, url);
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200 || request.status === 201) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject(JSON.parse(request.response));
                }
            }
        }
        if (verb == "POST") {
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(data);
        } else {
            request.send();
        }
    });
}

/* Afficher tous les produits sur page accueil */
async function showAllProducts() {
    const promise = makeRequest('GET', apiUrl);
    const response = await promise;

    const loadingDiv = document.querySelector('.loading');
    const allItemsDiv = loadingDiv.parentNode;
    allItemsDiv.innerHTML = "";

    for (let i = 0; i < response.length; i++) {
        let itemImgDiv = document.createElement('div');
        itemImgDiv.classList.add('item-img');
        itemImgDiv.style.backgroundImage = "url('" + response[i].imageUrl + "')";

        let itemNameDiv = document.createElement('div');
        itemNameDiv.classList.add('item-name');
        itemNameDiv.textContent = response[i].name;

        let itemPriceDiv = document.createElement('div');
        itemPriceDiv.classList.add('item-price');
        itemPriceDiv.innerHTML = currencySymbol + response[i].price;

        let itemDiv = document.createElement('a');
        itemDiv.href = 'product.html?id=' + response[i]._id;
        itemDiv.classList.add('item-div');
        itemDiv.classList.add('clearfix');

        itemDiv.appendChild(itemImgDiv);
        itemDiv.appendChild(itemNameDiv);
        itemDiv.appendChild(itemPriceDiv);

        let colDiv = document.createElement('div');
        colDiv.classList.add('col-lg-4');
        colDiv.classList.add('col-md-6');

        colDiv.appendChild(itemDiv);

        allItemsDiv.appendChild(colDiv);
    }
}

/* Produit sur page unique */
async function getProduct(productId) {
    const promise = makeRequest('GET', apiUrl + '/' + productId);
    const response = await promise;

    const itemImg = document.querySelector('.item-img-lg');
    itemImg.src = response.imageUrl;

    const itemName = document.querySelector('h2');
    itemName.textContent = response.name;

    const itemPrice = document.querySelector('h4');
    itemPrice.innerHTML = currencySymbol + response.price;

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


/* Fonction permettant de désactiver le bouton "Ajouter au panier" et d'afficher les liens du panier et de poursuivre les achats */
function disableCartButton() {
    const btnAddToCart = document.querySelector('.btn-add-to-cart');

    /* Désactivez le bouton "Ajouter au panier" et changez le texte en "Ajouté au panier". */
    btnAddToCart.textContent = "Ajouté au panier";
    btnAddToCart.classList.remove('btn-dark');
    btnAddToCart.classList.add('btn-light');
    btnAddToCart.disabled = "disabled";

    /* Afficher les options pour aller au panier ou continuer les achats */
    document.querySelector('.added-to-cart-display').style.display = "block";
}

/*Fonction permettant d'activer le bouton "Ajouter au panier" et de supprimer les liens pour le panier et continuer les achats */
function enableCartButton() {
    const btnAddToCart = document.querySelector('.btn-add-to-cart');

    /* Activez le bouton "Ajouter au panier" et modifiez le texte */
    btnAddToCart.innerHTML = "<i class='fa fa-plus'></i> AJOUTER AU PANIER";
    btnAddToCart.classList.add('btn-dark');
    btnAddToCart.classList.remove('btn-light');
    btnAddToCart.removeAttribute("disabled");

    /* Afficher les options pour aller au panier ou continuer les achats */
    document.querySelector('.added-to-cart-display').style.display = "none";
}

/* Si le produit est déjà dans le panier, désactivez le bouton "Ajouter au panier", affichez "Retirer du panier" et affichez les liens pour le panier et continuez vos achats */
function checkProductInCart(productId) {
    if (localStorage.cartItems) {
        let itemsArray = JSON.parse(localStorage.cartItems, true);
        let isInCart = itemsArray.includes(productId);
        if (isInCart) {
            disableCartButton();
            const removeFromCart = document.querySelector('.remove-from-cart');
            removeFromCart.style.display = "inline-block";
        }
    }
}

/* Récupérer les identifiants des produits dans le stockage local */
function getArrayOfProductIds() {
    if (localStorage.cartItems) {
        try {
            return JSON.parse(localStorage.cartItems, true);
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
}

function displayCartSummary(itemsArray) {
    if (itemsArray && itemsArray.length != 0) {

        /* Si les articles sont dans le panier, afficher le résumé du panier et le formulaire de contact */
        populateCart();
        document.querySelector('.cart-div').style.display = "flex";
    } else {

        /* Sinon, afficher le message du panier vide */
        document.querySelector('.empty-cart-div').style.display = "flex";
    }
}

/* Compléter résumé du panier */
async function populateCart() {
    let totalTT = 0;
    for (let i = 0; i < itemsArray.length; i++) {
        let productId = itemsArray[i];

        let promise = makeRequest('GET', apiUrl + '/' + productId);
        let response = await promise;

        let cartSummaryImage = document.createElement('img');
        cartSummaryImage.src = response.imageUrl;
        cartSummaryImage.classList.add('cart-summary-image');

        let cartImageLink = document.createElement('a');
        cartImageLink.href = 'product.html?id=' + productId;
        cartImageLink.appendChild(cartSummaryImage);

        let cartSummaryName = document.createElement('div');
        cartSummaryName.classList.add('cart-summary-name');
        cartSummaryName.innerHTML = '<strong>' + response.name + '</strong>';

        let categoryDiv = document.createElement('div');
        categoryDiv.classList.add('small');
        categoryDiv.textContent = "Fait Maison";

        let colDiv = document.createElement('div');
        colDiv.classList.add('col-auto');
        colDiv.appendChild(cartImageLink);
        colDiv.appendChild(cartSummaryName);
        colDiv.appendChild(categoryDiv);

        let priceDiv = document.createElement('div');
        priceDiv.classList.add('col-auto');
        priceDiv.classList.add('ml-auto');
        priceDiv.innerHTML = currencySymbol + response.price;

        let rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        rowDiv.classList.add('mb-3');
        rowDiv.appendChild(colDiv);
        rowDiv.appendChild(priceDiv);

        let cartSummaryDiv = document.querySelector('.cart-summary-products');
        cartSummaryDiv.appendChild(rowDiv);

        totalTT += response.price;
    }
    let totalTTDiv = document.querySelector('.total_TT');
    totalTTDiv.innerHTML = currencySymbol + totalTT;

    localStorage.totalTT = totalTT;
}


/* Fonction de traitement de la commande - Envoi des données au serveur, récupération de l'ID de la commande et redirection vers la page de confirmation de la commande */
async function processOrder(data) {
    let promise = makeRequest('POST', apiUrl + '/order', data);
    let response = await promise;

    if (response.orderId) {
        window.location.href = "order-confirmation.html?orderId=" + response.orderId;
    } else {
        window.location.href = "order-confirmation.html";
    }
}


/* Panier vide */
function emptyShoppingCart() {
    localStorage.removeItem('cartCount');
    localStorage.removeItem('cartItems');
    const cartCountDisplay = document.querySelector('.cart-count');
    cartCountDisplay.textContent = 0;
    cartCountDisplay.style.display = "none";
}