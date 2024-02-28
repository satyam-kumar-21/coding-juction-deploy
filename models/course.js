const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  discountedPrice: {
    type: Number,
    default: 0,
  },
  startdate: {
    type: Date,
    default: Date.now(),
  },
  enddate: {
    type: Date,
    default: "",
  },
  duration: {
    type: String,
    default: "",
  },

  instructor: [
    {
      name: {
        type: String,
        // required: true
      },
      bio: {
        type: String,
        // required: true
      },
      // image: {
      //     type: String,
      //     required: true
      // }
    },
  ],
  technologies: {
    type: [String],
  },
  whatYouWillLearn: {
    type: [String],
  },
  syllabus: [
    {
      id: {
        type: Number,
        // required: true
      },
      title: {
        type: String,
        // required: true
      },
      topics: {
        type: [String], // Array of strings
        // required: true
      },
    },
  ],
  curriculum: [
    {
      id: {
        type: Number,
        // required: true
      },
      title: {
        type: String,
        // required: true
      },
      isLocked: {
        type: Boolean,
        // required: true
      },
    },
  ],
  qa: [
    {
      id: {
        type: Number,
        // required: true
      },
      question: {
        type: String,
        // required: true
      },
      answer: {
        type: String,
        // required: true
      },
    },
  ],
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  // Add other course details as needed
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
