"use strict";

/**
 * offer router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::offer.offer", {
  config: {
    // Nous ajoutons une configuration à une de nos routes
    delete: {
      policies: ["api::offer.is-authorized"], // Nous ajoutons la policy is-authorized à la route
    },
    update: {
      policies: ["api::offer.is-authorized"], // Nous ajoutons la policy is-authorized à la route
    },
    create: {
      policies: ["api::offer.is-authorized"], // Nous ajoutons la policy is-authorized à la route
    },
  },
});
