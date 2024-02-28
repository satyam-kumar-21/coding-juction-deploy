const express = require("express");
const { getOrderDetails } = require("../controllers/orderController");

const orderRoutes = express.Router();

orderRoutes.get('/', getOrderDetails)

module.exports = orderRoutes