const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ticketSchema = new schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
