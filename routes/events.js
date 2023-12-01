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
const eventsDB = require("../database/eventQueries");

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

router.post('/create', async(req, res) => {

    if(req.body.session == undefined){
        res.send({success: false})
    }

    req.sessionStore.get(req.body.session, async(err, session) => {
        if(err || session === undefined || session === null){
            res.json({
                success: false
            })
        }

        const title = req.body.title;
        const description = req.body.description;
        const date = (req.body.date.split('T')[0]);
        const startTime = `${date} ${req.body.startTime}:00`;
        const endTime = `${date} ${req.body.endTime}:00`;

        const result = await eventsDB.createEvent({
            title: title,
            description: description,
            user_id: session.user_id,
            date: date,
            start_time: startTime,
            end_time: endTime,
            group_id: req.body.group_id
        })

        res.json({
            success: true
        })
    })
})


module.exports = router;