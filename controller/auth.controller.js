const asyncHandler = require("express-async-handler");
const User = require("../model/auth.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../util/index.util");

exports.CreateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  if (!firstName || !lastName || !userName || !email || !password) {
    res.status(400);
    throw new Error("All fields are required, please try again!");
  }
  const parsedEmail = email.trim().toLowerCase();

  const userExists = await User.findOne({
    $or: [{ email: parsedEmail }, { userName: userName.trim() }],
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    userName: userName.trim(),
    email: parsedEmail,
    password: hashedPassword,
  });

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  const token = generateToken(user._id);
  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }
  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      token,
    });
  }
});

exports.LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required, please try again!");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password!");
  }

  const token = generateToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    token,
  });
});

exports.LogoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "Logout successful!" });
});

exports.GetUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }
  if (user) {
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
    });
  }
});

exports.GetUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const users = await User.find({}, { password: 0 }).skip(skip).limit(limit);
  const total = await User.countDocuments();

  res.status(200).json({
    users,
    page,
    limit,
    total,
  });
});
