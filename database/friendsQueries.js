const database = require('../databaseConnection');

const getAllFriends = async(data) => {
    let sql = `
        SELECT DISTINCT user_id, username, user_pic
        FROM friends f
        INNER JOIN user u
        ON IF(f.requester_id = (?), f.receiver_id = u.user_id, f.requester_id = u.user_id)
        WHERE friends = 1;
    `;

    let param = [data.user_id];

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

const removeFriend = async(data) => {
    let sql = `
        DELETE 
        FROM friends
        WHERE (requester_id = (?)
        AND receiver_id = (?))
        OR (requester_id = (?)
        AND receiver_id = (?));
    `
    let param = [data.requester, data.receiver, data.receiver, data.requester];

    try {
        const result = await database.query(sql, param);
        console.log(result);
        return result;
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    getAllFriends, sendRequest, getStatus, acceptRequest, removeFriend
}