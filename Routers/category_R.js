const express = require('express');
const router = express.Router();

const catMid = require("../middleware/category_Mid");
const userMid = require("../middleware/user_Mid");

router.get("/", [userMid.isLogged, catMid.GetAllCategories], (req, res) => {
    res.render("category_list", {
        categories: req.categories
    });
});

router.post("/Add", [userMid.isLogged, catMid.AddCategory], (req, res) => {
    res.redirect("/C");
});

router.post("/Delete", [userMid.isLogged, catMid.DeleteCategory], (req, res) => {
    res.redirect("/C");
});

module.exports = router;
