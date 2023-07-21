const express = require('express');
const app = express();
const path = require("path")
const port = process.env.Port || 5000;
require("./src/db/conn")
const hbs = require("hbs")
const Register = require('./src/models/register')

const static_Path = path.join(__dirname,"./public")
const template_Path = path.join(__dirname,"./templates/views")
const partials_Path = path.join(__dirname,"./templates/partials")

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(static_Path));
app.set("view engine","hbs");
app.set("views",template_Path);
hbs.registerPartials(partials_Path);

app.get(('/'),(req,res)=>{
    res.render("index")
})

app.get(('/register'),(req,res)=>{
    res.render("register")
})

app.post(('/register'), async(req,res)=>{
    
    try{
       
        const password = req.body.password;
        const confirmpassword =req.body.confirmpassword;

        if (password === confirmpassword){

            const registerStudents = new Register({
                fullname : req.body.fullname,
                email:req.body.email,
                phoneno:req.body.phoneno,
                age:req.body.age,
                password:password,
                confirmpassword:confirmpassword
            })

            const registered = await registerStudents.save()
            res.status(201).render("index")
        }
        else{
            res.send("password not match")
        }
    }catch(e){

            res.send(e)
    }

})

app.get(('/login'),(req,res)=>{
    res.render("login")
})

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});