const Server = require("../models/Server");

module.exports = {
  getServers: async (req, res) => {
    try {
      const servers = await Server.find({
        restaurantId: req.query.restId,
      });
      res.json(servers);
    } catch (err) {
      res.json({ message: err });
    }
  },
  createServer: async (req, res) => {
    const server = new Server({
      name: req.body.name,
      ServerId: req.body.ServerId,
    });

    try {
      const newServer = await server.save();
      res.json(newServer);
    } catch (err) {
      res.json({ message: err });
    }
  },
  findServer: async (req, res) => {
    try {
      const server = await Server.findById(req.params.customerId);
      res.json(server);
    } catch (err) {
      res.json({ message: err });
    }
  },
  deleteServer: async (req, res) => {
    try {
      const server = await Server.deleteOne({ _id: req.params.customerId });
      res.json(server);
    } catch (err) {
      res.json({ message: err });
    }
  },
  updateServer: async (req, res) => {
    try {
      const server = await Server.updateOne(
        { _id: req.params.customerId },
        { $set: { name: req.body.name, table: req.body.table } }
      );
      res.json(server);
    } catch (err) {
      res.json({ message: err });
    }
  },
};
