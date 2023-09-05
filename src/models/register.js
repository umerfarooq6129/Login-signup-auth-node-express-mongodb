const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {jwt} = require("jsonwebtoken")

const registerStudent = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneno:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

registerStudent.methods.generateAuthToken = async function (){
    try{
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(err){
        res.send(err);
    }
}

// middleware
registerStudent.pre("save", async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`${this.password}`);
        
        this.confirmpassword = undefined;
    }
    next();
    
})

const Register = new mongoose.model("Register",registerStudent);

module.exports = Register;