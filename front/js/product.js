const itemImg = document.querySelector(".item__img");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");

// récupère la data de l'api à l'aide de l'id dans l'url
const retrieveProductsData = () =>
  fetch("http://localhost:3000/api/products/" + checkIdUrl())
    .then((res) => res.json())
    .then((data) => {
      fillItemImg(data);
      fillItemContent(data);
    })
    .catch((err) =>
      console.log(
        "Une erreur s'est produite sur la fonction retrieveProductsData ",
        err
      )
    );

// récupère le paramètre id dans l'url
const checkIdUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const idParams = params.get("id");
  return idParams;
};
// créé un nouvel item dans pour le localStorage à l'aide des arguments inputQuantity et inputColor déclarés dans addToStorage();
const createNewItem = (inputQuantity, inputColor) => {
  // on récupère le localStorage dans une variable
  let storedItems = JSON.parse(localStorage.getItem("Panier"));
  // on créé un nouvel objet
  let newItem = {
    id: checkIdUrl(),
    quantity: inputQuantity,
    color: inputColor,
  };
  // on vérifie si des objets sont stockés grace à storedItems
  // si oui on push dans l'array existant
  if (storedItems) {
    storedItems.push(newItem);
  } else {
    // si non on défini storedItems en type Array et on push newItem dedans
    storedItems = [];
    storedItems.push(newItem);
  }
  // on ajoute au localStorage
  let stringifiedStoreditems = JSON.stringify(storedItems);
  localStorage.setItem("Panier", stringifiedStoreditems);
  alert(
    `Vous avez ajouté ${inputQuantity} ${title.textContent} de couleur ${inputColor} à votre panier !`
  );
};

// ajoute au localstorage un id, nombre d'articles et la couleur
function addToStorage() {
  let storedItems = JSON.parse(localStorage.getItem("Panier"));
  // récupère la quantité et la couleur voulu par le client
  let inputQuantity = quantity.value;
  let inputColor = colors.value;

  if (inputColor === "") {
    alert("Merci de choisir une couleur !");
  } else if (inputQuantity <= 0) {
    alert("Merci de choisir une quantité valide !");
    //verifie si sotredItems (localstorage) existe
  } else if (storedItems) {
    for (const item of storedItems) {
      // verifie si l'objet que nous ajoutons existe deja dans le localstorage (meme couleur & id)
      if (item.id.includes(checkIdUrl()) && item.color.includes(inputColor)) {
        // on transforme inputQuantity et la quantité dans le localStorage en integer pour pouvoir les additionner
        let inputQuantityParsed = parseInt(inputQuantity);
        let quantityParsed = parseInt(item.quantity);
        // nouvelle quantité de l'article
        let newInputQuantity = inputQuantityParsed + quantityParsed;
        // si le nouveau total est supérieur à 100 on bloque la quantité à 100 et envoie un message d'explication
        if (newInputQuantity > 100) {
          newInputQuantity = 100;
          alert(
            `Votre panier contient déjà ${quantityParsed} fois cette article, Le nombre d'article maximal etant de 100, l'article a été ajouté ${
              100 - quantityParsed
            } fois au lieu de ${inputQuantityParsed}.`
          );
        }
        item.quantity = newInputQuantity;
        // après MAJ quantity d'item dans storedItems on ajoute storedItems au localSotrage
        let stringifiedStoreditems = JSON.stringify(storedItems);
        localStorage.setItem("Panier", stringifiedStoreditems);
        return alert(
          `Quantité modifiée ! Vous avez ajouté ${inputQuantityParsed} ${title.textContent} de couleur ${inputColor} à votre panier !`
        );
      }
    }
    // on créé un nouvel item dans le cas ou la key Panier dans le localStorage est déja créée et qu'il s'agit bien d'un nouvel item
    createNewItem(inputQuantity, inputColor);
  }
  // on créé un nouvel item dans le cas ou la key Panier dans le localStorage n'existe pas
  else {
    createNewItem(inputQuantity, inputColor);
  }
}

addToCart.addEventListener("click", addToStorage);

// les deux fonctions suivantes remplissent le html à l'aide de la fonction mainProduct en dessous qui récupère la data en asynchrone
const fillItemImg = (product) => {
  itemImg.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;
};
const fillItemContent = (product) => {
  title.textContent = product.name;
  price.textContent = product.price;
  description.textContent = product.description;
  let productColors = product.colors;
  productColors.forEach((color) => {
    colors.innerHTML += `<option class="test" value="${color}">${color}</option>`;
  });
};

retrieveProductsData();