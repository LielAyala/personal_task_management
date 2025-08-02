var md5 = require('md5');

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

async function GetAllUsers(req, res, next) {
    let page = req.query.p ? parseInt(req.query.p) : 0;
    let rowPerPage = 2;
    req.page = page;

    let total_rows = 0;
    const promisePool = db_pool.promise();

    try {
        let [rows] = await promisePool.query("SELECT COUNT(id) AS cnt FROM users");
        total_rows = rows[0].cnt;
    } catch (err) {
        console.log(err);
    }

    req.total_pages = Math.floor(total_rows / rowPerPage);

    let Query = `SELECT * FROM users LIMIT ${page * rowPerPage},${rowPerPage}`;
    try {
        let [rows] = await promisePool.query(Query);
        req.users_data = rows;
    } catch (err) {
        console.log(err);
        req.users_data = [];
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

async function DeleteUser(req, res, next) {
    let id = parseInt(req.body.id);
    if (id > 0) {
        let Query = `DELETE FROM users WHERE id='${id}'`;
        const promisePool = db_pool.promise();
        try {
            await promisePool.query(Query);
        } catch (err) {
            console.log(err);
        }
    }

    next();
}

module.exports = {
    AddUser,
    GetAllUsers,
    GetOneUser,
    DeleteUser,
    UpdateUser,
    CheckLogin,
    isLogged,
};
