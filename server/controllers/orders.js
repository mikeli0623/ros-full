const Order = require("../models/Order");

module.exports = {
  getOrders: async (req, res, next) => {
    try {
      const { restId, ...others } = req.query;
      const orders = await Order.find({
        ...others,
        restaurantId: restId,
      });
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  },
  createOrder: async (req, res, next) => {
    const order = new Order({
      restaurantId: req.body.restaurantId,
      totalCost: req.body.totalCost,
      totalItems: req.body.totalItems,
      items: req.body.items,
      customerId: req.body.customerId,
    });

    try {
      const savedOrder = await order.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      next(err);
    }
  },
  findOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);
      res.json(order);
    } catch (err) {
      res.json({ message: err });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const order = await Order.deleteOne({ _id: req.params.orderId });
      res.json(order);
    } catch (err) {
      res.json({ message: err });
    }
  },
  updateOrder: async (req, res, next) => {
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.orderId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  },
};
