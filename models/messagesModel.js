const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    senderEmail: String,
    receiverEmail: String,
    reaction: String,
});

const messagesModel = mongoose.model("messages", messagesSchema);

module.exports = messagesModel;
