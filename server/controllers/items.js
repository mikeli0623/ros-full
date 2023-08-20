const Item = require("../models/Item");

module.exports = {
  getItems: async (req, res) => {
    try {
      const items = await Item.find({
        restaurantId: req.query.restId,
      });
      res.json(items);
    } catch (err) {
      res.json({ message: err });
    }
  },
  getItemByName: async (req, res) => {
    try {
      const item = await Item.findOne({ name: req.params.itemName });
      res.json(item);
    } catch (err) {
      res.json({ message: err });
    }
  },
  createItem: async (req, res, next) => {
    const item = new Item({
      name: req.body.name,
      cost: req.body.cost,
      ingredients: req.body.ingredients,
      size: req.body.size,
      img: req.body.img,
      restaurantId: req.body.restaurantId,
    });

    try {
      const savedItem = await item.save();
      res.status(200).json(savedItem);
    } catch (err) {
      next(err);
    }
  },
  findItem: async (req, res) => {
    try {
      const item = await Item.findById(req.params.itemId);
      res.json(item);
    } catch (err) {
      res.json({ message: err });
    }
  },
  deleteItem: async (req, res) => {
    try {
      const item = await Item.deleteOne({ _id: req.params.itemId });
      res.json(item);
    } catch (err) {
      res.json({ message: err });
    }
  },
  updateItem: async (req, res, next) => {
    try {
      const item = await Item.findByIdAndUpdate(
        req.params.itemId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  },
};
