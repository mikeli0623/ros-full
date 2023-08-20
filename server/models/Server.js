const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ServerSchema = Schema({
  name: { type: String, required: true, unique: true },
  restaurantId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
    default: null,
  },
});

module.exports = mongoose.model("Server", ServerSchema);
