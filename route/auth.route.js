const express = require("express");
const router = express.Router();
const {
  CreateUser,
  LoginUser,
  LogOutUser,
  GetUsers,
  GetUser,
} = require("../controller/auth.controller");

router.post("/register", CreateUser);
router.post("/login", LoginUser);
router.post("/logout", LogOutUser);
router.get("/users", GetUsers);
router.get("/user/:id", GetUser);

module.exports = router;
