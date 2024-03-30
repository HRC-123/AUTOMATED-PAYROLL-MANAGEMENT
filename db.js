const mongoose = require("mongoose");
require("dotenv").config();
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD;

const connectToMongo = () => {
  mongoose
    .connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}%40Hrc@cluster0.9hudxbs.mongodb.net/Employee_DB`
    )
    .then(() => {
      console.log("Successfully Connected");
    })
    .catch((err) => {
      console.log("Error", err);
    });
};

var salarySchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: false,
    },
    year: {
      type: Number,
      required: false,
    },
    totaldays: {
      type: Number,
      required: false,
    },
    paidleaves: {
      type: Number,
      required: false,
    },
    presentdays: {
      type: Number,
      required: false,
    },
    salary: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);

var employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: "This field is required",
  },
  email: {
    type: String,
    required: "This field is required",
    unique: true,
  },
  password: {
    type: String,
    default: "company@123",
    required: "This field is required",
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  netsalary: {
    type: Number,
    required: false,
  },
  grosssalary: {
    type: [salarySchema],
    required: false,
  },
  phonenumber: {
    type: String,
  },
  address: {
    type: "string",
    required: false,
  },
});

var leaveSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  purpose: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("Employee", employeeSchema);
mongoose.model("Leave", leaveSchema);
module.exports = connectToMongo;
