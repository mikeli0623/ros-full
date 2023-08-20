const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
    default: null,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  inProgress: {
    type: Boolean,
    default: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  createdAt: {
    type: Date,
    expires: "3h",
    index: true,
    default: Date.now,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      amount: { type: Number, required: true },
      cost: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Order", OrderSchema);
