const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    session_id: {
        type: String
    }
});

const sessionModel = mongoose.model("sessions", sessionSchema);

module.exports = sessionModel;
