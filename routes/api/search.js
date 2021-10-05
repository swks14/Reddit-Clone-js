const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.route("/search")
    .get(async (req, res) => {
        let query = req.query.query
        let subredditSearchResult = await pool.query("SELECT * FROM subreddit WHERE to_tsvector(name) @@ to_tsquery($1);", [`'${query}'`])
        let postSearchResult = await pool.query("SELECT * FROM post WHERE to_tsvector(content) @@ to_tsquery($1);", [`'${query}'`])
        res.status(200).send({subreddits: subredditSearchResult.rows, post: postSearchResult.rows})
    })

module.exports = router;