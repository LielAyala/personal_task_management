// middleware/category_Mid.js
async function GetAllCategories(req, res, next) {
    const userId = req.user_id;
    const promisePool = db_pool.promise();
    let rows = [];

    try {
        [rows] = await promisePool.query(
            `SELECT * FROM categories WHERE user_id = ?`,
            [userId]
        );
    } catch (err) {
        console.log(err);
    }

    req.categories = rows;
    next();
}
/*
async function AddCategory(req, res, next) {
    const userId = req.user_id;
    const name = addSlashes(req.body.name || "");
    const promisePool = db_pool.promise();

    try {
        await promisePool.query(
            `INSERT INTO categories (name, user_id) VALUES (?, ?)`,
            [name, userId]
        );
    } catch (err) {
        console.log(err);
    }

    next();
}
*/
const promisePool = require("../database"); // לוודא שזה מגיע מ־promisePool

async function AddCategory(req, res, next) {
    console.log("BODY שהתקבל:", req.body);
    let name = addSlashes(req.body.name);
    let q = `INSERT INTO categories (name) VALUES ('${name}')`;

    try {
        await promisePool.query(q); // לא db_pool.query!!
        next();
    } catch (err) {
        console.log("שגיאה בהוספה:", err);
        res.status(500).send("בעיה בשרת");
    }
}


async function DeleteCategory(req, res, next) {
    const catId = parseInt(req.body.id);
    const userId = req.user_id;
    const promisePool = db_pool.promise();

    try {
        await promisePool.query(
            `DELETE FROM categories WHERE id = ? AND user_id = ?`,
            [catId, userId]
        );
    } catch (err) {
        console.log(err);
    }

    next();
}

module.exports = {
    GetAllCategories,
    AddCategory,
    DeleteCategory
};
