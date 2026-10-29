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
  const ticks = await Ticket.find().sort("-createdAt");

  if (!ticks) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  res.status(200).json(ticks);
});

const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
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
