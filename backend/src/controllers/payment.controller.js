const razorpay = require("../config/razorpay");
const Order = require("../models/Order");
const crypto = require("crypto");
const Payment = require("../models/Payment");

const createRazorpayOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.paymentMethod !== "razorpay") {
            return res.status(400).json({
                success: false,
                message: "This order does not use Razorpay",
            });
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Order is already paid",
            });
        }

        // Razorpay expects amount in paise
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString(),
        });
        await Payment.create({
            order: order._id,
            user: req.user._id,
            provider: "razorpay",
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            status: "created",
        });

        res.status(201).json({
            success: true,
            message: "Razorpay order created",
            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },
        });

    } catch (error) {
        console.error("Razorpay order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create Razorpay order",
        });
    }
};
const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !orderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required",
            });
        }

        // Find the order belonging to the logged-in user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Create signature using Razorpay secret
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        // Compare signatures
        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

const payment = await Payment.findOne({
    order: order._id,
    razorpayOrderId: razorpay_order_id,
});

if (!payment) {
    return res.status(404).json({
        success: false,
        message: "Payment record not found",
    });
}

payment.razorpayPaymentId = razorpay_payment_id;
payment.razorpaySignature = razorpay_signature;
payment.status = "paid";

await payment.save();








        // Payment verified
        order.paymentStatus = "paid";

        // Move order forward
        if (order.orderStatus === "pending") {
            order.orderStatus = "confirmed";
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order,
        });

    } catch (error) {
        console.error("Payment verification error:", error);

        res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};
const handleRazorpayWebhook = async (req, res) => {
    try {
        const webhookSignature = req.headers["x-razorpay-signature"];

        if (!webhookSignature) {
            return res.status(400).json({
                success: false,
                message: "Webhook signature missing",
            });
        }

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_WEBHOOK_SECRET
            )
            .update(req.rawBody)
            .digest("hex");

        if (generatedSignature !== webhookSignature) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook signature",
            });
        }

        const event = JSON.parse(req.body.toString());

        if (event.event === "payment.captured") {
            const paymentEntity = event.payload.payment.entity;

            const payment = await Payment.findOne({
                razorpayOrderId: paymentEntity.order_id,
            });

            if (payment) {
                payment.razorpayPaymentId = paymentEntity.id;
                payment.status = "paid";

                await payment.save();

                await Order.findByIdAndUpdate(
                    payment.order,
                    {
                        paymentStatus: "paid",
                        orderStatus: "confirmed",
                    }
                );
            }
        }

        res.status(200).json({
            success: true,
        });

    } catch (error) {
        console.error("Razorpay webhook error:", error);

        res.status(500).json({
            success: false,
            message: "Webhook processing failed",
        });
    }
};

module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment,
    handleRazorpayWebhook,
};