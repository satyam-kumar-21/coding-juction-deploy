const express = require("express");
const connectToDb = require("./config/dbConnect");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
const courseRouter = require("./routes/courseRoutes");
const cloudinary = require("cloudinary");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const lectureRoutes = require("./routes/lectureRoutes");

require("dotenv").config();

connectToDb();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/lectures", lectureRoutes);

app.get("/", (req, res) => {
  res.send("Hii satyam");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
