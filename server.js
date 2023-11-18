require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const expireTime = 60 * 60 * 1000;

// Import query and functions
const db_query = require('./database/queries');                         // db used for user queries

const PORT = 3000;
const saltRounds = 12;
const app = express();


const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected");
    } catch (err){
        console.log(err);
        process.exit(1);
    }
}



// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
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

const corsOption = {
    origin: '*',
    credentials:true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOption));

app.get('/', (req, res) => {
    res.json({
        message: "SAM AND ALAN COMP4921 PROJECT 3"
    })
})

//API routes

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`APP LISTENING ON PORT: ${PORT}`)
    })
})
