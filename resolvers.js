const { AuthenticationError, PubSub } = require("apollo-server");
const Pin = require("./models/Pin");

const pubsub = new PubSub();
const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("User not logged in");
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx, info) => ctx.currentUser),

    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate("author")
        .populate("comments.author");

      return pins;
    }
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({ ...args.input, author: ctx.currentUser._id }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      /* Publish to pubsub */
      pubsub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),

    deletePin: authenticated(async (root, args, ctx) => {
      const deletedPin = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      /* Publish to pubsub */
      pubsub.publish(PIN_DELETED, { deletedPin });
      return deletedPin;
    }),

    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate("author")
        .populate("comments.author");

      /* Publish to pubsub */
      pubsub.publish(PIN_UPDATED, { pinUpdated });

      return pinUpdated;
    })
  },
  /* SUBSCRIPTIONS */
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED)
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED)
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED)
    }
  }
};
