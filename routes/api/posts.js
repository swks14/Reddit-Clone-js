const express = require("express");
const router = express.Router();
const pool = require("../../db")
const {checkIfAuthenticated} = require("../../userAuthentication");

router.route("/posts/:subredditName")
    .all(checkIfAuthenticated)
    .post(async (req, res) => {
        const name = req.params.subredditName;
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
        const subreddit_id = subreddit.rows[0].id;
        // let creation_date = Date.parse(new Date())/1000;
        let creation_date = new Date().toUTCString();
        console.log(creation_date);
        let body = req.body;
        if (subreddit.rowCount !== 0) {
            let createPost = await pool.query("INSERT INTO post (title, content, image_path, video_url, creation_date, subreddit_id, user_id) VALUES ($1,$2,$3,$4,$5,$6,$7);",
                [body.title, body.content, body.image_path, body.video_url, creation_date, subreddit_id, req.user.id]);
            res.status(200).send();
        }

    });
module.exports = router;