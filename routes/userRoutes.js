const express = require("express");
const { registerUser, loginUser, logoutUser, enrollCourse, withdrawCourse, addCourseToUser, updateUserProfile, getAllUser } = require("../controllers/userController");

const userRouter = express.Router();

// Routes for user registration, login, and logout
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

// Routes for enrolling and withdrawing from courses
userRouter.post("/enroll-course", enrollCourse);
userRouter.post("/withdraw-course", withdrawCourse);

// Route for adding a course to a user's profile
userRouter.put("/add-course/:userId", addCourseToUser);

// Route for updating user profile
userRouter.put("/profile/:userId", updateUserProfile);
userRouter.get("/admin/all-user", getAllUser);


module.exports = userRouter;
