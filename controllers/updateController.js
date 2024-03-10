require('dotenv').config();
const userModel = require("../models/userModel");
const stripe = require('stripe')(process.env.STRIPE_SECRET);
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

    const { addWallet, email } = req.body;

    console.log('helo', req.body, addWallet, email);

    try {
        const user = await userModel.updateOne({ email: email }, { $inc: { wallet: addWallet } });
        res.json({ message: "Successfully added money to wallet!", status: true, update: user.wallet });
    }
    catch (error) {
        console.log(error.message);
        res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false });
    }
}


async function checkoutPage(req, res) {
    try {
        const { email, addWallet } = req.body;
        const lineItems = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Add money to wallet',
                    images: ['https://imgs.search.brave.com/Qq6JRnEGmqWFfqyMG1otCFmeQIcPTGhwRQYGC71gwN4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9idXli/aXRjb2lud29ybGR3/aWRlLmNvbS9wYWdl/cy9pbmZvL2FkZC1m/dW5kcy13YWxsZXQv/aW1nL2FkZGZ1bmRz/LWhlYWRlci5wbmc'],
                },
                unit_amount: Math.round((addWallet) * 100)
            },
            quantity: 1
        }]
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: "payment",
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000/failure`
        });

        const user = await userModel.updateOne({ email: email }, { $inc: { wallet: addWallet } });
        res.json({ id: session.id, userWallet: user.wallet });

    } catch (error) {
        console.log(error.message);
        res.json({ message: "There might be some issue...Please try again!", status: false });
    }
}
module.exports = { changeName, changePassword, changePhNumber, changeWallet, checkoutPage };