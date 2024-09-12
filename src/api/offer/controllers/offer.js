"use strict";

/**
 * offer controller
 */

const stripe = require("stripe")(process.env.STRIPE_API_SECRET);

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::offer.offer", ({ strapi }) => ({
  async create(ctx) {
    try {
      if (!ctx.request.files["files.pictures"]) {
        ctx.response.status = 400;
        return { message: "Send at least one picture" };
      }
      const requesterId = ctx.state.user.id;
      //   const ownerId = ctx.request.body.data.owner
      //   console.log(ctx.request.body);
      const body = JSON.parse(ctx.request.body.data);
      // console.log(typeof ctx.request);
      const ownerId = body.owner;
      console.log("OwnerId >>>", ownerId);
      if (requesterId !== ownerId) {
        ctx.response.status = 403;
        return { message: "An offer you post must be yours" };
      }
      const { data, meta } = await super.create(ctx);
      return { data, meta };
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
  async deleteAll(ctx) {
    try {
      const requesterId = ctx.state.user.id;
      const requester = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        requesterId,
        { populate: ["offers"] }
      );
      const requesterOffers = requester.offers;
      for (let i = 0; i < requesterOffers.length; i++) {
        const offer = requesterOffers[i];
        await strapi.entityService.delete("api::offer.offer", offer.id);
      }
      return { message: "All offers deleted" };
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },

  buy: async (ctx) => {
    const { request } = ctx;
    try {
      let { status } = await stripe.charges.create({
        amount: (request.body.amount * 100).toFixed(0),
        currency: "eur",
        description: `Paiement le bon coin pour : ${request.body.title}`,
        source: request.body.token,
      });
      ctx.response.status = 201;

      return { status: status };
    } catch (error) {
      ctx.response.status = 500;
      return { error: error };
    }
  },

  //   Cette custom route ne fait pas partie de la correction, elle permet de nettoyer la BDD en supprimant tous les utilisateurs et toutes les offres.
  async reset(ctx) {
    try {
      const users = await strapi.entityService.findMany(
        "plugin::users-permissions.user"
      );
      const promiseArray = [];
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (Number(user.id) > 23) {
          promiseArray.push(
            strapi.entityService.delete(
              "plugin::users-permissions.user",
              user.id
            )
          );
        }
      }
      await Promise.all(promiseArray);

      const offers = await strapi.entityService.findMany("api::offer.offer");
      const promiseArray2 = [];
      for (let i = 0; i < offers.length; i++) {
        const offer = offers[i];
        if (Number(offer.id) > 30) {
          promiseArray2.push(
            strapi.entityService.delete("api::offer.offer", offer.id)
          );
        }
      }
      await Promise.all(promiseArray);
      return { message: "All users and offers deleted" };
    } catch (error) {
      ctx.response.status = 500;
      return { message: error.message };
    }
  },
}));
