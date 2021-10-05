const express = require("express");
const router = express.Router();
const pool = require("../../db");


router.route("/home/best")
    .get(async (req, res) => {
        if (!req.isAuthenticated()) {
            let topSubreddits = await pool.query("select subreddit_id from subreddit_user group by subreddit_id order by count(*) desc;")
            let subredditList = []
            for (let topSubreddit of topSubreddits.rows) {

                let subreddit = await pool.query("select * from subreddit where id = $1", [topSubreddit.subreddit_id])

                try {
                    let topPost = await pool.query("select * from post where id = (select post_id from post_vote where post_id in (select id from post where subreddit_id = $1) group by post_id order by sum(vote) desc limit 1);", [topSubreddit.subreddit_id])
                    let commentCount = await pool.query("SELECT COUNT(*) FROM comment WHERE post_id = $1;", [topPost.rows[0].id]);
                    let voteCount = await pool.query("SELECT SUM(vote) FROM post_vote WHERE post_id = $1;", [topPost.rows[0].id])
                    topPost.rows[0].commentCount = commentCount.rows[0].count;
                    topPost.rows[0].voteCount = voteCount.rows[0].sum ? voteCount.rows[0].sum : 0;
                    subreddit.rows[0].topPost = topPost.rows[0]
                    let authorNickname = await pool.query("SELECT nickname FROM reddit_user WHERE id = $1", [topPost.rows[0].user_id])
                    topPost.rows[0].authorNickname = authorNickname.rows[0].nickname

                } catch (err) {
                    console.log(err)
                }



                subredditList.push(subreddit.rows[0])
            }
            res.status(200).send({subreddits: subredditList})
        } else {
            let userSubreddit = await pool.query("select subreddit_id from subreddit_user where  user_id = $1;", [req.user.id])
            let subredditList = []
            for (let userSub of userSubreddit.rows) {

                let subreddit = await pool.query("select * from subreddit where id = $1", [userSub.subreddit_id])
                try {
                    let topPost = await pool.query("select * from post where id = (select post_id from post_vote where post_id in (select id from post where subreddit_id = $1) group by post_id order by sum(vote) desc limit 1);", [userSub.subreddit_id])
                    let commentCount = await pool.query("SELECT COUNT(*) FROM comment WHERE post_id = $1;", [topPost.rows[0].id]);
                    let voteCount = await pool.query("SELECT SUM(vote) FROM post_vote WHERE post_id = $1;", [topPost.rows[0].id])

                    topPost.rows[0].commentCount = commentCount.rows[0].count;
                    topPost.rows[0].voteCount = voteCount.rows[0].sum ? voteCount.rows[0].sum : 0;
                    subreddit.rows[0].topPost = topPost.rows[0]
                }
                catch (err) {
                    console.log(err)
                }

                subredditList.push(subreddit.rows[0])
            }
            res.status(200).send({subreddits: subredditList})

        }
    });

module.exports = router;

module.exports = router;