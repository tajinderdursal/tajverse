const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
        },

        gender: {
            type: String,
            enum: ["men", "women"],
            required: true,
        },

        sizes: [
            {
                type: String,
            },
        ],

        images: [
            {
                type: String,
            },
        ],

        sku: {
            type: String,
            required: true,
            unique: true,
        },

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;