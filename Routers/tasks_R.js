const express = require('express');
const router = express.Router();

const taskMid = require("../middleware/tasks_Mid");
const userMid = require("../middleware/user_Mid");
const categoryMid= require("../middleware/category_Mid");
const db_pool = require("../database"); // ✅ לא לשכוח את זה!

router.get("/", [userMid.isLogged, taskMid.GetFilteredTasks, categoryMid.GetAllCategories], (req, res) => {
    res.render("tasks_list", {
        tasks: req.tasks,
        categories: req.categories,
        page: req.page,
        total_pages: req.total_pages,
        status: req.status,
        category: req.category
    });
});


router.get("/Add", userMid.isLogged, async (req, res) => {
    const userId = req.user_id;

    try {
        const [categories] = await db_pool.query(
            "SELECT id, name FROM categories WHERE user_id = ?",
            [userId]
        );

        res.render("tasks_add", { categories });
    } catch (err) {
        console.error("שגיאה בטעינת קטגוריות:", err);
        res.status(500).send("שגיאה בטעינת טופס המשימה");
    }
});

router.post("/Add", [userMid.isLogged, taskMid.AddTask], (req, res) => {
    res.redirect("/T");
});

router.post("/Delete", [userMid.isLogged, taskMid.DeleteTask], (req, res) => {
    res.redirect("/T");
});

router.get("/Edit/:id", userMid.isLogged, async (req, res) => {
    const taskId = parseInt(req.params.id);
    const userId = req.user_id;

    try {
        const [taskRows] = await db_pool.query(
            `SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
            [taskId, userId]
        );

        if (taskRows.length === 0) return res.status(404).send("משימה לא נמצאה");

        const [categories] = await db_pool.query(
            `SELECT id, name FROM categories WHERE user_id = ?`,
            [userId]
        );

        res.render("task_edit", { task: taskRows[0], categories });

    } catch (err) {
        console.error("שגיאה בשליפת משימה:", err);
        res.status(500).send("שגיאה בשרת");
    }
});

router.post("/Edit", userMid.isLogged, taskMid.UpdateTask, (req, res) => {
    res.redirect("/T");
});

router.post("/UpdateStatus", userMid.isLogged, taskMid.UpdateTaskStatus, (req, res) => {
    res.redirect("/T");
});


module.exports = router;
