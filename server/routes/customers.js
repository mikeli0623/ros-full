const express = require("express");
const router = express.Router();
const {
  getCustomers,
  createCustomer,
  findCustomer,
  deleteCustomer,
  updateCustomer,
} = require("../controllers/customers");

// get all customers
router.get("/", getCustomers);

// create customer
router.post("/", createCustomer);

// find specific customer
router.get("/find/:customerId", findCustomer);

// delete customer
router.delete("/:customerId", deleteCustomer);

// update customer
router.put("/:customerId", updateCustomer);

module.exports = router;
