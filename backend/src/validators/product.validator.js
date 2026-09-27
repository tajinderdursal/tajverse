const Joi = require("joi");

const productSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    slug: Joi.string()
        .trim()
        .min(2)
        .required(),

    description: Joi.string()
        .trim()
        .min(10)
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    currency: Joi.string()
        .valid("INR")
        .default("INR"),

    gender: Joi.string()
        .valid("men", "women")
        .required(),

    sizes: Joi.array()
        .items(
            Joi.string()
                .valid("XS", "S", "M", "L", "XL", "XXL")
        )
        .min(1)
        .required(),

    images: Joi.array()
        .items(Joi.string().uri())
        .default([]),

    sku: Joi.string()
        .trim()
        .required(),

    stock: Joi.number()
        .integer()
        .min(0)
        .required(),

    active: Joi.boolean()
        .default(true),
});

module.exports = {
    productSchema,
};