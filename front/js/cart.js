/* <---------------------------------------------- constantes & variables  --------------------------------------------------------------------> */

const cartItems = document.getElementById("cart__items");
const cartItem = document.getElementsByClassName("cart__item");
const totalQuantity = document.getElementById("totalQuantity");
const itemQuantity = document.getElementsByClassName("itemQuantity");
const totalPrice = document.getElementById("totalPrice");
const deleteItem = document.getElementsByClassName("deleteItem");

/* <---------------------------------------------- fonctions --------------------------------------------------------------------> */

// recupère les données présentent sur l'api
const retrieveProductsPromise = () => {
  let storedIdUpdated = [];
  // on déclare un tableau de promesses qui va stocker une promesse par item présent dans le localStorage
  let promises = [];
  // cette boucle sert à supprimer les doublons d'id dans le localStorage
  for (let i = 0; i < storedItems.length; i++) {
    // doublons possiblent dans storedItems[i].id car differentes couleurs avec meme id possible
    // à chaque incrémentation nous verifions donc si l'id à été incrémenté précedemment, sinon on stock le nouvel id pour l'utiliser dans fetch en dessous
    if (!storedIdUpdated.includes(storedItems[i].id)) {
      storedIdUpdated.push(storedItems[i].id);
    }
  }
  // on crée un tableau de promesses qui retourne chaque informations par id
  for (const id of storedIdUpdated) {
    promises.push(
      // on utilise storedIdUpdated pour récuperer les id et cibler notre fetch >> on incremente dans l'array promises pour chaque id unique
      fetch("http://localhost:3000/api/products/" + id)
        .then((res) => res.json())
        .catch((err) =>
          console.log(
            "Une erreur s'est produite sur la fonction retrieveProductsData ",
            err
          )
        )
    );
  }
  // on retourne les promesses afin de les résoudre dans mainCart()
  return promises;
};

// permets de mettre à jour totaux et/ou DOM apres resolution des promesses
const mainCart = () => {
  // retourne le tableau de promesses promises
  const productsPromise = retrieveProductsPromise();
  // on résout les promesses retournées par retrieveProductsPromise() et les passe en arguments des fn
  Promise.all(productsPromise).then((products) => {
    // Cette condition permet de pouvoir lancer la fn sumTotals sans fillCart qui ne se jouera qu'une seule fois au chargement de la page en verifiant si un ou plusieurs child article sont présent sur le DOM
    if (!document.querySelector("#cart__items > article")) {
      // verifie si DOM enfant à cartItems existe
      fillCart(products);
    }
    sumTotals(products);
  });
};

// on verifie si le panier existe dans le localStorage, si oui alors on lance mainCart
if (localStorage.getItem("Panier")) {
  var storedItems = JSON.parse(localStorage.getItem("Panier"));
  mainCart(); // Mise en place DOM et totaux
}

// crée le DOM du panier en comparant les ids dans l'api et le local storage
const fillCart = (apiProducts) => {
  //on joue chaque produits récupérés
  apiProducts.map((apiProduct) => {
    //boucle for pour avoir accès à l'index de storedItems
    for (let i = 0; i < storedItems.length; i++) {
      // dès qu'un id de stocké match avec l'id de l'api on ajoute alors les infos présentent dans l'api au DOM
      if (apiProduct._id === storedItems[i].id) {
        /* -------------------------- creations des éléments ------------------------------------- */
        let article = document.createElement("article");
        let divImg = document.createElement("div");
        let img = document.createElement("img");
        let divContent = document.createElement("div");
        let divContentDescription = document.createElement("div");
        let h2 = document.createElement("h2");
        let pColor = document.createElement("p");
        let pPrice = document.createElement("p");
        let divContentSettings = document.createElement("div");
        let divContentSettingsQuantity = document.createElement("div");
        let pQuantité = document.createElement("p");
        let pInput = document.createElement("input");
        let divContentSettingsDelete = document.createElement("div");
        let pDelete = document.createElement("p");

        /* -------------------------- creations des attributs des éléments ------------------------------------- */

        article.setAttribute("class", "cart__item");
        article.setAttribute("data-id", `${storedItems[i].id}`);
        article.setAttribute("data-color", `${storedItems[i].color}`);
        divImg.setAttribute("class", "cart__item__img");
        img.setAttribute("src", apiProduct.imageUrl);
        img.setAttribute("alt", apiProduct.altTxt);
        divContent.setAttribute("class", "cart__item__content");
        divContentDescription.setAttribute(
          "class",
          "cart__item__content__description"
        );
        divContentSettings.setAttribute(
          "class",
          "cart__item__content__settings"
        );
        divContentSettingsQuantity.setAttribute(
          "class",
          "cart__item__content__settings__quantity"
        );
        pInput.setAttribute("type", "number");
        pInput.setAttribute("class", "itemQuantity");
        pInput.setAttribute("name", "itemQuantity");
        pInput.setAttribute("min", "1");
        pInput.setAttribute("max", "100");
        pInput.setAttribute("value", `${storedItems[i].quantity}`);
        divContentSettingsDelete.setAttribute(
          "class",
          "cart__item__content__settings__delete"
        );
        pDelete.setAttribute("class", "deleteItem");

        /* -------------------------- insertion de texte ------------------------------------- */

        h2.innerText = apiProduct.name;
        pColor.innerText = storedItems[i].color;
        pPrice.innerText = apiProduct.price + " €";
        pQuantité.innerText = "Qté :";
        pDelete.innerText = "Supprimer";

        /* -------------------------- insertion des elements crée dans leurs parents ------------------------------------- */

        cartItems.appendChild(article);
        article.append(divImg, divContent);
        divImg.appendChild(img);
        divContent.append(divContentDescription, divContentSettings);
        divContentDescription.append(h2, pColor, pPrice);
        divContentSettings.append(
          divContentSettingsQuantity,
          divContentSettingsDelete
        );
        divContentSettingsQuantity.append(pQuantité, pInput);
        divContentSettingsDelete.appendChild(pDelete);

        /* -------------------------- fonction à lancer dans le scope de fillCart() car besoin des elements sur le DOM ------------------------------------- */

        deleteItemFn();
        updateQuantity();
      }
    }
  });
};

// additionne le nombre d'items dans le panier
const sumTotals = (apiProducts) => {
  let totalP = 0; // total price
  let totalQ = 0; // total Quantity
  apiProducts.forEach((apiProduct) => {
    for (let i = 0; i < storedItems.length; i++) {
      // récupère la quantité et le prix pour chaque produit affiché sur le DOM (quand l'id de l'api match l'id du storage)
      if (apiProduct._id === storedItems[i].id) {
        // on calcul la quantité
        let quantity = storedItems[i].quantity;
        let quantityParsed = parseInt(quantity);
        totalQ += quantityParsed;
        // on calcul le prix
        let price = apiProduct.price;
        let priceParsed = parseInt(price);
        totalP += priceParsed * storedItems[i].quantity;
      }
    }
    // on met à jour le DOM avec les nouvelles données
    totalQuantity.textContent = totalQ;
    totalPrice.textContent = totalP;
  });
};

// supprime l'item du localstorage et du DOM
const deleteItemFn = () => {
  // array.from sert à acceder à forEach car getElementsByclassname est une HTMLcollection et non une nodelist
  Array.from(deleteItem).forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      // on selectionne l'item a supprimer grace à l'index d'items
      let itemToDelete =
        storedItems[Array.from(deleteItem).indexOf(deleteButton)];
      // on garde tous les items qui sont differents de l'item a supprimer grace à filter()
      storedItems = storedItems.filter(
        (storedItems) => storedItems !== itemToDelete
      );
      // on met à jour dans le localStorage sans l'item à supprimer
      let stringifiedstoredItems = JSON.stringify(storedItems);
      localStorage.setItem("Panier", stringifiedstoredItems);

      deleteButton.closest("article").remove();
      mainCart(); // pour mettre à jour totaux
    });
  });
};

// changer le nombre d'items
const updateQuantity = () => {
  // récupère la quantité d'item par item dans le panier
  Array.from(itemQuantity).forEach((quantity) => {
    quantity.addEventListener("change", () => {
      let newItemQuantity = quantity.value; // nouvelle quantité à chanque input change
      let myItem = quantity.closest("article"); // selectionne la balise article de l'item dont on change la quantité
      if(quantity.value <=0){
        alert("Merci de choisir une quantité valide")
        return quantity.value = 1;
      }
      for (const item of storedItems) {
        //on vérifie si l'item dont on change la quantité  est présent dans le sotrage
        if (
          item.id === myItem.dataset.id &&
          item.color === myItem.dataset.color
        ) {
          //si oui on change la quantité
          item.quantity = newItemQuantity;
        }
      }
      // et on met à jour dans le localStorage
      let stringifiedStoreditems = JSON.stringify(storedItems);
      localStorage.setItem("Panier", stringifiedStoreditems);

      mainCart(); // pour mettre à jour totaux
    });
  });
};

/* <---------------------------------------------- const et variables --------------------------------------------------------------------> */

const form = document.querySelector("form");
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="email"]'
);
const error = document.querySelector(" #firstName + p");

let products = [];
let firstName, lastName, address, city, email;
let regexText = /^[a-zA-Z_.-]*$/g;
let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
let regexCity = /^[a-zA-Zéè]+(?:[\s-][a-zA-Zéè]+)*$/gi;
let regexAdress = /^[a-zA-Z0-9\s,'-]*$/gi;
/* <-------------------------------------------------------------------------------------------------------------------------------------------> */

/* <---------------------------------------------- Fonctions de verifications des inputs --------------------------------------------------------------------> */

/* chaque fonction de vérification utilise en argument la value rentrée a chaque input grace à la fonction addEventListener qui les suit */

// verifie les conditions du prénom et retourne la variable seulement si conditions remplies
const firstNameChecker = (value) => {
  if (value.length > 0 && (value.length < 2 || value.length > 60)) {
    errorDisplay("firstName", "Le prénom doit faire entre 2 et 60 caractères");
    firstName = null;
  } else if (!value.match(regexText)) {
    errorDisplay(
      "firstName",
      "Le prénom ne doit pas contenir de caractères spéciaux"
    );
    firstName = null;
  } else {
    errorDisplay("firstName", "", true);
    firstName = value;
  }
};

// verifie les conditions du nom et retourne la variable seulement si conditions remplies
const lastNameChecker = (value) => {
  if (value.length > 0 && (value.length < 2 || value.length > 60)) {
    errorDisplay("lastName", "Le nom doit faire entre 2 et 60 caractères");
    lastName = null;
  } else if (!value.match(regexText)) {
    errorDisplay(
      "lastName",
      "Le nom ne doit pas contenir de caractères spéciaux"
    );
    lastName = null;
  } else {
    errorDisplay("lastName", "", true);
    lastName = value;
  }
};

// verifie les conditions de l'email et retourne la variable seulement si conditions remplies
const emailChecker = (value) => {
  if (!value.match(regexEmail)) {
    errorDisplay("email", "Le mail n'est pas valide");
    email = null;
  } else {
    errorDisplay("email", "", true);
    email = value;
  }
};

// verifie les conditions de l'adresse et retourne la variable seulement si conditions remplies
const addressChecker = (value) => {
  if (!value.match(regexAdress)) {
    errorDisplay(
      "address",
      "L'adresse ne peut pas contenir de caractères spéciaux autre que le point, la virgule ainsi que le tiret central."
    );
    address = null;
  } else {
    errorDisplay("address", "", true);
    address = value;
  }
};

// verifie les conditions de la ville et retourne la variable seulement si conditions remplies
const cityChecker = (value) => {
  if (!value.match(regexCity)) {
    errorDisplay("city", "Saisir un nom de ville Ex :Saint-jean-de-vedas");
    city = null;
  } else {
    errorDisplay("city", "", true);
    city = value;
  }
};

// fn gérant l'affichage des erreurs sur le DOM pour chaque fn de vérification
/*  tag = class ou id ou selecteur 
    message = message à afficher si erreur vraie
    valid = boolean true = no error  false = error */
const errorDisplay = (tag, message, valid) => {
  const container = document.getElementById(tag);
  const error = document.querySelector("#" + tag + " + p");

  if (!valid) {
    container.classList.add("error");
    error.textContent = message;
  } else {
    container.classList.remove("error");
    error.textContent = message;
  }
};

/* <-------------------------------------------------------------------------------------------------------------------------------------------> */

/* <---------------------------------------------------------------EventListeners----------------------------------------------------------------> */

// lance chaque fonction de verification selon l'input que nous utilisons, nous utilisons la value rentrée en argument
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "lastName":
        lastNameChecker(e.target.value);
        break;
      case "firstName":
        firstNameChecker(e.target.value);
        break;
      case "email":
        emailChecker(e.target.value);
        break;
      case "address":
        addressChecker(e.target.value);
        break;
      case "city":
        cityChecker(e.target.value);
        break;
      default:
        null;
    }
  });
});

// envoie les données au serveur back au click sur commander
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // verifie si aucun item n'est présent dans le localStorage
  if (!storedItems) {
    alert("Veuillez selectionner au moins un article avant de commander !");
    document.location.href = `index.html`;
  }
  // si au moins un item présent nous rentrons dans la condition du else suivant
  else {
    // récupère les ids dans le localStorage et le push dans products, afin de les envoyer dans le form
    for (let i = 0; i < storedItems.length; i++) {
      products.push(storedItems[i].id);
    }
    // verifie si les values ont bien été retournées par les fonctions de verifications, les fonctions de verifications retourne une variable null si elle ne correspondent pas aux conditions. Nous verifions donc si elles ne sont PAS null.
    if (firstName && lastName && address && city && email) {
      // values de chaque input du form.
      const contact = {
        firstName,
        lastName,
        address,
        city,
        email,
      };

      // objet contenant l'objet contact et l'array products contenant les ids présent dans le localStorage
      const formData = {
        contact,
        products,
      };

      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }; 
      // envoie les données au serveur.
      fetch("http://localhost:3000/api/products/order", options)
        .then((res) => res.json())
        .then((data) => {
          // on redirige vers la page de confirmation de commande en passant l'orderId (numéro de commande) dans l'URL
          document.location.href = `confirmation.html?orderId=${data.orderId}`;
        })
        .catch((err) => {
          console.log("Erreur Fetch product.js", err);
          alert("Un problème a été rencontré lors de l'envoi du formulaire.");
        });

      alert("Commande validée !");
    }
    // sinon nous demandons de remplir correctment les champs
    else {
      alert("veuillez remplir correctement les champs");
    }
  }
});