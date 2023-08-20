const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  items: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Item",
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
    default: "",
  },
});

module.exports = mongoose.model("Category", CategorySchema);
