const express = require('express');
const app = express();
const path = require("path")
const port = process.env.Port || 5000;
const auth = require("./src/middleware/auth")
require("./src/db/conn")
const hbs = require("hbs")
const Register = require('./src/models/register')
const bcrypt = require("bcryptjs");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const {jwt} = require("jsonwebtoken")

const static_Path = path.join(__dirname, "./public")
const template_Path = path.join(__dirname, "./templates/views")
const partials_Path = path.join(__dirname, "./templates/partials")

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(static_Path));
app.set("view engine", "hbs");
app.set("views", template_Path);
hbs.registerPartials(partials_Path);

app.get(('/'), (req, res) => {
    res.render("index")
})

app.get('/category',auth,(req,res)=>{
    console.log(`this is token oky ${req.cookies.jwt}`)
    res.render("category")
})

app.get(('/register'), (req, res) => {
    res.render("register")
})

app.post(('/register'), async (req, res) => {

    try {

        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if (password === confirmpassword) {

            const registerStudents = new Register({
                fullname: req.body.fullname,
                email: req.body.email,
                phoneno: req.body.phoneno,
                age: req.body.age,
                password: password,
                confirmpassword: confirmpassword
            })

            const token = await registerStudents.generateAuthToken();
            console.log('this is token new ' + token);

            res.cookie('jwt', token, {
                expire: new Date(Date.now() + 600000),
                httpOnly: true
            });
            console.log(cookie);

            const registered = await registerStudents.save()
            console.log(registered);
            res.status(201).render("index")
        }
        else {
            res.send("password not match")
        }
    } catch (e) {

        res.send(e)
    }

})

app.get(('/login'), (req, res) => {
    res.render("login")
})

app.post(('/login'), async (req, res) => {
    try {
        const email = req.body.email;
        const passwrod = req.body.password;

        const useremail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(passwrod, useremail.password);

        const token = await registerStudents.generateAuthToken();
        console.log('this is token login ' + token);


        res.cookie("jwt", token, {
            expire: new Date(Date.now() + 600000),
            httpOnly: true,
            // secure: true
        });
        console.log(cookie); 

        if (isMatch) {
            res.status(201).render("index")
        } else {
            res.send("Wrong password try again")
        }

    } catch (error) {
        res.send(error)
    }
})


// const logout = async (req, res, next) => {
//     try {

//         res.cookie("token", null, {
//             expires: new Date(Date.now()),
//             httpOnly: true
//         });

//         res.redirect("/register");

//     } catch (error) {
//         next(error);
//     }
// };

app.get('/logout',auth, async(req,res) => {
    try{
        console.log(req.user);

        req.user.tokens = req.user.tokens.filter((currElement)=>{
            return currElement.token !== req.token;
        })

        // from all devices logout
        // req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("logout successful");

        await req.user.save();
        res.render("login");

    }catch(e) {
        res.send(e);
    }
});





app.listen(port, () => {
    console.log(`Server started on ${port}`);
});