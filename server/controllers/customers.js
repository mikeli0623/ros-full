const Customer = require("../models/Customer");

module.exports = {
  getCustomers: async (req, res, next) => {
    try {
      const { restId, ...others } = req.query;
      const customers = await Customer.find({
        ...others,
        restaurantId: restId,
      });
      res.status(200).json(customers);
    } catch (err) {
      next(err);
    }
  },
  createCustomer: async (req, res, next) => {
    const customer = new Customer({
      name: req.body.name,
      table: req.body.table,
      restaurantId: req.body.restaurantId,
    });

    try {
      const newCustomer = await customer.save();
      res.json(newCustomer);
    } catch (err) {
      next(err);
    }
  },
  findCustomer: async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.customerId);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  },
  deleteCustomer: async (req, res) => {
    try {
      const customer = await Customer.deleteOne({ _id: req.params.customerId });
      res.json(customer);
    } catch (err) {
      res.json({ message: err });
    }
  },
  updateCustomer: async (req, res) => {
    try {
      const customer = await Customer.findByIdAndUpdate(
        req.params.customerId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(customer);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },
};
