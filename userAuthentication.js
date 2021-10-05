const pool = require("./db");

function IfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Im Logged");
        return next();
    }
    console.log("Log in");
    res.status(401).send({error: "Please log in!"})
}

async function checkIfHasModeratorRoleOnSubreddit(req, res, next) {
    if (req.isAuthenticated()) {
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [req.params.name])
        if (subreddit.rowCount !== 0) {
            let subredditId = subreddit.rows[0].id;
            let moderator = await pool.query("SELECT * FROM subreddit_moderator where user_id = $1 AND subreddit_id = $2", [req.user.id, subredditId]);
            if (moderator.rowCount !== 0) {
                next();
            } else {
                res.status(403).send({error: "User is not a moderator!"});
            }
        } else {
            res.status(404).send({error: "Subreddit doesn't exist!"});
        }
    } else {
        res.status(401).send({error: "Please log in!"});
    }

}

async function checkIfUserExists(req, res, next) {
    let user = await pool.query("SELECT * FROM reddit_user WHERE email = $1;", [req.body.email])
    if (user.rowCount === 0) {
        next();
    } else {
        res.status(403).send({error: "User already exists!"});
    }
}

module.exports = {
    checkIfAuthenticated: IfAuthenticated,
    checkIfHasModeratorRoleOnSubreddit: checkIfHasModeratorRoleOnSubreddit,
    checkIfUserExists: checkIfUserExists

}