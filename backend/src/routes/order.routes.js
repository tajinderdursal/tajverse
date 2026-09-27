const express = require("express");
const authorize = require("../middleware/authorize");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/order.controller");

const authenticate = require("../middleware/authenticate");

const router = express.Router();
router.get(
    "/admin/all",
    authenticate,
    authorize("admin"),
    getAllOrders
);
router.patch(
    "/admin/:id/status",
    authenticate,
    authorize("admin"),
    updateOrderStatus
);
router.post("/", authenticate, createOrder);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/:id", authenticate, getOrderById);

module.exports = router;