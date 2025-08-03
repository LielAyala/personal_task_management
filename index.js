/*
const port = 7777;
const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
const path = require("path");
app.use(bodyParser.urlencoded({extended: false}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
global.jwt = require('jsonwebtoken');
let db_M = require('./database');
global.db_pool = db_M.pool;

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "./views"));

global.addSlashes    = require('slashes').addSlashes;
global.stripSlashes  = require('slashes').stripSlashes;

global.was_logged = false;


//יבוא הראוטרים
const userRouter = require('./Routers/users_R');
const categoryRouter = require('./Routers/category_R');


//חיבור לנתיב
app.use("/U", userRouter);
app.use("/C", categoryRouter);


const user_Mid = require("./middleware/user_Mid");

app.post('/login', [user_Mid.CheckLogin], (req, res) => {
    if (req.validUser) {
        res.json({
            success: true,
            token: req.jwtToken  // נוסיף אותו ב־middleware
        });
    } else {
        res.status(401).json({ success: false, message: "שם משתמש או סיסמה שגויים" });
    }
});

app.get('/login', (req, res) => {
    res.render("login");
});




app.get('/', (req, res) => {
    res.send("🔧 ברוכה הבאה! השרת פועל.");
});

app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
});*/
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
/*
app.post("/login", [user_Mid.CheckLogin], (req, res) => {
    if (req.validUser) {
        res.cookie("ImLoggedToYoman", req.jwtToken, {
            maxAge: 31 * 24 * 60 * 60 * 1000, // חודש
            httpOnly: true
        });
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "שם משתמש או סיסמה שגויים" });
    }
});*/
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
});
