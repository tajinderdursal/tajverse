const Cart = require("../models/Cart");
const Product = require("../models/product");

const addToCart = async (req, res) => {
    try {
        const { productId, quantity, size } = req.body;

        // Check required fields
        if (!productId || !size) {
            return res.status(400).json({
                success: false,
                message: "Product and size are required",
            });
        }

        const requestedQuantity = quantity || 1;

        if (requestedQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        // Find product
        const product = await Product.findById(productId);

        if (!product || !product.active) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Check whether selected size exists
        if (!product.sizes.includes(size)) {
            return res.status(400).json({
                success: false,
                message: "Selected size is not available",
            });
        }

        // Check stock
        if (requestedQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available",
            });
        }

        // Find user's cart
        let cart = await Cart.findOne({
            user: req.user._id,
        });

        // Create cart if user doesn't have one
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [
                    {
                        product: productId,
                        quantity: requestedQuantity,
                        size,
                    },
                ],
            });
        } else {
            // Check whether same product + size already exists
            const existingItem = cart.items.find(
                (item) =>
                    item.product.toString() === productId &&
                    item.size === size
            );

            if (existingItem) {
                const newQuantity =
                    existingItem.quantity + requestedQuantity;

                if (newQuantity > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: "Not enough stock available",
                    });
                }

                existingItem.quantity = newQuantity;
            } else {
                cart.items.push({
                    product: productId,
                    quantity: requestedQuantity,
                    size,
                });
            }

            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
        });
    }
};
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id,
        }).populate("items.product");

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: {
                    items: [],
                },
            });
        }

        res.status(200).json({
            success: true,
            cart,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
        });
    }
};
const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.id(itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            });
        }

        const product = await Product.findById(item.product);

        if (!product || !product.active) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available",
            });
        }

        item.quantity = quantity;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart item updated",
            cart,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update cart item",
        });
    }
};
const removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.id(itemId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            });
        }

        item.deleteOne();

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove cart item",
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
};