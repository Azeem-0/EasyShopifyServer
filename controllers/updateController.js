const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


async function changeName(req, res) {
    try {
        const { name, email } = req.body.userDetails;
        await userModel.updateOne({ email: email }, { $set: { name: name } });
        res.json({ message: "Successfully changed Name", status: true, update: name });
    }
    catch (error) {
        console.log(error.message);
        res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false });
    }
}

async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword, email } = req.body.userDetails;
        const user = await userModel.findOne({ email: email });
        const result = await bcrypt.compare(oldPassword, user.password);
        if (!result) {
            res.json({ message: "Incorrect Old password", status: false });
        }
        else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userModel.updateOne({ email: email }, { $set: { password: hashedPassword } });
            res.json({ message: "Successfully changed password", status: true, update: newPassword });
        }
    }
    catch (error) {
        console.log(error.message);
        res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false });

    }
}


async function changePhNumber(req, res) {
    try {
        const { phNumber, email } = req.body.userDetails;
        if (phNumber.length !== 13) {
            res.json({ message: "Phone Number Must be 10 numbers", status: false });
        }
        else {
            await userModel.updateOne({ email: email }, { $set: { phNumber: phNumber } });
            res.json({ message: "Successfully changed Mobile Number", status: true, update: phNumber });
        }
    }
    catch (err) {
        console.log(err.message);
        res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false });
    }
}

async function changeWallet(req, res) {
    const { addWallet, email } = req.body.userDetails;
    try {
        const user = await userModel.updateOne({ email: email }, { $inc: { wallet: addWallet } });
        res.json({ message: "Successfully added money to wallet!", status: true, update: user.wallet });
    }
    catch (error) {
        console.log(error);
        res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false });
    }
}
module.exports = { changeName, changePassword, changePhNumber, changeWallet };