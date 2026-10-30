const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
} = require("../controller/ticket.controller");
const protect = require("../middleware/auth.middleware");

router.use(protect);

router.post("/ticket", createTicket);
router.get("/tickets", getTickets);
router.get("/ticket/:id", getTicket);
router.put("/ticket/:id", updateTicket);
router.delete("/ticket/:id", deleteTicket);

module.exports = router;
