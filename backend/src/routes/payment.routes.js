const express = require("express");

const {
    createRazorpayOrder,

    handleRazorpayWebhook,
    verifyRazorpayPayment,
} = require("../controllers/payment.controller");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post(
    "/razorpay/create-order",
    authenticate,
    createRazorpayOrder
);
router.post(
    "/razorpay/verify",
    authenticate,
    verifyRazorpayPayment
);
router.post(
    "/razorpay/webhook",
    handleRazorpayWebhook
);
module.exports = router;