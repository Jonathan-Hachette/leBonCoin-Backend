"use strict";

/**
 * offer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::offer.offer", ({ strapi }) => ({
  async deleteAll(ctx) {
    try {
      // Récupérer l'id de l'utilisateur
      const userId = ctx.state.user.id; // 1

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
      // console.log(user.offers); // Afficher un tableau contenant les offres sous forme d'objet

      return "Offres correctement supprimés";
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
}));
