const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    currentVideo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      default: null,
    },
    watchedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.markVideoAsWatched = async function (lectureId) {
  const videoIndex = this.watchedVideos.findIndex(
    (video) => video.lecture.toString() === lectureId.toString()
  );
  if (videoIndex === -1) {
    this.watchedVideos.push({ lecture: lectureId, watchedAt: Date.now() });
  } else {
    this.watchedVideos[videoIndex].watchedAt = Date.now();
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
