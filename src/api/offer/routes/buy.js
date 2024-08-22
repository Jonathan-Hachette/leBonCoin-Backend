module.exports = {
  routes: [
    {
      method: "POST", // méthode de la route
      path: "/offers/buy", // chemin de la route (le /api est implicite)
      handler: "offer.buy", // lien vers le controller lié à la route (pas encore créé)
    },
  ],
};
