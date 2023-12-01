const database = require('../databaseConnection');

const createEvent = async(data) => {
    const sql = `
        INSERT INTO events
        (name, description, creator_id, date, start_time, end_time, friend_group)
        VALUES
        (?, ?, ?, ?, ?, ?, ?);
    `
    const param = [data.title, data.description, data.user_id, data.date, data.start_time, data.end_time, data.group_id]

    try{
        const result = await database.query(sql, param);
        console.log(result)
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    createEvent
}