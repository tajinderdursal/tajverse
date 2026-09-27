"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadRazorpay } from "../../lib/razorpay";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function CheckoutPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            fetchCart();
        }
    }, [user, authLoading]);

    const fetchCart = async () => {
        try {
            const data = await apiFetch("/cart");
            setCart(data.cart);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const subtotal =
        cart?.items?.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0) || 0;

    const shippingFee = subtotal >= 1000 || subtotal === 0 ? 0 : 100;

    const total = subtotal + shippingFee;

    const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");
    setPlacingOrder(true);

    try {
        // Create our store order first
        const data = await apiFetch("/orders", {
            method: "POST",
            body: JSON.stringify({
                shippingAddress: form,
                paymentMethod,
            }),
        });

        const order = data.order;

        // COD
        if (paymentMethod === "cod") {
            router.push(`/order-success?id=${order._id}`);
            return;
        }

        // Load Razorpay Checkout
        const razorpayLoaded = await loadRazorpay();

        if (!razorpayLoaded) {
            throw new Error(
                "Razorpay Checkout failed to load. Please try again."
            );
        }

        // Ask backend to create Razorpay payment order
        const razorpayData = await apiFetch(
            "/payments/razorpay/create-order",
            {
                method: "POST",
                body: JSON.stringify({
                    orderId: order._id,
                }),
            }
        );

        const razorpayOrder = razorpayData.razorpayOrder;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

            amount: razorpayOrder.amount,

            currency: razorpayOrder.currency,

            name: "TAJVERSE",

            description: "Complete Look Purchase",

            order_id: razorpayOrder.id,

            handler: async function (response) {
                try {
                    setPlacingOrder(true);

                    await apiFetch(
                        "/payments/razorpay/verify",
                        {
                            method: "POST",
                            body: JSON.stringify({
                                orderId: order._id,
                                razorpay_order_id:
                                    response.razorpay_order_id,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_signature:
                                    response.razorpay_signature,
                            }),
                        }
                    );

                    router.push(
                        `/order-success?id=${order._id}`
                    );
                } catch (error) {
                    setError(
                        error.message ||
                            "Payment verification failed."
                    );
                    setPlacingOrder(false);
                }
            },

            prefill: {
                name: form.name,
                contact: form.phone,
            },

            theme: {
                color: "#000000",
            },

            modal: {
                ondismiss: function () {
                    setPlacingOrder(false);
                },
            },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", function (response) {
            console.error("Payment failed:", response.error);

            setError(
                response.error?.description ||
                    "Payment failed. Please try again."
            );

            setPlacingOrder(false);
        });

        razorpay.open();
    } catch (error) {
        setError(error.message);
        setPlacingOrder(false);
    }
};

    if (authLoading || loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-sm tracking-widest uppercase">
                    Loading...
                </p>
            </main>
        );
    }

    if (!cart || cart.items?.length === 0) {
        return (
            <main className="min-h-screen bg-white px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                        Checkout
                    </p>

                    <h1 className="text-5xl font-light mt-4">
                        Your cart is empty
                    </h1>

                    <Link
                        href="/products"
                        className="inline-block mt-10 bg-black text-white px-8 py-4 text-sm tracking-widest uppercase"
                    >
                        Shop Looks
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black">
            {/* NAVBAR */}
            <nav className="border-b border-gray-200 px-6 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-2xl font-semibold tracking-[0.25em]"
                    >
                        TAJVERSE
                    </Link>

                    <Link
                        href="/cart"
                        className="text-xs tracking-widest uppercase"
                    >
                        ← Back to Cart
                    </Link>
                </div>
            </nav>

            {/* CONTENT */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                        Secure Checkout
                    </p>

                    <h1 className="text-5xl font-light mt-3">
                        Complete Your Order
                    </h1>
                </div>

                <form
                    onSubmit={handlePlaceOrder}
                    className="grid lg:grid-cols-[1fr_400px] gap-16"
                >
                    {/* LEFT */}
                    <div>
                        <h2 className="text-xl font-medium mb-8">
                            Shipping Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                            />

                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                            />

                            <input
                                type="text"
                                name="address"
                                placeholder="Full Address"
                                value={form.address}
                                onChange={handleChange}
                                required
                                className="md:col-span-2 border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                            />

                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={form.city}
                                onChange={handleChange}
                                required
                                className="border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                            />

                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={form.state}
                                onChange={handleChange}
                                required
                                className="border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                            />

                            <input
                                type="text"
                                name="pincode"
                                placeholder="Pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                required
                                className="border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                            />
                        </div>

                        {/* PAYMENT */}
                        <div className="mt-14">
                            <h2 className="text-xl font-medium mb-8">
                                Payment Method
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-4 border border-gray-300 p-5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                    />

                                    <div>
                                        <p className="font-medium">
                                            Cash on Delivery
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Pay when your order arrives.
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-4 border border-gray-300 p-5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="razorpay"
                                        checked={paymentMethod === "razorpay"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                    />

                                    <div>
                                        <p className="font-medium">
                                            Razorpay
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Pay securely online.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-8 border border-red-300 bg-red-50 text-red-700 p-4 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* RIGHT - ORDER SUMMARY */}
                    <aside className="lg:sticky lg:top-10 h-fit border border-gray-200 p-7">
                        <h2 className="text-xl font-medium mb-7">
                            Order Summary
                        </h2>

                        <div className="space-y-5">
                            {cart.items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex justify-between gap-4"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {item.product.name}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Size: {item.size} ×{" "}
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-medium">
                                        ₹
                                        {(
                                            item.product.price *
                                            item.quantity
                                        ).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 mt-8 pt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>
                                    ₹{subtotal.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>
                                    {shippingFee === 0
                                        ? "FREE"
                                        : `₹${shippingFee}`}
                                </span>
                            </div>

                            <div className="border-t border-gray-200 pt-5 flex justify-between text-lg font-medium">
                                <span>Total</span>
                                <span>
                                    ₹{total.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={placingOrder}
                            className="w-full mt-8 bg-black text-white py-5 text-sm tracking-[0.2em] uppercase hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {placingOrder
                                ? "Processing..."
                                : "Place Order"}
                        </button>
                    </aside>
                </form>
            </section>
        </main>
    );
}