const db_pool = require("../database");
const addSlashes = require('slashes').addSlashes;

async function AddTask(req, res, next) {
    const userId = req.user_id;
    const categoryId = parseInt(req.body.category_id); // ודאי שהוא מספר
    const description = addSlashes(req.body.description || "");
    const dueDate = req.body.due_date || null;

    if (!userId) return res.status(400).send("לא נמצא מזהה משתמש");
    if (!categoryId || !description) return res.status(400).send("חסרים נתונים");

    try {
        await db_pool.query(
            `INSERT INTO tasks (user_id, category_id, description, due_date) VALUES (?, ?, ?, ?)`,
            [userId, categoryId, description, dueDate]
        );
        next();
    } catch (err) {
        console.log("שגיאה בהוספת משימה:", err);
        res.status(500).send("בעיה בשרת");
    }
}

async function GetAllTask(req, res, next) {
    const userId = req.user_id;
    let rows = [];

    try {
        [rows] = await db_pool.query(
            `SELECT * FROM tasks WHERE user_id = ?`,
            [userId]
        );
    } catch (err) {
        console.log(err);
    }

    req.tasks = rows;
    next();
}
module.exports = {
    GetAllTask
};