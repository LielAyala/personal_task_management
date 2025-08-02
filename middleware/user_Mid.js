var md5 = require('md5');
/*
קוד של אמיר של האבטחת סיסמאות שימוש בADDSLASHES
*/
async function isLogged(req, res, next) {
    const jwtToken = req.cookies.ImLoggedToYoman;
    let user_id = -1;
    if (jwtToken && jwtToken !== "") {
        jwt.verify(jwtToken, 'myPrivateKey', async (err, decodedToken) => {
            if (!err && decodedToken.data) {
                let data = decodedToken.data;
                user_id = data.split(",")[0];
                req.user_id = user_id;
            }
        });
    }

    if (user_id < 0)
        return res.redirect("/login");

    next();
}
/*
async function CheckLogin(req, res, next) {
    let uname = req.body.uname ? addSlashes(req.body.uname) : "";
    let passwd = req.body.passwd || "";
    let enc_pass = md5("A" + passwd);
    let Query = `SELECT * FROM users WHERE uname = '${uname}' AND passwd = '${enc_pass}'`;

    const promisePool = db_pool.promise();
    let rows = [];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    if (rows.length > 0) {
        req.validUser = true;
        let val = `${rows[0].id},${rows[0].name}`;
        var token = jwt.sign(
            { data: val },
            'myPrivateKey',
            { expiresIn: 31 * 24 * 60 * 60 }
        );
        res.cookie("ImLoggedToYoman", token, {
            maxAge: 31 * 24 * 60 * 60 * 1000
        });
    }

    next();
}*/
async function CheckLogin(req, res, next) {
    let uname = req.body && req.body.uname ? addSlashes(req.body.uname) : "";

    let passwd = req.body && req.body.passwd ? req.body.passwd : "";
    let enc_pass = md5("A" + passwd);
    let Query = `SELECT * FROM users WHERE uname = '${uname}' AND passwd = '${enc_pass}'`;

    const promisePool = db_pool.promise();
    let rows = [];

    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    if (rows.length > 0) {
        req.validUser = true;
        let val = `${rows[0].id},${rows[0].name}`;
        const token = jwt.sign(
            { data: val },
            'myPrivateKey',
            { expiresIn: 31 * 24 * 60 * 60 }
        );

        // במקום לשלוח עוגייה:
        req.jwtToken = token;
        req.user_id = rows[0].id;
    } else {
        req.validUser = false;
    }

    next();
}


async function AddUser(req, res, next) {
    let name = req.body.name ? addSlashes(req.body.name) : "";
    let uname = req.body.uname ? addSlashes(req.body.uname) : "";
    let passwd = req.body.passwd || "";
    let enc_pass = md5("A" + passwd);

    let Query = `INSERT INTO users (name, uname, passwd) VALUES ('${name}', '${uname}', '${enc_pass}')`;

    const promisePool = db_pool.promise();
    try {
        await promisePool.query(Query);
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
    const promisePool = db_pool.promise();
    try {
        await promisePool.query(Query);
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
    const promisePool = db_pool.promise();
    try {
        let [rows] = await promisePool.query(Query);
        req.one_user_data = rows.length > 0 ? rows[0] : {};
    } catch (err) {
        console.log(err);
        req.one_user_data = {};
    }

    next();
}



module.exports = {
    AddUser,
    GetOneUser,
    UpdateUser,
    CheckLogin,
    isLogged
};
