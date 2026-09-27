"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await apiFetch(`/products/${params.id}`);
                setProduct(data.product);

                if (data.product?.sizes?.length > 0) {
                    setSelectedSize(data.product.sizes[0]);
                }
            } catch (error) {
                console.error("Failed to load product:", error.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            loadProduct();
        }
    }, [params.id]);


    const increaseQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity((current) => current + 1);
        }
    };


    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((current) => current - 1);
        }
    };


    const addToCart = async () => {
        if (!selectedSize) {
            setMessage("Please select a size.");
            return;
        }

        try {
            setAdding(true);
            setMessage("");

            await apiFetch("/cart", {
                method: "POST",
                body: JSON.stringify({
                    productId: product._id,
                    size: selectedSize,
                    quantity,
                }),
            });

            setMessage("Outfit added to cart.");

        } catch (error) {
            setMessage(error.message);
        } finally {
            setAdding(false);
        }
    };


    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">
                    Loading outfit...
                </p>
            </main>
        );
    }


    if (!product) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center">

                <h1 className="text-3xl font-serif">
                    Outfit not found
                </h1>

                <Link
                    href="/products"
                    className="mt-5 underline text-sm"
                >
                    Back to collection
                </Link>

            </main>
        );
    }


    return (
        <main className="min-h-screen bg-white text-black">

            {/* ================= NAVBAR ================= */}

            <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-200">

                <Link
                    href="/"
                    className="
                        text-xl
                        md:text-2xl
                        font-serif
                        tracking-wide
                        hover:opacity-60
                        transition-opacity
                    "
                >
                    ✦ TAJVERSE
                </Link>


                <div className="hidden md:flex items-center gap-10 text-sm">

                    <Link
                        href="/"
                        className="hover:opacity-50 transition-opacity"
                    >
                        Home
                    </Link>

                    <Link
                        href="/products?gender=men"
                        className="hover:opacity-50 transition-opacity"
                    >
                        Men
                    </Link>

                    <Link
                        href="/products?gender=women"
                        className="hover:opacity-50 transition-opacity"
                    >
                        Women
                    </Link>

                    <Link
                        href="/products"
                        className="hover:opacity-50 transition-opacity"
                    >
                        Shop
                    </Link>

                </div>


                <Link
                    href="/cart"
                    className="
                        w-10
                        h-10
                        rounded-full
                        border
                        border-black
                        flex
                        items-center
                        justify-center
                        hover:bg-black
                        hover:text-white
                        transition-all
                    "
                >
                    🛒
                </Link>

            </nav>


            {/* ================= PRODUCT ================= */}

            <section
                className="
                    px-6
                    md:px-10
                    py-10
                    md:py-16
                    max-w-7xl
                    mx-auto
                "
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-10
                        lg:gap-16
                    "
                >

                    {/* ================= IMAGE ================= */}

                    <div>

                        <div
                            className="
                                aspect-[3/4]
                                rounded-3xl
                                overflow-hidden
                                bg-gray-100
                            "
                        >

                            {product.images?.[0] ? (

                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="
                                        w-full
                                        h-full
                                        object-cover
                                    "
                                />

                            ) : (

                                <div
                                    className="
                                        w-full
                                        h-full
                                        flex
                                        items-center
                                        justify-center
                                        text-gray-400
                                    "
                                >
                                    {product.name}
                                </div>

                            )}

                        </div>


                        {/* ADDITIONAL IMAGES */}

                        {product.images?.length > 1 && (

                            <div className="grid grid-cols-4 gap-3 mt-3">

                                {product.images.map((image, index) => (

                                    <div
                                        key={index}
                                        className="
                                            aspect-square
                                            rounded-xl
                                            overflow-hidden
                                            bg-gray-100
                                        "
                                    >

                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="
                                                w-full
                                                h-full
                                                object-cover
                                            "
                                        />

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* ================= INFORMATION ================= */}

                    <div className="flex flex-col justify-center">

                        <p
                            className="
                                text-xs
                                uppercase
                                tracking-[0.3em]
                                text-gray-400
                            "
                        >
                            {product.gender} collection
                        </p>


                        <h1
                            className="
                                text-4xl
                                md:text-6xl
                                font-serif
                                mt-3
                            "
                        >
                            {product.name}
                        </h1>


                        <p
                            className="
                                text-2xl
                                mt-6
                            "
                        >
                            ₹{product.price}
                        </p>


                        {/* DESCRIPTION */}

                        <div className="border-t border-gray-200 mt-8 pt-8">

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    leading-7
                                "
                            >
                                {product.description}
                            </p>

                        </div>


                        {/* SIZE */}

                        {product.sizes?.length > 0 && (

                            <div className="mt-8">

                                <div className="flex justify-between">

                                    <p className="text-sm font-medium">
                                        Select Size
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Available sizes
                                    </p>

                                </div>


                                <div className="flex flex-wrap gap-2 mt-4">

                                    {product.sizes.map((size) => (

                                        <button
                                            key={size}
                                            onClick={() =>
                                                setSelectedSize(size)
                                            }
                                            className={`
                                                min-w-14
                                                px-4
                                                py-3
                                                rounded-full
                                                border
                                                text-sm
                                                transition-all
                                                duration-300
                                                ${
                                                    selectedSize === size
                                                        ? "bg-black text-white border-black"
                                                        : "border-gray-300 hover:border-black"
                                                }
                                            `}
                                        >
                                            {size}
                                        </button>

                                    ))}

                                </div>

                            </div>

                        )}


                        {/* QUANTITY */}

                        <div className="mt-8">

                            <p className="text-sm font-medium">
                                Quantity
                            </p>

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    border
                                    border-gray-300
                                    rounded-full
                                    mt-4
                                    overflow-hidden
                                "
                            >

                                <button
                                    onClick={decreaseQuantity}
                                    className="
                                        w-11
                                        h-11
                                        hover:bg-gray-100
                                    "
                                >
                                    −
                                </button>


                                <span className="w-10 text-center text-sm">
                                    {quantity}
                                </span>


                                <button
                                    onClick={increaseQuantity}
                                    className="
                                        w-11
                                        h-11
                                        hover:bg-gray-100
                                    "
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        {/* STOCK */}

                        <div className="mt-5">

                            {product.stock > 0 ? (

                                <p className="text-xs text-gray-400">
                                    {product.stock} outfits available
                                </p>

                            ) : (

                                <p className="text-xs text-red-500">
                                    Out of stock
                                </p>

                            )}

                        </div>


                        {/* ADD TO CART */}

                        <button
                            onClick={addToCart}
                            disabled={adding || product.stock === 0}
                            className="
                                w-full
                                mt-8
                                bg-black
                                text-white
                                py-4
                                rounded-full
                                text-sm
                                transition-all
                                duration-300
                                hover:bg-gray-800
                                disabled:bg-gray-300
                                disabled:cursor-not-allowed
                            "
                        >
                            {adding
                                ? "Adding..."
                                : "Add to Cart"}
                        </button>


                        {/* MESSAGE */}

                        {message && (

                            <div
                                className={`
                                    mt-4
                                    text-sm
                                    text-center
                                    ${
                                        message.includes("added")
                                            ? "text-green-600"
                                            : "text-red-500"
                                    }
                                `}
                            >
                                {message}
                            </div>

                        )}


                        {/* CART LINK */}

                        <button
                            onClick={() => router.push("/cart")}
                            className="
                                w-full
                                mt-3
                                border
                                border-black
                                py-4
                                rounded-full
                                text-sm
                                hover:bg-black
                                hover:text-white
                                transition-all
                                duration-300
                            "
                        >
                            View Cart
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
}