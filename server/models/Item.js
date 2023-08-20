const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  ingredients: {
    type: [String],
    default: [],
  },
  size: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
    default: "",
  },
});

module.exports = mongoose.model("Item", ItemSchema);
