const mongoose = require("mongoose");
const schema = mongoose.Schema;

const authSchema = new schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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

authSchema.index({ email: 1 }, { unique: true });
authSchema.index({ userName: 1 }, { unique: true });

const User = mongoose.model("User", authSchema);
module.exports = User;
