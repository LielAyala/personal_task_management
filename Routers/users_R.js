const express = require('express');
const router = express.Router();
const user_Mid = require("../middleware/user_Mid");

router.get("/Add", (req, res) => {
    res.render("user_add", { data: {} });
});

router.post("/Add", [user_Mid.AddUser], (req, res) => {
    res.redirect("/login");
});

router.get("/Edit/:id", [user_Mid.GetOneUser], (req, res) => {
    if (req.GoodOne) {
        res.render("user_add", { data: req.one_user_data });
    } else {
        res.redirect("/login");
    }
});

router.post("/Edit/:id", [user_Mid.UpdateUser], (req, res) => {
    res.redirect("/login");
});

module.exports = router;
