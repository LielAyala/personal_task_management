const md5 = require('md5');
const jwt = require("jsonwebtoken");
const db_pool = require("../database"); // לוודא שזה אותו db של כל הפרויקט
const addSlashes = require('slashes').addSlashes;

// התחברות - בדיקת משתמש והנפקת טוקן
async function CheckLogin(req, res, next) {
    let uname = req.body && req.body.uname ? addSlashes(req.body.uname) : "";
    let passwd = req.body && req.body.passwd ? req.body.passwd : "";
    let enc_pass = md5("A" + passwd);
    let Query = `SELECT * FROM users WHERE uname = '${uname}' AND passwd = '${enc_pass}'`;

    let rows = [];
    try {
        [rows] = await db_pool.query(Query);
    } catch (err) {
        console.log(err);
    }

    if (rows.length > 0) {
        req.validUser = true;
        const token = jwt.sign(
            { user_id: rows[0].id }, // 🧠 שם מפורש
            'myPrivateKey',
            { expiresIn: "31d" }
        );
        req.jwtToken = token;
        req.user_id = rows[0].id;
    } else {
        req.validUser = false;
    }

    next();
}

// בדיקה אם מחובר לפי טוקן
function isLogged(req, res, next) {
    try {
        let token = req.cookies.ImLoggedToYoman;
        if (!token) throw new Error("Missing token");

        let payload = jwt.verify(token, 'myPrivateKey');
        req.user_id = payload.user_id;
        next();
    } catch (err) {
        res.status(401).render("login", { error: "יש להתחבר" });
    }
}

// CRUD למשתמש
async function AddUser(req, res, next) {
    let name = req.body.name ? addSlashes(req.body.name) : "";
    let uname = req.body.uname ? addSlashes(req.body.uname) : "";
    let passwd = req.body.passwd || "";
    let enc_pass = md5("A" + passwd);

    let Query = `INSERT INTO users (name, uname, passwd) VALUES ('${name}', '${uname}', '${enc_pass}')`;
    try {
        await db_pool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}

async function UpdateUser(req, res, next) {
    let id = parseInt(req.params.id);
    if (id <= 0) {
        req.GoodOne = false;
        return next();
    }

    let name = req.body.name ? addSlashes(req.body.name) : "";
    let uname = req.body.uname ? addSlashes(req.body.uname) : "";
    req.GoodOne = true;

    let Query = `UPDATE users SET name='${name}', uname='${uname}' WHERE id='${id}'`;
    try {
        await db_pool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}

async function GetOneUser(req, res, next) {
    let id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
        req.GoodOne = false;
        return next();
    }

    req.GoodOne = true;
    let Query = `SELECT * FROM users WHERE id='${id}'`;
    try {
        let [rows] = await db_pool.query(Query);
        req.one_user_data = rows.length > 0 ? rows[0] : {};
    } catch (err) {
        console.log(err);
        req.one_user_data = {};
    }

    next();
}

module.exports = {
    CheckLogin,
    isLogged,
    AddUser,
    UpdateUser,
    GetOneUser
};
