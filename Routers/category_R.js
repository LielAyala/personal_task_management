const express = require('express');
const router = express.Router();

const catMid = require("../middleware/category_Mid");
const userMid = require("../middleware/user_Mid");

router.get("/", [userMid.isLogged, catMid.GetAllCategories], (req, res) => {
    res.render("category_list", {
        categories: req.categories
    });
});
router.get("/Add", userMid.isLogged, (req, res) => {
    res.render("category_add");
});
router.post("/Add", [userMid.isLogged, catMid.AddCategory], (req, res) => {
    res.redirect("/C");
});
router.post("/Delete", [userMid.isLogged, catMid.DeleteCategory], (req, res) => {
    res.redirect("/C");
});
router.get("/Edit/:id", userMid.isLogged, async (req, res) => {
    const catId = parseInt(req.params.id);
    const userId = req.user_id;

    if (!catId || !userId) {
        return res.status(400).send("נתונים חסרים");
    }

    try {
        const [rows] = await db_pool.query(
            `SELECT * FROM categories WHERE id = ? AND user_id = ?`,
            [catId, userId]
        );

        if (rows.length === 0) return res.status(404).send("קטגוריה לא נמצאה");

        res.render("category_edit", { category: rows[0] });
    } catch (err) {
        console.error("שגיאה בשליפת קטגוריה לעריכה:", err);
        res.status(500).send("שגיאה בשרת");
    }
});
router.post("/Edit", userMid.isLogged, catMid.UpdateCategory, (req, res) => {
    res.redirect("/C");
});

module.exports = router;
