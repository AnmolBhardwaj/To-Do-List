const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//models
const TodoTask = require("./models/TodoTask");
dotenv.config();
app.use("/static",express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
let port=process.env.PORT;
if(port==null||port==""){
    port=3000;
}
// const port=process.env.PORT ||3000
//connection to db
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
console.log("Connected to db!");
app.listen(port, () => console.log("Server Up and running"));
});
// app.get('/',(req, res) => {
//     res.render('todo.ejs');
//     });

// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });
// app.post('/',(req, res) => {
//     console.log(req.body);
//     });
//POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });

    //UPDATE
app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });
// app.listen(3000, () => console.log("Server Up and running"));
