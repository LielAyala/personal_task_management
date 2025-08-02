// Routers/categories_R.js
const express = require('express');
const router = express.Router();

const catMid = require("../middleware/category_Mid");
const userMid = require("../middleware/user_Mid"); // בשביל isLogged

router.get("/", [ catMid.GetAllCategories], (req, res) => {
    res.render("category_list", {
        categories: req.categories
    });
});

router.post("/Add", [ catMid.AddCategory], (req, res) => {
    res.redirect("/C");
});

router.post("/Delete", [userMid.isLogged, catMid.DeleteCategory], (req, res) => {
    res.redirect("/C");
});

module.exports = router;
