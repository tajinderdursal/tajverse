const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(
    express.json({
        verify: (req, res, buf) => {
            if (req.originalUrl === "/api/payments/razorpay/webhook") {
                req.rawBody = buf;
            }
        },
    })
);
app.use(cookieParser());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "E-commerce API is running",
    });
});

module.exports = app;