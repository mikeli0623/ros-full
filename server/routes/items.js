const express = require("express");
const router = express.Router();
const {
  getItems,
  getItemByName,
  createItem,
  findItem,
  deleteItem,
  updateItem,
} = require("../controllers/items");
const { verifyAdmin } = require("../utils/verifyToken");

// get all items
router.get("/", getItems);

// get item id from name
// make sure item name is encoded properly, ie. using encodeURI()
router.get("/byName/:itemName", getItemByName);

// submit item
router.post("/", verifyAdmin, createItem);

// find specific item
router.get("/:itemId", findItem);

// delete item
router.delete("/:itemId", verifyAdmin, deleteItem);

// update item
router.patch("/:itemId", verifyAdmin, updateItem);

module.exports = router;
