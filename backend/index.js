const express=require('express');
const app=express();
require('dotenv').config()
const port=process.env.PORT;
const recipeRoutes=require('./routes/routes.recipe');


const cors = require('cors')
app.use(cors(
    // { 
    //    origin : "https://client-git-main-67b8s-projects.vercel.app",
    //     methods: ["POST","GET"],
    //     credentials:true
    // }
))
app.use(recipeRoutes)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow these HTTP methods
    next();
  });
app.listen(port)



const uri = process.env.MONGO_URI;
//establishing mongodb connection
const mongoose =require('mongoose');
mongoose.connect(uri).then(()=>{
    console.log("connection successful")
}).catch(()=>{
    console.log("connection unsuccessful")
})

