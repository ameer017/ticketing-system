const asyncHandler = require("express-async-handler");
const User = require("../model/auth.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../util/index.util");

exports.CreateUser = asynHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  if (!firstName || !lastName || !userName || !email || !password) {
    res.status(400);
    throw new Error("All fields are required, please try again!");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstName,
    lastName,
    userName,
    email,
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

  const user = User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found!");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      token,
    });
  }
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

exports.GetUser = asynHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
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

exports.GetUsers = asynHandler(async (req, res) => {
  const users = await User.find();
  if (!users) {
    res.status(400);
    throw new Error("Users not found!");
  }
  if (users) {
    res.status(200).json(users);
  }
});
