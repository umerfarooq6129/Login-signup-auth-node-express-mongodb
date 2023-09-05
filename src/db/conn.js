const mongoose = require("mongoose");
require("dotenv").config();

const db = mongoose.connect(process.env.DATABASE_DB).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("no connection");
})

module.exports = db;