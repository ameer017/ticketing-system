const express = require("express");
const router = express.Router();
const {
  CreateUser,
  LoginUser,
  LogOutUser,
  GetUsers,
  GetUser,
} = require("../controller/auth.controller");
const protect = require("../middleware/auth.middleware");
const rateLimiter = require("../middleware/rateLimiter.middleware");

router.post("/register", rateLimiter, CreateUser);
router.post("/login", rateLimiter, LoginUser);
router.post("/logout", LogOutUser);
router.get("/users", protect, GetUsers);
router.get("/user/:id", protect, GetUser);

module.exports = router;
