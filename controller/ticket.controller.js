const asyncHandler = require("express-async-handler");
const Ticket = require("../model/ticket.model");
const User = require("../model/auth.model");

const createTicket = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }
  const ticket = await Ticket.create({
    _id: crypto.randomUUID(),
    title,
    description,
    assignedUser: user._id,
  });
  if (ticket) {
    res.status(201).json(ticket);
  }
});

const getTickets = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    Ticket.find({}, { __v: 0 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("assignedUser", "firstName lastName email userName"),
    Ticket.countDocuments(),
  ]);

  res.status(200).json({
    tickets,
    page,
    limit,
    total,
  });
});

const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate(
    "assignedUser",
    "firstName lastName email userName",
  );

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  res.status(200).json(ticket);
});

const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findByIdAndDelete(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  res.status(200).json(ticket);
});

const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }
  res.status(200).json(ticket);
});

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  deleteTicket,
  updateTicket,
};
