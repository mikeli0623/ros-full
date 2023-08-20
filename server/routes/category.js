const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  findCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");
const { verifyAdmin } = require("../utils/verifyToken");

// get all items
router.get("/", getCategories);

// submit category
router.post("/", verifyAdmin, createCategory);

// find specific item
router.get("/:categoryId", findCategory);

// delete item
router.delete("/:categoryId", verifyAdmin, deleteCategory);

router.patch("/:categoryId", verifyAdmin, updateCategory);

module.exports = router;
