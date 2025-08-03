const db_pool = require("../database");
const addSlashes = require('slashes').addSlashes;

async function GetAllCategories(req, res, next) {
    const userId = req.user_id;
    let rows = [];

    try {
        [rows] = await db_pool.query(
            `SELECT * FROM categories WHERE user_id = ?`,
            [userId]
        );
    } catch (err) {
        console.log(err);
    }

    req.categories = rows;
    next();
}

async function AddCategory(req, res, next) {
    const userId = req.user_id;
    const name = addSlashes(req.body.name || "");

    if (!userId) return res.status(400).send("לא נמצא מזהה משתמש");

    try {
        await db_pool.query(
            `INSERT INTO categories (name, user_id) VALUES (?, ?)`,
            [name, userId]
        );
        next();
    } catch (err) {
        console.log("שגיאה בהוספת קטגוריה:", err);
        res.status(500).send("בעיה בשרת");
    }
}

async function DeleteCategory(req, res, next) {
    const catId = parseInt(req.body.id);
    const userId = req.user_id;

    try {
        await db_pool.query(
            `DELETE FROM categories WHERE id = ? AND user_id = ?`,
            [catId, userId]
        );
        next();
    } catch (err) {
        console.log("שגיאה במחיקה:", err);
        res.status(500).send("בעיה במחיקת קטגוריה");
    }
}

module.exports = {
    GetAllCategories,
    AddCategory,
    DeleteCategory
};
