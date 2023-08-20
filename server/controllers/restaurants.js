const Restaurant = require("../models/Restaurant");

module.exports = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.find();
      res.json(restaurants);
    } catch (err) {
      res.json({ message: err });
    }
  },
  createRestaurant: async (req, res) => {
    const restaurant = new Restaurant({
      name: req.body.name,
      owner: req.body.owner,
      about: req.body.about,
      location: req.body.location,
      email: req.body.email,
      phone: req.body.phone,
    });

    try {
      const savedRestaurant = await restaurant.save();
      res.json(savedRestaurant);
    } catch (err) {
      res.json({ message: err });
    }
  },
  findRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.restaurantId);
      res.json(restaurant);
    } catch (err) {
      res.json({ message: err });
    }
  },
  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.deleteOne({
        _id: req.params.restaurantId,
      });
      res.json(restaurant);
    } catch (err) {
      res.json({ message: err });
    }
  },
  updateRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByIdAndUpdate(
        req.params.restaurantId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(restaurant);
    } catch (err) {
      next(err);
    }
  },
};
