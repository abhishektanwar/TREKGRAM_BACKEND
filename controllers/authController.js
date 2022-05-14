const asyncHandler = require('express-async-handler')
const router = require("express").Router();
const brcypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require('jsonwebtoken')

const register = asyncHandler(async (req,res)=>{
  // try{
  //   // generated hashed password
  //   const salt = await brcyp.genSalt(10);
  //   const hashedPassword = await brcyp.hash(req.body.password, salt)
    
  //   // create new user
  //   const newUser = new User({
  //     username:req.body.username,
  //     email:req.body.email,
  //     password:hashedPassword,
  //   })

  //   // save user and return response
  //   const user = await newUser.save();
  //   res.status(200).json({...user._doc,token:generateToken(user.id)});
  // }
  // catch(err){
  //   console.log("err",err)
  //   res.status(500).json(err)
  // }
  try{
    // check if user exists
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User with this email already exists");
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
          username:req.body.username,
          email:req.body.email,
          password:hashedPassword,
        })
    const user = await newUser.save();
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        success:true
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
  catch(err){
    res.status(500)
    throw new Error(err)
  }
});

const login = asyncHandler(async (req,res)=>{
  // try{
  //   const user = await User.findOne({email:req.body.email})
  //   !user && res.status(404).send("user not found")

  //   const validPassword = await brcyp.compare(req.body.password,user.password)
  //   !validPassword && res.status(400).send("wrong password")

  //   res.status(200).json(user)
  // }
  // catch(err){
  //   console.log("err",err)
  // }
  const { email, password } = req.body;
  // check for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      success:true
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// takes userId : generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


module.exports = {
  register,
  login
}