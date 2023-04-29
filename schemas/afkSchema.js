const { model, Schema } = require('mongoose');

let afkSchema = new Schema({
    User: String,
    GuildID: String,
    Message: String,
    Nickname: String,
})

module.exports = model("afkS", afkSchema);