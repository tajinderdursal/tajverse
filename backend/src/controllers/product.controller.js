const Product = require("../models/product");

const cloudinary = require("../config/cloudinary");
const getProducts = async (req, res) => {
    try {
        const {
            search,
            gender,
            sort,
        } = req.query;

        const filter = {
            active: true,
        };

        // Search by outfit name
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        // Filter by gender
        if (gender) {
            filter.gender = gender;
        }

        // Sorting
        let sortOption = {};

        if (sort === "price_asc") {
            sortOption.price = 1;
        } else if (sort === "price_desc") {
            sortOption.price = -1;
        } else if (sort === "newest") {
            sortOption.createdAt = -1;
        }

        const products = await Product.find(filter).sort(sortOption);

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
        });
    }
};



const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image",
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "tajverse/products",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: result.secure_url,
        });
    } catch (error) {
        console.error("Image upload error:", error);

        res.status(500).json({
            success: false,
            message: "Image upload failed",
        });
    }
};
module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    uploadProductImage,
};