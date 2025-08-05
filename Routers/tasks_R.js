const express = require('express');
const router = express.Router();

const taskMid = require("../middleware/tasks_Mid");
const userMid = require("../middleware/user_Mid");

router.get("/", [userMid.isLogged, taskMid.GetAllTask], (req, res) => {
    res.render("tasks_list", {
        tasks: req.tasks
    });
});
router.get("/Add", userMid.isLogged, (req, res) => {
    res.render("tasks_add");
});

router.post("/Add", [userMid.isLogged, taskMid.GetAllTask], (req, res) => {
    res.redirect("/T");
});
module.exports = router;
