const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  table: {
    type: Number,
    required: true,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
    default: null,
  },
  createdAt: {
    type: Date,
    expires: "3h",
    index: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customer", CustomerSchema);
