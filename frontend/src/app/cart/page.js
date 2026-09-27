"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function CartPage() {
    const { user, loading: authLoading } = useAuth();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await apiFetch("/cart");
            setCart(data.cart);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!authLoading && user) {
            loadCart();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);


    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            return;
        }

        try {
            setUpdating(true);

            const data = await apiFetch(`/cart/${itemId}`, {
                method: "PATCH",
                body: JSON.stringify({
                    quantity,
                }),
            });

            setCart(data.cart);

        } catch (error) {
            setError(error.message);
        } finally {
            setUpdating(false);
        }
    };


    const removeItem = async (itemId) => {
        try {
            setUpdating(true);

            const data = await apiFetch(`/cart/${itemId}`, {
                method: "DELETE",
            });

            setCart(data.cart);

        } catch (error) {
            setError(error.message);
        } finally {
            setUpdating(false);
        }
    };


    if (authLoading || loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">
                    Loading cart...
                </p>
            </main>
        );
    }


    if (!user) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-6">

                <div className="text-center">

                    <p className="
                        text-xs
                        uppercase
                        tracking-[0.3em]
                        text-gray-400
                    ">
                        TAJVERSE
                    </p>

                    <h1 className="
                        text-4xl
                        md:text-5xl
                        font-serif
                        mt-3
                    ">
                        Your Cart
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-4
                    ">
                        Sign in to view your cart.
                    </p>

                    <Link
                        href="/login"
                        className="
                            inline-block
                            mt-8
                            bg-black
                            text-white
                            px-8
                            py-3
                            rounded-full
                            text-sm
                            hover:bg-gray-800
                            transition-colors
                        "
                    >
                        Sign In
                    </Link>

                </div>

            </main>
        );
    }


    const items = cart?.items || [];


    const subtotal = items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);


    const shipping = subtotal >= 1000 || subtotal === 0
        ? 0
        : 100;


    const total = subtotal + shipping;


    return (
        <main className="min-h-screen bg-white text-black">

            {/* ================= NAVBAR ================= */}

            <nav className="
                flex
                items-center
                justify-between
                px-6
                md:px-10
                py-5
                border-b
                border-gray-200
            ">

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
                        bg-black
                        text-white
                        flex
                        items-center
                        justify-center
                    "
                >
                    🛒
                </Link>

            </nav>


            {/* ================= HEADER ================= */}

            <section className="
                px-6
                md:px-10
                pt-12
                pb-8
            ">

                <p className="
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    text-gray-400
                ">
                    TAJVERSE
                </p>

                <h1 className="
                    text-5xl
                    md:text-7xl
                    font-serif
                    mt-2
                ">
                    Your Cart
                </h1>

            </section>


            {/* ================= ERROR ================= */}

            {error && (

                <div className="
                    mx-6
                    md:mx-10
                    mb-6
                    p-4
                    rounded-xl
                    bg-red-50
                    text-red-500
                    text-sm
                ">
                    {error}
                </div>

            )}


            {/* ================= EMPTY CART ================= */}

            {items.length === 0 ? (

                <section className="
                    px-6
                    md:px-10
                    py-20
                    text-center
                ">

                    <h2 className="
                        text-3xl
                        font-serif
                    ">
                        Your cart is empty
                    </h2>

                    <p className="
                        text-sm
                        text-gray-400
                        mt-3
                    ">
                        Discover a complete look for your next occasion.
                    </p>

                    <Link
                        href="/products"
                        className="
                            inline-block
                            mt-8
                            bg-black
                            text-white
                            px-8
                            py-3
                            rounded-full
                            text-sm
                            hover:bg-gray-800
                            transition-colors
                        "
                    >
                        Explore Outfits
                    </Link>

                </section>

            ) : (

                <section className="
                    px-6
                    md:px-10
                    pb-20
                ">

                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-[1fr_380px]
                        gap-12
                    ">

                        {/* ================= CART ITEMS ================= */}

                        <div className="space-y-5">

                            {items.map((item) => (

                                <div
                                    key={item._id}
                                    className="
                                        flex
                                        gap-5
                                        border-b
                                        border-gray-200
                                        pb-5
                                    "
                                >

                                    {/* IMAGE */}

                                    <Link
                                        href={`/products/${item.product._id}`}
                                        className="
                                            w-28
                                            md:w-40
                                            aspect-[3/4]
                                            rounded-xl
                                            overflow-hidden
                                            bg-gray-100
                                            flex-shrink-0
                                        "
                                    >

                                        {item.product.images?.[0] ? (

                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className="
                                                    w-full
                                                    h-full
                                                    object-cover
                                                "
                                            />

                                        ) : (

                                            <div className="
                                                w-full
                                                h-full
                                                flex
                                                items-center
                                                justify-center
                                                text-xs
                                                text-gray-400
                                            ">
                                                {item.product.name}
                                            </div>

                                        )}

                                    </Link>


                                    {/* INFORMATION */}

                                    <div className="
                                        flex
                                        flex-1
                                        flex-col
                                        justify-between
                                    ">

                                        <div>

                                            <div className="
                                                flex
                                                justify-between
                                                gap-4
                                            ">

                                                <div>

                                                    <Link
                                                        href={`/products/${item.product._id}`}
                                                        className="
                                                            text-lg
                                                            font-serif
                                                            hover:opacity-60
                                                        "
                                                    >
                                                        {item.product.name}
                                                    </Link>

                                                    <p className="
                                                        text-xs
                                                        text-gray-400
                                                        capitalize
                                                        mt-1
                                                    ">
                                                        {item.product.gender}
                                                    </p>

                                                </div>


                                                <p className="text-sm">
                                                    ₹{item.product.price * item.quantity}
                                                </p>

                                            </div>


                                            <p className="
                                                text-xs
                                                text-gray-500
                                                mt-4
                                            ">
                                                Size: {item.size}
                                            </p>

                                        </div>


                                        {/* CONTROLS */}

                                        <div className="
                                            flex
                                            items-center
                                            justify-between
                                            mt-5
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                border
                                                border-gray-300
                                                rounded-full
                                                overflow-hidden
                                            ">

                                                <button
                                                    disabled={updating}
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item._id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="
                                                        w-9
                                                        h-9
                                                        hover:bg-gray-100
                                                    "
                                                >
                                                    −
                                                </button>


                                                <span className="
                                                    w-9
                                                    text-center
                                                    text-sm
                                                ">
                                                    {item.quantity}
                                                </span>


                                                <button
                                                    disabled={updating}
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="
                                                        w-9
                                                        h-9
                                                        hover:bg-gray-100
                                                    "
                                                >
                                                    +
                                                </button>

                                            </div>


                                            <button
                                                disabled={updating}
                                                onClick={() =>
                                                    removeItem(item._id)
                                                }
                                                className="
                                                    text-xs
                                                    text-gray-400
                                                    hover:text-black
                                                    transition-colors
                                                "
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* ================= SUMMARY ================= */}

                        <div>

                            <div className="
                                rounded-2xl
                                bg-gray-50
                                p-6
                                lg:sticky
                                lg:top-6
                            ">

                                <h2 className="
                                    text-2xl
                                    font-serif
                                ">
                                    Order Summary
                                </h2>


                                <div className="
                                    border-t
                                    border-gray-200
                                    mt-6
                                    pt-6
                                    space-y-4
                                ">

                                    <div className="
                                        flex
                                        justify-between
                                        text-sm
                                    ">
                                        <span className="text-gray-500">
                                            Subtotal
                                        </span>

                                        <span>
                                            ₹{subtotal}
                                        </span>
                                    </div>


                                    <div className="
                                        flex
                                        justify-between
                                        text-sm
                                    ">
                                        <span className="text-gray-500">
                                            Shipping
                                        </span>

                                        <span>
                                            {shipping === 0
                                                ? "Free"
                                                : `₹${shipping}`}
                                        </span>
                                    </div>


                                    <div className="
                                        border-t
                                        border-gray-200
                                        pt-4
                                        flex
                                        justify-between
                                        text-lg
                                    ">
                                        <span>
                                            Total
                                        </span>

                                        <span>
                                            ₹{total}
                                        </span>
                                    </div>

                                </div>


                                <Link
                                    href="/checkout"
                                    className="
                                        block
                                        text-center
                                        bg-black
                                        text-white
                                        w-full
                                        py-4
                                        rounded-full
                                        text-sm
                                        mt-8
                                        hover:bg-gray-800
                                        transition-colors
                                    "
                                >
                                    Proceed to Checkout
                                </Link>


                                <Link
                                    href="/products"
                                    className="
                                        block
                                        text-center
                                        text-sm
                                        mt-5
                                        underline
                                        underline-offset-4
                                    "
                                >
                                    Continue Shopping
                                </Link>

                            </div>

                        </div>

                    </div>

                </section>

            )}

        </main>
    );
}