
const express = require('express');
const path = require("path");
const app = express();
const port = 7777;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRouter = require('./Routers/users_R');
const categoryRouter = require('./Routers/category_R');
const user_Mid = require("./middleware/user_Mid");
const db_M = require('./database');

global.addSlashes = require('slashes').addSlashes;
global.stripSlashes = require('slashes').stripSlashes;
global.jwt = require('jsonwebtoken');
global.db_pool = db_M.pool;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

// חיבור לראוטרים
app.use("/U", userRouter);
app.use("/C", categoryRouter);

app.get("/", (req, res) => {
    res.send("🔧 ברוכה הבאה! השרת פועל.");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post('/login', [user_Mid.CheckLogin], (req, res) => {
    if (req.validUser) {
        // שמירת הקוקי בדפדפן:
        res.cookie("ImLoggedToYoman", req.jwtToken, {
            maxAge: 31 * 24 * 60 * 60 * 1000, // חודש
            httpOnly: true
        });
        // מפנה את המשתמש לדף הקטגוריות
        res.redirect("/C");
    } else {
        res.status(401).render("login", { error: "שם משתמש או סיסמה שגויים" });
    }
});


app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
    console.log(`הצגת הקטגוריות  http://localhost:7777/C`);
    console.log(`התחברות  http://localhost:7777/login`);
    console.log(`הוספת משתמש http://localhost:7777/U/Add`);
    console.log(`הוספת קטגוריה http://localhost:7777/C/Add`);


});
