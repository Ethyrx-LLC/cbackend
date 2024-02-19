const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AlertsSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
    link: String,
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Alerts", AlertsSchema)
