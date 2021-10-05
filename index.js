const express = require("express");
const app = express();
app.use(express.json());
const subreddit_api = require("./routes/api/subreddit");
const reddit_users_api = require("./routes/api/reddit_users");
const posts_api = require("./routes/api/posts");
const home_api = require("./routes/api/home");
const search_api = require("./routes/api/search");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const cors = require("cors");
require('dotenv').config();
const pool = require("./db")
const bcrypt = require("bcrypt")
const multer = require('multer');

const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, { //todo wywalic do jakiegos pliku zby importowac w routach
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});
app.use(cookieParser());
app.use(cors({origin: "http://localhost:8080", credentials: true}));



app.use(expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
const passport = require("passport");
const passportLocal = require("passport-local");

const validateUser = async (email, password, done) => {
    let passwordMatches = false;
    await pool.query("SELECT * FROM reddit_user WHERE email = $1;", [email], async (err, result) => {
        if (err) {
            throw err;
        }
        const userFound = result.rows[0];
        await bcrypt.compare(password, userFound.password, function (err, res) {
            if (err) {
                throw err;
            }
            if (res) {
                passwordMatches = true;
                if (email === userFound.email && passwordMatches) {
                    done(null, {
                        id: userFound.id,
                        email: userFound.email,
                        nickname: userFound.nickname,
                        password: userFound.password
                    });
                } else {
                    done(null, null);
                }
            }
        });
    });
};


passport.use(new passportLocal.Strategy({usernameField: "email"}, validateUser));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    await pool.query("SELECT * FROM reddit_user WHERE id = $1;", [id], (err, result) => {
        if (err) {
            throw err;
        }
        done(null, result.rows[0]);
    });

});
app.use("/api", subreddit_api);
app.use("/api", reddit_users_api);
app.use("/api",posts_api);
app.use("/api",home_api);
app.use("/api",search_api);

app.use("/frontend/images",express.static(__dirname+'/frontend/images'));

io.on('connection', (socket) => {
    console.log('a user connected');
    let subredditRoom;
    socket.on('join', (room) => {
        subredditRoom = room;
        socket.join(room);
        console.log("doszedlem do pokoju")
    });

    socket.on("new_comment", (comment) => {
        console.log(comment, subredditRoom);
        io.sockets.to(subredditRoom).emit("add_comment", comment)
    })
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./frontend/images"); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    },
});

const upload = multer({ storage: fileStorageEngine });

app.post("/api/uploadImage", upload.single("image"), (req, res) => {
    console.log(req.file);

    res.send(req.file.path);
});




app.post("/login", passport.authenticate("local", {failureRedirect: "/error-login", successRedirect: "/success-login"}))

app.get("/error-login", (req, res) => {
    res.status(401).send({error: "Wrong email or password"});
});
app.get("/success-login", (req, res) => {
    res.status(200).send({id: req.user.id, nickname: req.user.nickname});
});
// app.get("/frontend/images/:name", (req, res) => {
//     res.sendFile(__dirname, `./frontend/${req.params.name}`);
// });

const port = 5000;
app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});
app.io = io;