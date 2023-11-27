const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expireTime = 60 * 60 * 1000;

//database
const friendsDB = require("../database/friendsQuries");

router.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}))

router.use(bodyParser.urlencoded({extended: true}))
router.use(express.json())
router.use(session({
    secret: process.env.NODE_SECRET_SESSION,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        crypto:{secret: process.env.MONGO_SESSION_SECRET},
        collectionName: "sessions"
    }),
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: expireTime,
        secure: true
    }
}));


router.post('/getAll', async (req, res) => {
    if(req.body.session == undefined){
        res.send({success: false})
    }
    
    req.sessionStore.get(req.body.session, async(err, session) => {
        if(err || session === undefined || session === null){
            res.json({
                success: false
            })
        } else {
            const user_id = session.user_id;
            const result = await friendsDB.getAllFriends({user_id: user_id})
            res.json({
                allFriends: result
            })
        }
    })
})

module.exports = router;