const User = require("../models/User");

module.exports = {
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const { restId, ...others } = req.query;
      const user = await User.find({
        ...others,
        restaurantId: restId,
      });
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
};
