const mongoose = require("mongoose");

const db = 'mongodb+srv://login:login123@cluster0.bfqkrok.mongodb.net/login?retryWrites=true&w=majority'

mongoose.connect(db).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("no connection");
})