const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ticketSchema = new schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "closed"],
      default: "open",
      index: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ assignedUser: 1, status: 1 });

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
