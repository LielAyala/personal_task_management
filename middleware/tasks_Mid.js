const db_pool = require("../database");
const {UpdateCategory} = require("./category_Mid");
const addSlashes = require('slashes').addSlashes;

async function AddTask(req, res, next) {
    const userId = req.user_id;
    let { description, category_id, due_date } = req.body;

    if (!userId) return res.status(400).send("לא נמצא מזהה משתמש");

    // מניעת הכנסת טקסטים בעייתיים
    description = addSlashes(description || "");

    try {
        await db_pool.query(
            `INSERT INTO tasks (user_id, category_id, description, due_date) VALUES (?, ?, ?, ?)`,
            [userId, category_id, description, due_date]
        );
        next(); // עובר להמשך השרשרת (כגון redirect)
    } catch (err) {
        console.error("שגיאה בהוספת משימה:", err);
        res.status(500).send("בעיה בהוספת משימה");
    }
}
async function GetAllTask(req, res, next) {
    const userId = req.user_id;

    try {
        const [rows] = await db_pool.query(
            `SELECT * FROM tasks WHERE user_id = ?`,
            [userId]
        );
        req.tasks = rows;
        next();
    } catch (err) {
        console.error("שגיאה בטעינת משימות:", err);
        res.status(500).send("בעיה בטעינת משימות");
    }
}
async function DeleteTask(req, res, next) {
    const taskId = parseInt(req.body.id);
    const userId = req.user_id;

    if (!taskId || !userId) {
        return res.status(400).send("חסרים נתונים למחיקה");
    }

    try {
        await db_pool.query(
            `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
            [taskId, userId]
        );
        next(); // אם יש מידלוור אחר – זה סבבה
    } catch (err) {
        console.error("שגיאה במחיקת משימה:", err);
        res.status(500).send("בעיה במחיקת משימה");
    }
}
async function UpdateTask(req, res, next) {
    const userId = req.user_id;
    const { id, description, due_date, category_id, is_completed } = req.body;

    try {
        await db_pool.query(
            `UPDATE tasks SET description = ?, due_date = ?, category_id = ?, is_completed = ? WHERE id = ? AND user_id = ?`,
            [description, due_date, category_id, is_completed, id, userId]
        );
        next();
    } catch (err) {
        console.error("שגיאה בעדכון משימה:", err);
        res.status(500).send("בעיה בעדכון משימה");
    }
}
async function UpdateTaskStatus(req, res, next) {
    const taskId = parseInt(req.body.id);
    const userId = req.user_id;
    const isCompleted = req.body.is_completed ? 1 : 0;

    if (!taskId || !userId) {
        return res.status(400).send("חסרים נתונים לעדכון סטטוס");
    }

    try {
        await db_pool.query(
            `UPDATE tasks SET is_completed = ? WHERE id = ? AND user_id = ?`,
            [isCompleted, taskId, userId]
        );
        next(); // או res.redirect('/T') אם את לא משתמשת ב־next
    } catch (err) {
        console.error("שגיאה בעדכון סטטוס משימה:", err);
        res.status(500).send("בעיה בעדכון סטטוס");
    }
}
async function GetFilteredTasks(req, res, next) {
    const promisePool = require("../database");

    const page = parseInt(req.query.p) || 0;
    const status = req.query.status || "all";
    const category = req.query.category || "all";
    const rowPerPage = 10;

    let where = " WHERE 1=1 ";
    if (status === "done") where += " AND is_completed = 1 ";
    else if (status === "not_done") where += " AND is_completed = 0 ";
    if (category !== "all") where += ` AND category_id = ${parseInt(category)} `;

    let countQuery = `SELECT COUNT(id) as cnt FROM tasks ${where}`;
    let dataQuery = `SELECT * FROM tasks ${where} ORDER BY due_date ASC LIMIT ${page * rowPerPage}, ${rowPerPage}`;

    try {
        const [countRows] = await promisePool.query(countQuery);
        const total_rows = countRows[0].cnt;
        req.total_pages = Math.floor((total_rows - 1) / rowPerPage);

        const [tasks] = await promisePool.query(dataQuery);
        req.tasks = tasks;
    } catch (err) {
        console.log(err);
        req.tasks = [];
        req.total_pages = 0;
    }

    req.page = page;
    req.status = status;
    req.category = category;
    next();
}

module.exports = {
    GetAllTask,
    AddTask,
    DeleteTask,
    UpdateTask,
    UpdateTaskStatus,
    GetFilteredTasks
};
