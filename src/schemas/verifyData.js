const mongoose = require("mongoose")

const verifySchema = new mongoose.model("verify", new mongoose.Schema({
    user:      { type: String },
    captcha:    { type: Number }
}))

module.exports = verifySchema;