const userModel = require('../models/userModel');


async function searchUsers(currUser, reqUser) {
    try {
        const users = await userModel.find({
            email: { $regex: `^${reqUser}`, $options: 'i', $ne: currUser },
        });
        return users;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

async function getMessages(email) {
    try {
        const messages = await userModel.findOne({ email: email }).populate('messages.product');
        const newMessages = {
            messages: messages?.messages,
            newMessages: messages?.newMessages
        };
        return newMessages;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

async function makeAllMessagesSeen(req, res) {
    try {
        const { email } = req.body;
        await userModel.updateOne({ email: email }, { $set: { 'messages.$[].newMessage': false, newMessages: false } });
        res.json({ message: "success", status: true });
    }
    catch (err) {
        console.log(err.message);
        res.json({ message: "failure", status: false });
    }
}
module.exports = { searchUsers, getMessages, makeAllMessagesSeen };