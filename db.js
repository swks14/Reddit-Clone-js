const Pool = require("pg").Pool;
require('dotenv').config();

const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;
const port = process.env.PORT;
const host = process.env.HOST;

const pool = new Pool({
    user: user,
    password: password,
    database: database,
    host: host,
    port: port
});
module.exports = pool;