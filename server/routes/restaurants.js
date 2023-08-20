const express = require("express");
const router = express.Router();
const {
  getRestaurants,
  createRestaurant,
  findRestaurant,
  deleteRestaurant,
  updateRestaurant,
} = require("../controllers/restaurants");

// get all restaurants
router.get("/", getRestaurants);

// submit restaurant
router.post("/", createRestaurant);

// find specific restaurant
router.get("/:restaurantId", findRestaurant);

// delete restaurant
router.delete("/:restaurantId", deleteRestaurant);

// update restaurant
router.patch("/:restaurantId", updateRestaurant);

module.exports = router;
