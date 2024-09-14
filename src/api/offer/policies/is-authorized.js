module.exports = async (policyContext, config, { strapi }) => {
  const requesterId = policyContext.state.user.id;
  const offerId = policyContext.request.params.id;
  const offer = await strapi.entityService.findOne(
    "api::offer.offer",
    offerId,
    { populate: ["owner"] }
  );
  console.log(requesterId);
  if (offer.owner.id === requesterId) {
    return true;
  } else {
    // console.log("tom");
    return false;
  }
};
