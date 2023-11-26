const database = require('../databaseConnection');

const createUser = async(data) => {
    let createUserSQL = `
        INSERT INTO user
        (username, email, password)
        VALUES
        (?, ?, ?);
    `

    let param = [data.username, data.email, data.password];

    try{
        await database.query(createUserSQL, param);
        return {success: true}
    }
    catch(e){
        return {success: false}
    }
}

const getUser = async(data) => {
    let getUserSQL = `
        SELECT user_id, username, email, password
        FROM user
        WHERE username = (?);
    `;

    let param = [data.username];

    try{
        const results = await database.query(getUserSQL, param);
        return {user: results[0][0], success: true};
    }
    catch(e){
        return {success: false}
    }
}

const findUsers = async(data) => {
    let sql = `
        SELECT *
        FROM user
        WHERE username LIKE (?) AND username <> (?);
    `

    let param = [data.search, data.username];

    try{
        const result = await database.query(sql, param);
        return result[0];
    }catch(err){
        console.log(err);
    }
}

//friend request queries
const getStatus = async(data) => {
    let sql = `
        SELECT *
        FROM friends
        WHERE (requester_id = (?)
        AND receiver_id = (?))
        OR (requester_id = (?)
        AND receiver_id = (?));
    `

    let param = [data.requester, data.receiver, data.receiver, data.requester];

    try{
        const result = await database.query(sql, param);
        return result[0][0];
    }catch(err){
        console.log(err);
    }
}

const sendRequest = async(data) => {
    let sql = `
        INSERT INTO friends
        (requester_id, receiver_id, friends)
        VALUES
        (?, ?, ?);
    `

    let param = [data.requester, data.receiver, false];

    try{
        const result = await database.query(sql, param);
        return result[0];
    }catch(err){
        console.log(err);
    }
}

const acceptRequest = async(data) => {
    let sql = `
        UPDATE friends
        SET friends = true
        WHERE (requester_id = (?)
        AND receiver_id = (?))
        OR (requester_id = (?)
        AND receiver_id = (?));
    `

    let param = [data.requester, data.receiver, data.receiver, data.requester];

    try{
        const result = await database.query(sql, param);
        return result[0];
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    createUser, getUser, findUsers, sendRequest, getStatus, acceptRequest
}