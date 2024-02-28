const express = require("express");
const router = express.Router();
const { createLecture, getAllLectures, getLectureById, deleteLecture, updateLecture } = require("../controllers/lectureController");
const isAdmin = require("../middleware/isAdmin");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/fileUploadMulter");

// Adjusted route to include necessary middleware for authentication, authorization, and file upload
router.post("/create/:courseId", authMiddleware, isAdmin, upload.single("video"), createLecture);
router.get("/", getAllLectures);
router.put("/update/:lectureId", updateLecture);
router.get("/:lectureId", getLectureById);
router.delete("/delete/:lectureId", deleteLecture);


module.exports = router;
