const express = require('express');
const router = express.Router();
const user_Mid = require("../middleware/user_Mid");
const jwt = require("jsonwebtoken");
const db_pool = require("../database"); // ודאי שזה אותו db שלך

// טופס הוספת משתמש
router.get("/Add", (req, res) => {
    res.render("user_add", { data: {} });
});

// שליחת טופס הוספה
router.post("/Add", [user_Mid.AddUser], (req, res) => {
    res.redirect("/login");
});

// טופס עריכת משתמש
router.get("/Edit/:id", [user_Mid.GetOneUser], (req, res) => {
    if (req.GoodOne) {
        res.render("user_add", { data: req.one_user_data });
    } else {
        res.redirect("/login");
    }
});

// שליחת טופס עריכה
router.post("/Edit/:id", [user_Mid.UpdateUser], (req, res) => {
    res.redirect("/login");
});

// דף הבית לאחר התחברות
router.get("/Home", async (req, res) => {
    const token = req.cookies.ImLoggedToYoman;

    if (!token) {
        return res.status(401).render("login", { error: "יש להתחבר" });
    }

    try {
        const decoded = jwt.verify(token, "myPrivateKey");
        const user_id = decoded.user_id;

        // שליפת שם המשתמש מהמסד
        const [rows] = await db_pool.query(`SELECT name FROM users WHERE id = ?`, [user_id]);

        if (rows.length === 0) {
            return res.status(404).render("login", { error: "משתמש לא נמצא" });
        }

        const user_name = rows[0].name;

        res.render("home", {
            user_name: user_name
        });

    } catch (err) {
        console.error("שגיאה בפענוח הטוקן או בשליפת המשתמש:", err);
        res.status(401).render("login", { error: "שגיאה בזיהוי המשתמש" });
    }
});

module.exports = router;
