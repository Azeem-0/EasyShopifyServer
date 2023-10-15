const express = require("express");
const {
  getProducts,
  getUserProducts,
  removeUserProduct,
  addUserProducts,
  addProducts,
  rateProduct,
} = require("../controllers/ProductsController");
const router = express.Router();
router.get("/getProducts", getProducts);
router.get("/getUserProducts", getUserProducts);
router.post("/removeUserProduct", removeUserProduct);
router.post("/addUserProducts", addUserProducts);
router.post("/addProducts", addProducts);
router.post("/rateProduct", rateProduct);
module.exports = router;
