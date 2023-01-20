//Récupération de la chaîne de requête dans l'URL et Extraction de l'orderId (numéro de commande) de l'URL
const urlOrderId = new URLSearchParams(window.location.search).get("orderId");

//S'il n'y a pas d'orderId dans l'URL alors on redirige sur la page d'accueil du site
if (urlOrderId === null || urlOrderId === "") {
  alert(
    "Une erreur s'est produite lors de la validation de votre commande. Veuillez nous en excuser !"
  );
  window.location.href = "index.html";
}
//Sinon, on affiche la confirmation de la commande et le numéro de commande
else {
  // Sélection de l'élément html dans lequel on veut afficher le numéro de commande
  const idCommande = document.getElementById("orderId");
  // On insère le numéro de commande dans le html
  idCommande.innerText = urlOrderId;
  localStorage.removeItem("Panier");
}

















