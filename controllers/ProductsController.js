const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const Redis = require("ioredis");

//REDIS CLIENT CONNECTION
const client = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const cacheKey = 'cacheKey';
const cacheExpirationTime = 3600;

client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Check if Redis is ready
client.on('ready', () => {
  console.log('Connected to Redis');
});

async function addProducts(req, res) {
  try {
    const { name, description, quantity, price, category, imageUrl } = req.body;
    const newProduct = new productModel({
      name: name,
      description: description,
      quantity: quantity,
      price: price,
      category: category,
      imageUrl: imageUrl,
      averageRating: 0,
      ratings: []
    });
    newProduct.save();
    res.json({ message: "Your product will be added within one hour", status: true });
  } catch (err) {
    console.log(err);
    res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false });
  }
}

// Code To get all the keys in the database

// client.keys('*', (err, keys) => {
//   if (err) {
//     console.error('Error retrieving keys:', err);
//   } else {
//     console.log('Keys in the Redis database:', keys);
//   }
// });

async function getProducts(req, res) {
  try {

    // Code to Delete keys

    // client.del(cacheKey, (err, result) => {
    //   if (err) {
    //     console.error('Error deleting key:', err);
    //   } else {
    //     console.log(`Key "${cacheKey}" deleted successfully`);
    //     console.log(`Number of keys deleted: ${result}`);
    //   }
    // });


    // client.lrange(cacheKey, 0, -1, async (err, cachedData) => {
    //   if (err) {
    //     console.error('Error retrieving data from Redis:', err);
    //   } else if (cachedData.length !== 0) {
    //     const products = cachedData.map(str => JSON.parse(str));
    //     console.log("Products are fetched from Cache!");
    //     res.json({ message: "Products are fetched from Cache!", products: products, count: products.length, status: true });
    //   } else {
    //     const products = await productModel.find({});
    //     if (products && products.length !== 0) {
    //       const serializedArray = products.map(obj => JSON.stringify(obj));
    //       client.rpush(cacheKey, ...serializedArray, (err) => {
    //         if (err) {
    //           console.error('Error pushing data to Redis list:', err);
    //         } else {
    //           client.expire(cacheKey, cacheExpirationTime, (expireErr) => {
    //             if (expireErr) {
    //               console.error('Error setting expiration for Redis list key:', expireErr);
    //             } else {
    //               console.log('Expiration set for products list key');
    //             }
    //           });
    //         }
    //       });
    //     }
    //     res.json({ message: "Products are fetched from Database!", products: products, count: products.length, status: true });
    //     console.log("Products are fetched from Database!");
    //   }
    // });
    const products = await productModel.find({});
    res.json({ message: "Products are fetched!", products: products, count: products.length, status: true });
  }
  catch (err) {
    console.log("ERROR", err.message);
    res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false })
  }
}

async function generateDate() {
  const deliveryDate = Math.floor(Math.random() * 5) + 1;
  const currentDate = new Date();
  let newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() + deliveryDate);
  newDate = newDate.toLocaleDateString("en-IN");
  return newDate;
}

// async function alterProductQuantity(pId, product, quantity) {

//   client.lrem(cacheKey, 0, JSON.stringify({ product }), async (remErr) => {
//     if (remErr) {
//       console.error('Error removing product from Redis list:', remErr);
//     } else {
//       console.log('Product removed from cache');
//       const updatedProduct = await productModel.findOneAndUpdate({ _id: pId }, { $inc: { quantity: quantity } }, { new: true });
//       const updatedSerializedProduct = JSON.stringify(updatedProduct);
//       client.rpush(cacheKey, updatedSerializedProduct, (pushErr) => {
//         if (pushErr) {
//           console.error('Error pushing updated data to Redis cache', pushErr);
//         }
//         else {
//           client.expire(cacheKey, cacheExpirationTime, (expireErr) => {
//             if (expireErr) {
//               console.error('Error setting expiration for Redis list key:', expireErr);
//             } else {
//               console.log('Expiration set for products list key');
//             }
//           });
//         }
//       })
//     }
//   });
// }

async function addUserProducts(req, res) {
  try {
    const token = req.headers["x-access-token"];
    const { pId, from } = req.body;
    const decodedToken = jwt.decode(token, process.env.SECRET);
    const product = await productModel.findOne({ _id: pId });
    if (from === "cart") {
      const quantity = product.quantity;
      if (quantity <= 0) {
        res.json({ message: "Product Out Of Stock..", status: false });
      }
      else {
        const userWithProduct = await userModel.findOne({ email: decodedToken.email, 'cart.product': pId });
        if (userWithProduct) {
          res.json({ message: "Product already in cart", status: true });
        }
        else {
          await userModel.updateOne(
            { email: decodedToken.email },
            {
              $push: { cart: { product: pId } },
            }
          );
          res.json({ message: "Added To Cart", status: true });
        }
      }
    }
    else {
      const { wallet, email } = req.body.userDetails;
      const { quantity, address } = req.body;
      const totalPrice = product.price * quantity;
      const remainingBalance = wallet - totalPrice;
      if (remainingBalance >= 0) {
        const orderedDate = new Date().toLocaleDateString("en-IN");
        const [day1, month1, year1] = orderedDate.split('/');
        const oDate = new Date(`${year1}-${month1}-${day1}`);
        // await alterProductQuantity(pId, product, (-1 * quantity));
        const updatedProduct = await productModel.findOneAndUpdate({ _id: pId }, { $inc: { quantity: -quantity } }, { new: true });
        const deliveryDate = await generateDate();
        const [day2, month2, year2] = deliveryDate.split('/');
        const dDate = new Date(`${year2}-${month2}-${day2}`);
        const buyer = await userModel
          .findOneAndUpdate(
            { email: email },
            {
              $push: {
                orders: {
                  product: pId,
                  oDate: oDate,
                  quantity: quantity,
                  price: totalPrice,
                  address: address,
                  dDate: dDate,
                  cancelled: false,
                  delivered: false
                },
              },
              $pull: { cart: { product: pId } },
              $inc: { wallet: -totalPrice, ordersPrice: totalPrice },

            },
            { projection: { orders: 1, wallet: 1, cart: 1, ordersPrice: 1 }, new: true }
          )
          .populate("orders.product")
          .populate("cart.product");
        res.json({ message: "Ordered Successfully", user: buyer, status: true });
      }
      else {
        res.json({
          message: "Insufficient amount in the wallet..!",
          status: false,
        });
      }
    }
  } catch (err) {
    console.log(err.message);
    let message;
    if (err.message === "Cannot read properties of null (reading 'email')") {
      message = 'Please Log In....'
    }
    else {
      message = "Something went wrong. Please refresh the page and try again."
    }
    res.json({ message: message, status: false });
  }
}

async function removeUserProduct(req, res) {
  const { from, orderId, pId, email } = req.body;
  try {
    if (from === "cart") {
      await userModel.updateOne(
        { email: email, "cart.product": pId },
        { $unset: { "cart.$.product": 1 } }
      );
      const user = await userModel
        .findOneAndUpdate(
          { email: email },
          { $pull: { cart: { product: { $exists: false } } } },
          { projection: { cart: 1, orders: 1, wallet: 1 }, new: true }
        )
        .populate("cart.product");
      res.json({
        message: "Successfully removed from cart",
        status: true,
        cart: user.cart,
      });
    }
    else {
      const quantity = parseInt(req.body.quantity, 10);
      const price = parseInt(req.body.price, 10);
      const product = await productModel.findOne({ _id: pId });
      // await alterProductQuantity(pId, product, quantity);
      await productModel.findOneAndUpdate({ _id: pId }, { $inc: { quantity: quantity } }, { new: true });
      // await alterQuantity(pId, updatedProduct);
      const user = await userModel.findOneAndUpdate(
        { email: email, "orders._id": orderId },
        {
          $set: { 'orders.$.cancelled': true },
          $inc: { wallet: price, ordersPrice: -price }
        },
        {
          projection: { orders: 1, cart: 1, wallet: 1, ordersPrice: 1 },
          new: true
        }
      ).populate("orders.product").populate("cart.product");
      res.json({
        message: "Successfully Cancelled!",
        status: true,
        orders: user.orders,
        cart: user.cart,
        wallet: user.wallet,
        ordersPrice: user.ordersPrice
      });
    }
  } catch (err) {
    console.log(err.message);
    res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false });
  }
}

async function getUserProducts(req, res) {
  try {
    const token = req.headers["x-access-token"];
    const decodedToken = jwt.decode(token, process.env.SECRET);
    const currentDate = new Date().toLocaleDateString("en-IN");
    const [day1, month1, year1] = currentDate.split('/');
    const cDate = new Date(`${year1}-${month1}-${day1}`);
    let deductedAmount = 0;
    let userOrders = await userModel.findOne({ email: decodedToken.email }).populate("orders.product");
    userOrders = userOrders.orders;
    userOrders.forEach(element => {
      if (element.dDate < cDate && element.cancelled !== true && element.delivered !== true) {
        deductedAmount += element.price;
      }
    });
    await userModel.updateMany(
      { email: decodedToken.email, 'orders.dDate': { $lt: cDate } },
      {
        $set: { 'orders.$[elem].delivered': true },
      },
      { arrayFilters: [{ 'elem.dDate': { $lt: cDate } }] }
    );
    await userModel.updateOne({ email: decodedToken.email }, { $inc: { ordersPrice: -deductedAmount } });
    const user = await userModel.findOne({ email: decodedToken.email }).populate("cart.product").populate("orders.product");
    res.json({ message: "Fetched the products", status: true, user: user });
  }
  catch (err) {
    console.log(err.message);
    res.json({ message: "Something went wrong. Please refresh the page and try again.", status: false, user: false });

  }
}

async function rateProduct(req, res) {
  try {
    const rating = Number.parseFloat(req.body.value);
    const pId = req.body.name;
    const product = await productModel.findOneAndUpdate({ _id: pId }, { $push: { ratings: { rating: rating } } }, { projection: { ratings: 1, }, new: true });
    const ratings = product.ratings.map((ele) => ele.rating);
    const sumRating = ratings.reduce((acc, currentValue) => acc + currentValue, 0);
    const averageRating = sumRating / ratings.length;
    await productModel.updateOne({ _id: pId }, { averageRating: averageRating });
    res.json({ message: "Successfully Rated the product", status: true })
  }
  catch (err) {
    console.log(err);
    res.json({ message: "There might be some issue...Please try again!", status: false });
  }
}

module.exports = { getProducts, addUserProducts, getUserProducts, removeUserProduct, addProducts, rateProduct, };
