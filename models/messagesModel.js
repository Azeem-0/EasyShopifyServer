const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    senderEmail: String,
    receiverEmail: String,
    reaction: {
        type: String,
        default: ''
    },
});

const messagesModel = mongoose.model("messages", messagesSchema);

module.exports = messagesModel;
