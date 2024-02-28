const Lecture = require("../models/lectureModel");
const Course = require("../models/course");
const cloudinary = require("cloudinary").v2;

const createLecture = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const latestLecture = await Lecture.findOne({ course: courseId }).sort({ lectureNumber: -1 });
    const nextLectureNumber = latestLecture ? latestLecture.lectureNumber + 1 : 1;

    const { title, lectureNumber } = req.body;
    let video;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "course-videos",
      });
      video = result.secure_url;
    }

    const newLecture = new Lecture({
      title,
      lectureNumber : nextLectureNumber,
      video,
      course: courseId,
    });

    // Save the new lecture
    await newLecture.save();

    // Push the new lecture's ID into the course's lectures array
    course.lectures.push(newLecture._id);
    await course.save();


    return res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      newLecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title, lectureNumber } = req.body;

    const lecture = await Lecture.findByIdAndUpdate(
      lectureId,
      { title, lectureNumber },
      { new: true }
    );

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find();

    return res.status(200).json({
      success: true,
      lectures,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

module.exports = {
  createLecture,
  updateLecture,
  getLectureById,
  deleteLecture,
  getAllLectures,
};