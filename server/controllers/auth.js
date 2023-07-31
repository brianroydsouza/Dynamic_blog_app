import { model } from 'mongoose';
import UserSchema from '../model/User.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req, res) => {
  const {
    username,
    Role = 'Client',
    email,
    password,
  } = req.body;
 
  try {
    const existingUser = await UserSchema.findOne({
      Email: email,
    });
    if (existingUser) {
      return res.status(400).json("user already exists" );
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserSchema.create({
      UserName: username,
      Role: Role,
      Email: email,
      Password: hashedPassword,
    });
    const token = jwt.sign(
      { Email: newUser.Email, id: newUser._id },
      process.env.SECRET_KEY
    );
    const AllUsers = await UserSchema.find({});
    res.status(201).json({ user: AllUsers, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json( "something went wrong");
  }
};

export const login = async(req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await UserSchema.findOne({
      UserName: username,
    });
    if (!existingUser) {
      return res.status(404).json("User not found");
    }
    const matchPassword = await bcrypt.compare(
      password,
      existingUser.Password
    );
    if (!matchPassword) {
      return res.status(400).json("Invalid credentails");
    }

    const token = jwt.sign(
      { UserName: existingUser.UserName, id: existingUser._id },
      process.env.SECRET_KEY
    );
    res
      .status(200)
      .json({user: existingUser, token:token});
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token",{
    sameSite:"none",
    secure:true
  }).status(200).json("User has been logged out.")
};
