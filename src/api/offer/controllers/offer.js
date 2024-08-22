"use strict";

/**
 * offer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

module.exports = createCoreController("api::offer.offer", ({ strapi }) => ({
  async deleteAll(ctx) {
    try {
      // Récupérer l'id de l'utilisateur
      const userId = ctx.state.user.id;

      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        { populate: ["offers"] }
      );

      for (let i = 0; i < user.offers.length; i++) {
        await strapi.entityService.delete(
          "api::offer.offer",
          user.offers[i].id
        );
      }

      return "Offres correctement supprimées";
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },

  async buy(ctx) {
    try {
      const { status } = await stripe.charges.create({
        // destructuring de la clé status de la réponse de stripe
        amount: ctx.request.body.amount * 100, // prix en centimes
        currency: "eur", // devise
        description: `Paiement image : ${ctx.request.body.title}`, // identification de la commande
        source: ctx.request.body.token, // le token de stripe
      });

      return { status };
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
}));
