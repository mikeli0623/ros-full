const express = require("express");
const router = express.Router();
const {
  getServers,
  createServer,
  findServer,
  deleteServer,
  updateServer,
} = require("../controllers/servers");

// get all servers
router.get("/", getServers);

// create server
router.post("/", createServer);

// find specific server
router.get("/:customerId", findServer);

// delete server
router.delete("/:customerId", deleteServer);

// update server
router.put("/:customerId", updateServer);

module.exports = router;
