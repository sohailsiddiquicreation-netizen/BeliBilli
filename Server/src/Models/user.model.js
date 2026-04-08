const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    address: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    
  },
  {
    timestamps: true,
  },
);
const Usermodel = mongoose.model("User", userSchema);
module.exports = Usermodel;
