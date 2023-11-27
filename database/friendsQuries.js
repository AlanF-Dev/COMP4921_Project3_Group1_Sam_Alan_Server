const database = require('../databaseConnection');

const getAllFriends = async(data) => {
    let sql = `
        SELECT user_id, username
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

module.exports = {
    getAllFriends
}