const express = require("express");
const router = express.Router();
const pool = require("../../db")
const {checkIfAuthenticated} = require("../../userAuthentication");
const {checkIfHasModeratorRoleOnSubreddit} = require("../../userAuthentication");
//
//
// router.route("/subreddits")
//     .get(async (req, res) => {
//         await pool.query("SELECT * FROM subreddit;", (err, result) => {
//             if (err) {
//                 throw err;
//             }
//             res.status(200).send(result.rows);
//         });
//     })
//     .post(checkIfAuthenticated)
//     .post(async (req, res) => {
//         const body = req.body;
//         let createSub = await pool.query("INSERT INTO subreddit (name, description) VALUES ($1,$2) RETURNING *;", Object.values(body), async (err, result) => {
//             if (err) {
//                 throw err;
//             }
//             let subId = result.rows[0].id.toString();
//             let subMod = await pool.query("INSERT INTO subreddit_moderator (user_id,subreddit_id) VALUES ($1,$2);", [req.user.id, subId], (err, result) => {
//                 if (err) {
//                     throw err;
//                 }
//             });
//
//         });
//
//         let subMod2 =  await pool.query("INSERT INTO user_role (user_id,role_id) VALUES ($1,$2);", [req.user.id, 1], (err, result) => {
//             if (err) {
//                 throw err;
//             }
//         });
//         res.status(200).send();
//     });
//
// // router.route("/subreddits/:id")
// //     .get(async(req, res) => {
// //         const { id } = req.params;
// //         await pool.query("SELECT * FROM subreddit WHERE ID = $1;", [id], (err, result) => {
// //             if (err) {
// //                 throw err;
// //             }
// //             res.status(200).send(result.rows);
// //         });
// //     })
// //     .put(async(req, res) => {
// //         const { id } = req.params;
// //         const body = req.body;
// //         await pool.query("UPDATE subreddit SET name = $1, description = $2 WHERE ID = $3;", [...Object.values(body), id], (err, result) => {
// //             if (err) {
// //                 throw err;
// //             }
// //             res.status(200).send(result.rows);
// //         });
// //     })
// //     .delete(async(req, res) => {
// //         const { id } = req.params;
// //         await pool.query("DELETE FROM subreddit WHERE ID = $1;", [id], (err, result) => {
// //             if (err) {
// //                 throw err;
// //             }
// //             res.status(200).send(result.rows);
// //         });
// //     });
//
// // router.route("/subreddits/:name")
// //     .get(async(req, res) => {
// //         const name = req.params;
// //         await pool.query("SELECT * FROM subreddit WHERE name = $1;", Object.values(name), (err, result) => {
// //             if (err) {
// //                 throw err;
// //             }
// //             res.status(200).send(result.rows);
// //         });
// //     });
// router.route("/subreddits/:name")
//     //todo unikalna nazwa redditow
//     .get(async (req, res) => {
//         let userHasJoined = false
//         const {name} = req.params;
//         let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
//         if (subreddit.rowCount !== 0) {
//             if (req.isAuthenticated()) {
//                 let joined = await pool.query("SELECT * FROM subreddit_user WHERE user_id = $1 AND subreddit_id = $2", [req.user.id, subreddit.rows[0].id])
//                 if (joined.rowCount !== 0) userHasJoined = true;
//             }
//             let posts = await pool.query("SELECT * FROM post WHERE subreddit_id = $1;", [subreddit.rows[0].id])
//             if (posts.rowCount !== 0) {
//                 for (let post of posts.rows) {
//                     let commentCount = await pool.query("SELECT COUNT(*) FROM comment WHERE post_id = $1;", [post.id]);
//                     let voteCount = await pool.query("SELECT SUM(vote) FROM post_vote WHERE post_id = $1;", [post.id])
//                     if (req.isAuthenticated()) {
//                         let userHasVoted = await pool.query("SELECT vote FROM post_vote where user_id = $1 AND post_id = $2;", [req.user.id, post.id])
//                         console.log(userHasVoted.rows[0]);
//                         post.userVote = userHasVoted.rows[0] ? userHasVoted.rows[0].vote : 0
//                         console.log("user tu");
//                     }
//                     post.commentCount = commentCount.rows[0].count;
//                     post.voteCount = voteCount.rows[0].sum ? voteCount.rows[0].sum : 0;
//                 }
//                 if (!req.isAuthenticated()) {
//                     res.status(200).send({
//                         subreddit: subreddit.rows[0],
//                         posts: posts.rows,
//                         userHasJoined: userHasJoined
//                     })
//                 } else {
//                     res.status(200).send({subreddit: subreddit.rows[0], posts: posts.rows})
//                 }
//
//             }
//         } else {
//             res.status(404).send({error: "Subreddit not found!"})
//         }
//     });
//
//
// router.route("/subreddit/:name")
//     .get(async (req, res) => {
//         const {name} = req.params;
//         await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name], (err, result) => {
//             if (err) {
//                 throw err;
//             }
//             res.status(200).send(result.rows);
//         });
//     });
// router.route("/subreddits/:name/posts/:id/comments")
//     .get(async (req, res) => {
//         let body = req.body
//         const id = req.params.id;
//         const name = req.params.name;
//         let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
//         let post = await pool.query("SELECT * FROM post WHERE id = $1;", [id])
//         if (subreddit.rowCount !== 0) {
//             let comments = await pool.query("SELECT * FROM comment WHERE post_id = $1;", [id])
//             res.status(200).send({post: post.rows[0], comments: comments.rows})
//         }
//         res.status(404).send({error: "No such subreddit or post!"})
//     })
//
// router.route("/subreddits/:name/posts/:id/comments")
//     .all(checkIfAuthenticated)
//     .post((req, res) => {
//         const id = req.params.id;
//         const name = req.params.name;
//         console.log(req.user)
//         pool.query("INSERT INTO comment (content,parent_comment_id, user_id, post_id) VALUES ($1,$2,$3,$4) RETURNING *;", [req.body.content, null, req.user.id, id], (err, result) => {
//             if (err) {
//                 throw err;
//             }
//             res.status(200).send(result.rows);
//         });
//     });
// router.route("/subreddits/:name/posts/:id/vote")
//     .all(checkIfAuthenticated)
//     .post(async (req, res) => {
//
//         console.log("tu jestemw vote");
//         let body = req.body
//         const id = req.params.id;
//         const name = req.params.name;
//         let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
//         let post = await pool.query("SELECT * FROM post WHERE id = $1;", [id])
//         if (subreddit.rowCount !== 0 && post.rowCount !== 0) {
//             let postVote = await pool.query("SELECT * FROM post_vote where user_id = $1 AND post_id = $2;", [req.user.id, id])
//             let voteValue = Math.sign(body.voteValue)
//             if (postVote.rowCount === 0) {
//                 let vote = await pool.query("INSERT INTO post_vote (vote, user_id, post_id) VALUES ($1, $2, $3);", [voteValue, req.user.id, id])
//                 res.status(200).send()
//                 console.log("if1");
//             } else {
//                 if (voteValue === 0) {
//                     let changeVote = await pool.query("DELETE FROM post_vote WHERE user_id = $1 AND post_id = $2;", [req.user.id, id])
//                     res.status(200).send()
//                     console.log("if2");
//                 } else {
//                     let changeVote = await pool.query("UPDATE post_vote SET vote = $1 where user_id = $2 AND post_id = $3;", [voteValue, req.user.id, id])
//                     res.status(200).send()
//                     console.log("if3");
//                 }
//             }
//         } else {
//             res.status(404).send({error: "No such subreddit or post!"})
//         }
//     })
//
// //todo tutaj emit socjketa jak wszystko pojdzie ok
// router.route("/subreddits/:name/posts")
//     .all(checkIfAuthenticated);
//
// router.route("/subreddits/:name/join")
//     .all(checkIfAuthenticated)
//     .post(async (req, res) => {
//         const {name} = req.params;
//         let subredditResult = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
//         if (subredditResult.rowCount === 1) {
//             let result = await pool.query("SELECT * FROM subreddit_user WHERE user_id = $1 AND subreddit_id = $2", [req.user.id, subredditResult.rows[0].id])
//             if (result.rowCount === 0) {
//                 let insert = await pool.query("INSERT INTO subreddit_user (user_id, subreddit_id) VALUES ($1, $2) RETURNING *", [req.user.id, subredditResult.rows[0].id])
//                 res.status(200).send();
//             } else {
//                 res.status(409).send({error: "User has already joined this subreddit"}); //TODO unjoin wtedy
//             }
//         }
//     })
//
//
// module.exports = router;
router.route("/subreddits")
    .get(async (req, res) => {
        await pool.query("SELECT * FROM subreddit;", (err, result) => {
            if (err) {
                throw err;
            }
            res.status(200).send(result.rows);
        });
    });
router.route("/subreddits")
    .all(checkIfAuthenticated)
    .post(async (req, res) => {
        const body = req.body;
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [body.name])
        if (subreddit.rowCount === 0) {
            let newSubreddit = await pool.query("INSERT INTO subreddit (name, description) VALUES ($1,$2) RETURNING *;", [body.name, body.description])
            console.log(req.user.id, newSubreddit.rows[0].id, "???")
            let addModeratorToAuthor = await pool.query("INSERT INTO subreddit_moderator (user_id,subreddit_id) VALUES ($1,$2);", [req.user.id, newSubreddit.rows[0].id])
            let addRoleToAuthor = await pool.query("INSERT INTO user_role (user_id,role_id) VALUES ($1,$2);", [req.user.id, 1])
            let joinAuthor = await pool.query("INSERT INTO subreddit_user (user_id, subreddit_id) VALUES ($1, $2) RETURNING *", [req.user.id, newSubreddit.rows[0].id])
            res.status(200).send(newSubreddit.rows);

        } else {
            res.status(409).send({error: "Subreddit with this name already exists!"});
        }
    });

//todo zwaliduj zeby pusty nie wszedl, walidacja name surbeddita

router.route("/subreddits/:name/posts/:id/comments")
    .get(async (req, res) => {
        let userIsModerator = false;
        let body = req.body
        const id = req.params.id;
        const name = req.params.name;
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
        let post = await pool.query("SELECT * FROM post WHERE id = $1;", [id])
        if (subreddit.rowCount !== 0 && post.rowCount !== 0) {
            let comments = await pool.query("SELECT * FROM comment WHERE post_id = $1;", [id])

            if (req.isAuthenticated()) {
                let moderator = await pool.query("SELECT * FROM subreddit_moderator where user_id = $1 AND subreddit_id = $2", [req.user.id, subreddit.rows[0].id]);
                console.log(moderator.rows)
                if (moderator.rowCount !== 0) userIsModerator = true;
                res.status(200).send({post: post.rows[0], comments: comments.rows, userIsModerator: userIsModerator})
            }
            else {
                res.status(200).send({post: post.rows[0], comments: comments.rows})
            }
        } else {
            res.status(404).send({error: "No such subreddit or post!"})
        }
    });

router.route("/subreddits/:name/posts/:id/comments")
    .all(checkIfAuthenticated)
    .post((req, res) => {
        const id = req.params.id;
        const name = req.params.name;
        console.log(req.user)
        pool.query("INSERT INTO comment (content,parent_comment_id, user_id, post_id) VALUES ($1,$2,$3,$4) RETURNING *;", [req.body.content, null, req.user.id, id], (err, result) => {
            if (err) {
                throw err;
            }
            req.app.io.to(`${name}-post-${id}`).emit("add_comment", result.rows[0])
            res.status(200).send(result.rows);
        });
    });


//todo zwroc jakos ze jest juz zagłosowany dla usera zeby nie mogł + suma glosow w pobieraniu kazdego posta
router.route("/subreddits/:name/posts/:id/vote")
    .all(checkIfAuthenticated)
    .post(async (req, res) => {
        let body = req.body
        const id = req.params.id;
        const name = req.params.name;
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
        let post = await pool.query("SELECT * FROM post WHERE id = $1;", [id])
        if (subreddit.rowCount !== 0 && post.rowCount !== 0) {
            let postVote = await pool.query("SELECT * FROM post_vote where user_id = $1 AND post_id = $2;", [req.user.id, id])
            let voteValue = Math.sign(body.voteValue)
            if (postVote.rowCount === 0) {
                let vote = await pool.query("INSERT INTO post_vote (vote, user_id, post_id) VALUES ($1, $2, $3);", [voteValue, req.user.id, id])
                res.status(200).send()
                console.log("if1");
            } else {
                if (voteValue === 0) {
                    let changeVote = await pool.query("DELETE FROM post_vote WHERE user_id = $1 AND post_id = $2;", [req.user.id, id])
                    res.status(200).send()
                    console.log("if2");
                } else {
                    let changeVote = await pool.query("UPDATE post_vote SET vote = $1 where user_id = $2 AND post_id = $3;", [voteValue, req.user.id, id])
                    res.status(200).send()
                    console.log("if3");
                }
            }
        } else {
            res.status(404).send({error: "No such subreddit or post!"})
        }
    });


router.route("/subreddits/:name/posts")
    .all(checkIfAuthenticated)
    .post(async (req, res) => {
        const {name} = req.params;
        let body = req.body
        if (!body.title || !body.content) {
            res.status(400).send({error: "Title and content are required!"}) //TODO wzor walidajci
            return;
        }
        //TODO daty
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
        if (subreddit.rowCount !== 0) {
            let post = await pool.query("INSERT INTO post (title, content, image_path, video_url, creation_date, subreddit_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
                [body.title, body.content, body.imagePath, body.videoUrl, new Date().toUTCString(), subreddit.rows[0].id, req.user.id])
            res.status(200).send({post: post.rows[0]})
            req.app.io.to(req.params.name).emit("add_post", {post: post.rows[0]})
        } else {
            res.status(404).send({error: "Subreddit doesn't exist!"})
        }
    });

router.route("/subreddits/:name")
    //todo unikalna nazwa redditow
    .get(async (req, res) => {
        let userHasJoined = false
        let userIsModerator = false;
        const {name} = req.params;
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
        if (subreddit.rowCount !== 0) {
            if (req.isAuthenticated()) {
                let joined = await pool.query("SELECT * FROM subreddit_user WHERE user_id = $1 AND subreddit_id = $2", [req.user.id, subreddit.rows[0].id])
                if (joined.rowCount !== 0) userHasJoined = true;
                let moderator = await pool.query("SELECT * FROM subreddit_moderator where user_id = $1 AND subreddit_id = $2", [req.user.id, subreddit.rows[0].id]);
                console.log(moderator.rows)
                if (moderator.rowCount !== 0) userIsModerator = true;
            }
            let posts = await pool.query("SELECT * FROM post WHERE subreddit_id = $1;", [subreddit.rows[0].id])
            if (posts.rowCount !== 0) {
                for (let post of posts.rows) {
                    let commentCount = await pool.query("SELECT COUNT(*) FROM comment WHERE post_id = $1;", [post.id]);
                    let voteCount = await pool.query("SELECT SUM(vote) FROM post_vote WHERE post_id = $1;", [post.id])
                    if (req.isAuthenticated()) {
                        let userHasVoted = await pool.query("SELECT vote FROM post_vote where user_id = $1 AND post_id = $2;", [req.user.id, post.id])
                        console.log(userHasVoted.rows[0]);
                        post.userVote = userHasVoted.rows[0] ? userHasVoted.rows[0].vote : 0
                        console.log("user tu");
                    }
                    post.commentCount = commentCount.rows[0].count;
                    post.voteCount = voteCount.rows[0].sum ? voteCount.rows[0].sum : 0;
                }
                if (req.isAuthenticated()) {
                    res.status(200).send({
                        subreddit: subreddit.rows[0],
                        posts: posts.rows,
                        userHasJoined: userHasJoined,
                        userIsModerator: userIsModerator,
                        userLogged:true
                    })
                } else {
                    res.status(200).send({subreddit: subreddit.rows[0], posts: posts.rows})
                }

            } else {
                if (req.isAuthenticated()) {
                    res.status(200).send({
                        subreddit: subreddit.rows[0], posts: [], userHasJoined: userHasJoined,
                        userIsModerator: userIsModerator,
                        userLogged:true
                    })
                } else {
                    res.status(200).send({
                        subreddit: subreddit.rows[0], posts: []
                    })
                }
            }
        } else {
            res.status(404).send({error: "Subreddit not found!"})
        }
    })
    .put(checkIfHasModeratorRoleOnSubreddit, async (req, res) =>{
        const {name} = req.params;
        let updateDesc = await pool.query("UPDATE subreddit SET description = $1 WHERE name = $2 RETURNING *",[req.body.description,name]);
        res.status(200).send(updateDesc.rows)
    });

router.route("/subreddits/:name/join")
    .all(checkIfAuthenticated)
    .post(async (req, res) => {
        const {name} = req.params;
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
        if (subreddit.rowCount === 1) {
            let result = await pool.query("SELECT * FROM subreddit_user WHERE user_id = $1 AND subreddit_id = $2", [req.user.id, subreddit.rows[0].id])
            if (result.rowCount === 0) {
                let insert = await pool.query("INSERT INTO subreddit_user (user_id, subreddit_id) VALUES ($1, $2) RETURNING *", [req.user.id, subreddit.rows[0].id])
                res.status(200).send();
            } else {
                let unjoin = await pool.query("DELETE FROM subreddit_user WHERE user_id = $1 AND subreddit_id = $2", [req.user.id, subreddit.rows[0].id])
                res.status(200).send();
            }
        }
    })

router.route("/subreddits/:name")
    .all(checkIfHasModeratorRoleOnSubreddit)
    .put(async (req, res) => {
        const {name} = req.params;
        let subredditResult = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [name])
        if (subredditResult.rowCount === 1) {
            //TODO zwalidowac czy descript nie jest puste
            let subredditUpdate = await pool.query("UPDATE subreddit SET description = $1 WHERE id = $2 RETURNING *;", [req.body.description, subredditResult.rows[0].id])
            res.status(200).send(subredditUpdate.rows)
        } else {
            res.status(404).send({error: "Subreddit doesn't exists!"})
        }
    })
//TODO zwroc 404 jak nic nie usuniesz
router.route("/subreddits/:name/posts/:id")
    .all(checkIfHasModeratorRoleOnSubreddit)
    .delete(async (req, res) => {
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [req.params.name])
        if (subreddit.rowCount !== 0) {
            try {
                let commentsDelete = await pool.query("DELETE FROM comment WHERE post_id=$1;", [req.params.id])
                let votesDelete = await pool.query("DELETE FROM post_vote WHERE post_id=$1;", [req.params.id])
                let postDelete = await pool.query("DELETE FROM post WHERE id=$1;", [req.params.id])
                if (postDelete.rowCount === 1) {
                    res.status(200).send()
                    req.app.io.to(req.params.name).emit("remove_post", {id: req.params.id})
                } else {
                    res.status(400).send({error: "No post with this id!"})
                }
            } catch (err) {
                console.log(err)
                res.status(400).send({error: "Couldn't delete post!"})
            }
        } else {
            res.status(404).send({error: "Post doesn't exist!"})
        }
    })
//TODO wykrozystac tego post ID?
router.route("/subreddits/:name/posts/:id/comments/:commentId")
    .all(checkIfHasModeratorRoleOnSubreddit)
    .delete(async (req, res) => {
        let subreddit = await pool.query("SELECT * FROM subreddit WHERE name = $1;", [req.params.name])
        if (subreddit.rowCount !== 0) {
            try {
                let commentChildDelete = await pool.query("DELETE FROM comment WHERE parent_comment_id=$1;", [req.params.commentId])
                let commentDelete = await pool.query("DELETE FROM comment WHERE id=$1;", [req.params.commentId])
                console.log(commentDelete)
                if (commentDelete.rowCount === 1) {
                    res.status(200).send()
                    req.app.io.to(`${req.params.name}-post-${req.params.id}`).emit("remove_comment", {id: req.params.commentId})
                } else {
                    res.status(400).send({error: "No comment with this id!"})
                }
            } catch (err) {
                res.status(400).send({error: "Couldn't delete comment!"})
            }
        } else {
            res.status(404).send({error: "Subreddit doesn't exist!"})
        }
    });
router.route("/search")
    .get(async (req, res) => {
        let query = req.query.query
        console.log(query)
        let subredditSearchResult = await pool.query("SELECT * FROM subreddit WHERE to_tsvector(name) @@ plainto_tsquery($1);", [query])
        let postSearchResult = await pool.query("SELECT * FROM post WHERE to_tsvector(content) @@ plainto_tsquery($1);", [query])
        for (let post of postSearchResult.rows) {
            let subredditName = await pool.query("SELECT name FROM subreddit WHERE id = $1", [post.subreddit_id])
            let authorNickname = await pool.query("SELECT nickname FROM reddit_user WHERE id = $1", [post.user_id])
            post.subredditName = subredditName.rows[0].name
            post.authorNickname = authorNickname.rows[0].nickname
        }
        res.status(200).send({subreddits: subredditSearchResult.rows, posts: postSearchResult.rows})
    })

module.exports = router;