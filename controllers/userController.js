const Course = require("../models/course");
const User = require("../models/userModel");
const generateJwtToken = require("../utils/generateJwtToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists. Please login.",
        success: false,
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      isAdmin,
    });

    // return res.status(201).json({
    //   message: "User registered successfully",
    //   success: true,
    //   newUser
    // });
    return res.send(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        courses: user.courses,
        currentVideo: user.currentVideo,
        watchedVideos: user.watchedVideos,
        token: generateJwtToken(user._id, user.isAdmin),
      });
    } else {
      res.status(404).json({
        message: "Email and password are incorrect",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the JWT token from the client-side (e.g., remove from local storage or cookies)
    // For example, if you're using local storage:
    localStorage.removeItem("token");

    // Optionally, you can also invalidate the token on the server-side
    // This might involve maintaining a list of blacklisted tokens or implementing token revocation
    // For simplicity, we won't implement server-side token invalidation in this example

    res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if the user is already enrolled in the course
    if (user.courses.includes(courseId)) {
      return res.status(400).json({
        message: "User is already enrolled in this course",
        success: false,
      });
    }

    // Add the courseId to the user's courses array
    user.courses.push(courseId);
    await user.save();

    res.status(200).json({
      message: "User enrolled in the course successfully",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const withdrawCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if the user is enrolled in the course
    if (!user.courses.includes(courseId)) {
      return res.status(400).json({
        message: "User is not enrolled in this course",
        success: false,
      });
    }

    // Remove the courseId from the user's courses array
    user.courses = user.courses.filter((course) => course !== courseId);
    await user.save();

    res.status(200).json({
      message: "User withdrew from the course successfully",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const addCourseToUser = async (req, res) => {
  const { userId } = req.params;
  const { courseId } = req.body;

  if (!userId || !courseId) {
    return res
      .status(400)
      .json({ message: "Both userId and courseId are required" });
  }

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already enrolled in the course
    if (user.courses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in this course" });
    }

    // Add the courseId to the user's courses array
    user.courses.push(courseId);
    course.user.push(userId);
    await course.save();
    await user.save();

    // res.status(200).json({ message: "Course added to user successfully" });
    res.send(courseId);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// const updateUserProfile = async (req, res) => {
//   const { userId } = req.params;
//   const { name, email, currentVideo, watchedVideos } = req.body;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found", success: false });
//     }

//     // Update user's name and email
//     user.name = name || user.name;
//     user.email = email || user.email;

//     // Update user's current video if provided
//     if (currentVideo) {
//       user.currentVideo = currentVideo;
//     }

//     // Mark videos as watched if provided
//     if (watchedVideos && Array.isArray(watchedVideos)) {
//       watchedVideos.forEach((video) => {
//         user.markVideoAsWatched(video);
//       });
//     }

//     await user.save();

//     // res.status(200).json({ message: "User profile updated successfully", success: true });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error", error: error.message, success: false });
//   }
// };

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, email, currentVideo, watchedVideos } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Update user's name and email
    user.name = name || user.name;
    user.email = email || user.email;

    // Update user's current video if provided
    if (currentVideo) {
      user.currentVideo = currentVideo;
    } else {
      // If currentVideo is not provided, set it to the last pushed video
      if (
        watchedVideos &&
        Array.isArray(watchedVideos) &&
        watchedVideos.length > 0
      ) {
        user.currentVideo = watchedVideos[watchedVideos.length - 1];
      }
    }

    // Push new video ID into watchedVideos array
    if (watchedVideos && Array.isArray(watchedVideos)) {
      watchedVideos.forEach((videoId) => {
        if (!user.watchedVideos.includes(videoId)) {
          user.watchedVideos.push(videoId);
        }
      });
    }

    await user.save();

    // res.status(200).json({ message: "User profile updated successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        success: false,
      });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  enrollCourse,
  withdrawCourse,
  addCourseToUser,
  updateUserProfile,
  getAllUser
};
