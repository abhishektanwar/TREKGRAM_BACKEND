const express = require('express')

const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')

// routes
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
dotenv.config();

// making conntection to mongo db
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},()=>{
  console.log("CONNTECTED TO MONGO DB")
})

// middlewares
app.use(express.json()) // body parser for API requests 
app.use(helmet())
app.use(morgan("common"))

app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);

app.listen(8800,()=>{
  console.log("backend server is running")
})

