const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RestaurantSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    unique: true,
    default: "",
  },
  email: {
    type: String,
    unique: true,
    default: "",
  },
  phone: {
    type: String,
    unique: true,
    default: "",
  },
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
