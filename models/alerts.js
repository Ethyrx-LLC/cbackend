const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AlertsSchema = new Schema({
    listings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
})

module.exports = mongoose.model("Alerts", AlertsSchema)
