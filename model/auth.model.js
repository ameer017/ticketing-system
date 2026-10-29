const mongoose = require("mongoose");
const schema = mongoose.Schema;

const authSchema = new schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

const User = mongoose.model("User", authSchema);
module.exports = User;
