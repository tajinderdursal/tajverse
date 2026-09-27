const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        provider: {
            type: String,
            enum: ["razorpay"],
            required: true,
        },

        razorpayOrderId: {
            type: String,
            required: true,
        },

        razorpayPaymentId: {
            type: String,
        },

        razorpaySignature: {
            type: String,
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "INR",
        },

        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;