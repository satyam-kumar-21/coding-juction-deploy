const RAZORPAY_API_BASE_URL = "https://api.razorpay.com/v1";
const RAZORPAY_API_KEY = process.env.RAZORPAY_API_KEY;
const RAZORPAY_PASSWORD = process.env.RAZORPAY_API_SECRET;
const axios = require("axios");

const getOrderDetails = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const response = await axios.get(`${RAZORPAY_API_BASE_URL}/orders`, {
      auth: {
        username: RAZORPAY_API_KEY,
        password: RAZORPAY_PASSWORD,
      },
      params: {
        count: limit,
        skip: (page - 1) * limit,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { getOrderDetails };
