const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

mongoose.connection.on("disconnected", () => {
  console.log("disconnected from DB");
});

mongoose.connection.on("connected", () => {
  console.log("connected to DB");
});

// import routes
const userRoute = require("./routes/users");
app.use("/api/users", userRoute);

const ordersRoute = require("./routes/orders");
app.use("/api/orders", ordersRoute);

const itemsRoute = require("./routes/items");
app.use("/api/items", itemsRoute);

const categoryRoute = require("./routes/category");
app.use("/api/category", categoryRoute);

const customersRoute = require("./routes/customers");
app.use("/api/customers", customersRoute);

const serversRoute = require("./routes/servers");
app.use("/api/servers", serversRoute);

const restuarantsRoute = require("./routes/restaurants");
app.use("/api/restaurants", restuarantsRoute);

const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Connected to database");
  } catch (error) {
    throw error;
  }
};

app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8080, () => {
  console.log("Connected to backend");
  connect();
});
