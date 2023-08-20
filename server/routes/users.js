const express = require("express");
const router = express.Router();
const {
  deleteUser,
  updateUser,
  getUser,
  getUsers,
} = require("../controllers/user");
const { verifyAdmin } = require("../utils/verifyToken");

router.put("/:id", verifyAdmin, updateUser);

router.delete("/:id", verifyAdmin, deleteUser);

router.get("/find/:id", verifyAdmin, getUser);

router.get("/", verifyAdmin, getUsers);

module.exports = router;
