const Cart = require("../models/Cart");
const Product = require("../models/product");
const Order = require("../models/Order");

const createOrder = async (req, res) => {
    try {
      const {
    shippingAddress,
    paymentMethod,
} = req.body;

const {
    name,
    phone,
    address,
    city,
    state,
    pincode,
} = shippingAddress || {};

        // Check shipping information
        if (
            !name ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Complete shipping address is required",
            });
        }

        // Check payment method
        if (!["cod", "razorpay"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method",
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({
            user: req.user._id,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty",
            });
        }

        const orderItems = [];
        let subtotal = 0;

        // Validate products and calculate total
        for (const item of cart.items) {
            const product = item.product;

            if (!product || !product.active) {
                return res.status(400).json({
                    success: false,
                    message: "One of the products is no longer available",
                });
            }

            if (!product.sizes.includes(item.size)) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} is not available in size ${item.size}`,
                });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${product.name}`,
                });
            }

            const itemTotal = product.price * item.quantity;

            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                size: item.size,
                image: product.images[0] || "",
            });
        }

        // Simple shipping rule for the project
        const shippingFee = subtotal >= 1000 ? 0 : 100;

        const totalAmount = subtotal + shippingFee;

        // Create order
        const order = await Order.create({
            user: req.user._id,

            items: orderItems,

            shippingAddress: {
                name,
                phone,
                address,
                city,
                state,
                pincode,
            },

            subtotal,
            shippingFee,
            totalAmount,

            paymentMethod,

            paymentStatus:
                paymentMethod === "cod"
                    ? "pending"
                    : "pending",

            orderStatus: "pending",
        });

        // Reduce stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity,
                    },
                }
            );
        }

        // Empty cart after order creation
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create order",
        });
    }
};
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.error("Get orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("Get order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
        });
    }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({
                createdAt: -1,
            });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.error("Get all orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.orderStatus = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        console.error("Update order status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order status",
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};
