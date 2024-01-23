const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  profileImage: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1694273374~exp=1694273974~hmac=9b65d53a65ee3f425191fc478cdf4e7edf46ebc24cfb8fb488d20a142b9542d0",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  phNumber: {
    type: Number,
  },
  wallet: {
    type: Number,
  },
  ordersPrice: {
    type: Number
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    },
  ],
  orders: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      price: Number,
      oDate: Date,
      dDate: Date,
      quantity: Number,
      address: String,
      delivered: Boolean,
      cancelled: Boolean
    }
  ],
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
