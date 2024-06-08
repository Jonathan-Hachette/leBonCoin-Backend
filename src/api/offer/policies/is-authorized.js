module.exports = async (policyContext, config, { strapi }) => {
  const requestId = policyContext.state.user.id; // Nous récupérons l'id de la personne qui fait la requête
  const offerId = policyContext.request.params.id; // Nous récupérons l'id de l'offre à supprimer dans les params
  const offer = await strapi.entityService.findOne(
    "api::offer.offer",
    offerId,
    {
      populate: ["owner"],
    }
  ); // Nous allons chercher l'offre en questions et nous déployons sa clef owner

  const offerOwnerId = offer.owner.id; // Nous récupérons l'id du propriétaire de l'offre
  if (offerOwnerId !== requestId) {
    // Si l'id de la personne qui fait la requête est différent de l'id du propriétaire, nous renvoyons une erreur
    return false;
  } else {
    // Sinon nous passons au controller de la route
    return true;
  }
};
