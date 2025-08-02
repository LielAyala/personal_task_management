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
app.get('/', (req, res) => {
    res.render("index", {});
})

app.listen(port, () => {
    console.log(`Now listening on port http://localhost:${port}`);
});