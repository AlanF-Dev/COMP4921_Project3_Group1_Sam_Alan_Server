const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expireTime = 60 * 60 * 1000;

const groupDB = require('../database/groupQueries');

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

router.post('/createGroup', async(req, res) => {

    if(req.body.session == undefined){
        res.send({success: false})
    }

    req.sessionStore.get(req.body.session, async(err, session) => {
        if(err || session === undefined || session === null){
            res.send({success: false})
        }else{
            const groupID = await groupDB.createGroup({name: req.body.groupName});
            await groupDB.enterGroup({group_id: groupID, user_id: session.user_id})
            req.body.group.forEach(async(num) => {
                await groupDB.enterGroup({
                    group_id: groupID,
                    user_id: num
                })
            })
        }
    })

})

router.post('/getAllGroups', async(req, res) => {
    if(req.body.session == undefined){
        res.send({success: false})
    }

    req.sessionStore.get(req.body.session, async(err, session) => {
        if(err || session === undefined || session === null){
            res.send({success: false})
        } else {
            const result = await groupDB.getAllGroups({user_id: session.user_id});
            console.log(result);
            res.json({
                allGroups: result
            })
        }
    })
})

module.exports = router;