const express = require("express");
const bodyParser = require('body-parser')
const methodOverride = require("method-override");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/crudDB", {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify: false
})
.then(() => console.log("Connected to database"))
.catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(express.static('public'));


app.get("/", async(req, res) => {
    let users = await User.find().sort({date : 1})
    res.render("home", {
        users : users,
    });
});

app.get("/user/new", (req, res) => {
    let user = new User();
    res.render("new", {user});
});

app.get("/user/edit/:id", async(req, res) => {
    let user = await User.findOne({_id : req.params.id});
    // console.log(user);
    res.render("edit", {user});
});

app.post("/user", async(req, res) => {
    try{
        const newUser = new User(req.body);
        const result = await newUser.save();
        res.redirect("/")

    } catch(err){
        console.log(err);
    }
});

app.put("/user/:id", async(req, res) => {
    try{

        await User.findByIdAndUpdate(req.params.id, {
            $set : {
                name : req.body.name,
                email : req.body.email,
                gender : req.body.gender
            }
        });
        res.redirect("/")

    } catch(err){
        console.log(err);
    }
})

app.delete("/user/:id", async(req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/");
    } catch(err){
        console.log(err);
    }
});


app.get("*", (req, res) => {
    res.status(404).render("404_Page");
})

app.listen(3500, () => console.log("Listening to the Port 3500"));