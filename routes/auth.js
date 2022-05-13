const router = require("express").Router();
const User = require("../models/User");
const brcyp = require("bcrypt");

// REGISTER
router.post("/register",async (req,res)=>{
  try{
    // generated hashed password
    const salt = await brcyp.genSalt(10);
    const hashedPassword = await brcyp.hash(req.body.password, salt)
    
    // create new user
    const newUser = new User({
      username:req.body.username,
      email:req.body.email,
      password:hashedPassword,
    })

    // save user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  }
  catch(err){
    console.log("err",err)
    res.status(500).json(err)
  }
})

// LOGIN
router.post('/login', async (req,res)=>{
  try{
    const user = await User.findOne({email:req.body.email})
    !user && res.status(404).send("user not found")

    const validPassword = await brcyp.compare(req.body.password,user.password)
    !validPassword && res.status(400).send("wrong password")

    res.status(200).json(user)
  }
  catch(err){
    console.log("err",err)
  }
})


module.exports = router