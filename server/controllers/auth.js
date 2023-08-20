const User = require("../models/User");
const bcrypt = require("bcrypt");
const createError = require("../utils/error");
const jwt = require("jsonwebtoken");
require("dotenv/config");

module.exports = {
  register: async (req, res, next) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        restaurantId: req.body.restaurantId,
        isAdmin: req.body.isAdmin,
      });
      await newUser.save();
      res.status(201).send("User has been created");
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return next(createError(404, "User not found!"));

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return next(createError(400, "Wrong password or username!"));

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT
      );

      const { password, isAdmin, ...otherDetails } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res) => {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out.");
  },
};
