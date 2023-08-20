const express = require("express");
const router = express.Router();
const {
  getOrders,
  createOrder,
  findOrder,
  deleteOrder,
  updateOrder,
} = require("../controllers/orders");
const { verifyUser } = require("../utils/verifyToken");

// get all orders
router.get("/", getOrders);

// submit order
router.post("/", createOrder);

// find specific order
router.get("/:orderId", findOrder);

// delete post
router.delete("/:orderId", verifyUser, deleteOrder);

// update post
router.patch("/:orderId", verifyUser, updateOrder);

module.exports = router;
