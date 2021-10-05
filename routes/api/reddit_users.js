const express = require("express");
const router = express.Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const {checkIfAuthenticated} = require("../../userAuthentication");
const {checkIfUserExists} = require("../../userAuthentication");


router.route("/reddit_users")
    .get(async (req, res) => {
        await pool.query("SELECT * FROM reddit_user;", (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).send(result.rows);
        });
    })
    .post(checkIfUserExists, async (req, res)=> {
        const body = req.body;
        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.activation_guid = null;
        req.body.activation_expire_date = null;
        // res.header("Access-Control-Allow-Origin", "*");

        await pool.query("INSERT INTO reddit_user (nickname, activation_guid, activation_expire_date, password, email) VALUES ($1,$2,$3,$4,$5) RETURNING *;", Object.values(body), (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).send(result.rows);
        });
    });

router.route("/reddit_users/:id")
    .get(async (req, res) => {
        const {id} = req.params;
        await pool.query("SELECT * FROM reddit_user WHERE ID = $1;", [id], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).send(result.rows);
        });
    })
    .put(async (req, res) => {
        const {id} = req.params;
        const body = req.body;
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await pool.query("UPDATE reddit_user SET nickname = $1, activation_guid = $2, activation_expire_date = $3, password = $4, email = $5 ) WHERE ID = $6;", [...Object.values(body), id], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).send(result.rows);
        });
    })
    .delete(async (req, res) => {
        const {id} = req.params;
        await pool.query("DELETE FROM reddit_user WHERE ID = $1;", [id], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).send(result.rows);
        });
    });

router.route("/reddit_user/:email")
    .get(async (req, res) => {
        const {name} = req.params;
        await pool.query("SELECT * FROM reddit_user WHERE email = $1;", [name], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).send(result.rows);
        });
    });
router.route("/user/password")
    .put(checkIfAuthenticated, async (req, res)=> {
        await pool.query('UPDATE reddit_user SET password = $1 WHERE id = $2 RETURNING *', [await bcrypt.hash(req.body.newPassword,10), req.user.id]).then(result => {
            let user = result.rows[0];
            req.login(user, (err) => {
                return res.status(200).send()
            })
        })
            .catch(err => {
                res.status(409).send({error: "Something Went Wrong!"});
                throw err;
            })
    });
router.route("user/logged").get(checkIfAuthenticated ,(req,res)=>{
    return res.status(200).send({logged:true})
})


module.exports = router;