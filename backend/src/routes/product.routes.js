const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    uploadProductImage
} = require("../controllers/product.controller");
const upload = require("../middleware/upload");
const router = express.Router();

router.get("/", getProducts);
router.post(
    "/",
    authenticate,
    authorize("admin"),
    createProduct
);
router.post(
    "/upload-image",
    authenticate,
    authorize("admin"),
    upload.single("image"),
    uploadProductImage
);
router.get("/:id", getProduct);
router.patch("/:id", updateProduct);


module.exports = router;
