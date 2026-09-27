const express = require("express");

const {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
} = require("../controllers/cart.controller");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/", authenticate, addToCart);
router.get("/", authenticate, getCart);
router.patch("/:itemId", authenticate, updateCartItem);
router.delete("/:itemId", authenticate, removeCartItem);
module.exports = router;