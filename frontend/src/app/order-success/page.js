"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";

function OrderSuccessContent() {
    const [orderId, setOrderId] = useState(null);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get order ID from the browser URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (!id) {
            setError("Order ID not found");
            setLoading(false);
            return;
        }

        setOrderId(id);
    }, []);

    // Fetch order from backend
    useEffect(() => {
        if (!orderId) return;

        const fetchOrder = async () => {
            try {
                const data = await apiFetch(`/orders/${orderId}`);
                setOrder(data.order);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-xs tracking-[0.3em] uppercase">
                    Loading Order...
                </p>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-4xl font-light">
                        Order Not Found
                    </h1>

                    <p className="text-gray-500 mt-4">
                        {error || "Something went wrong."}
                    </p>

                    <Link
                        href="/"
                        className="inline-block mt-8 bg-black text-white px-8 py-4 text-sm tracking-widest uppercase"
                    >
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black">

            {/* ================= NAVBAR ================= */}
            <nav className="border-b border-gray-200 px-6 py-5">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="text-2xl font-semibold tracking-[0.25em]"
                    >
                        TAJVERSE
                    </Link>
                </div>
            </nav>

            {/* ================= SUCCESS ================= */}
            <section className="max-w-4xl mx-auto px-6 py-20 text-center">

                <div className="mx-auto w-20 h-20 rounded-full border border-black flex items-center justify-center">
                    <span className="text-3xl">
                        ✓
                    </span>
                </div>

                <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mt-10">
                    Thank You
                </p>

                <h1 className="text-5xl md:text-6xl font-light mt-4">
                    Order Confirmed
                </h1>

                <p className="text-gray-500 mt-5">
                    Your order has been placed successfully.
                </p>

                {/* ================= ORDER INFO ================= */}
                <div className="mt-14 border border-gray-200 text-left">

                    {/* ORDER ID */}
                    <div className="p-7 border-b border-gray-200">
                        <p className="text-xs tracking-widest uppercase text-gray-500">
                            Order ID
                        </p>

                        <p className="mt-2 font-medium break-all">
                            {order._id}
                        </p>
                    </div>

                    {/* PAYMENT / STATUS / TOTAL */}
                    <div className="grid md:grid-cols-3">

                        {/* PAYMENT */}
                        <div className="p-7 border-b md:border-b-0 md:border-r border-gray-200">
                            <p className="text-xs tracking-widest uppercase text-gray-500">
                                Payment
                            </p>

                            <p className="mt-2 capitalize">
                                {order.paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : "Razorpay"}
                            </p>
                        </div>

                        {/* STATUS */}
                        <div className="p-7 border-b md:border-b-0 md:border-r border-gray-200">
                            <p className="text-xs tracking-widest uppercase text-gray-500">
                                Status
                            </p>

                            <p className="mt-2 capitalize">
                                {order.orderStatus}
                            </p>
                        </div>

                        {/* TOTAL */}
                        <div className="p-7">
                            <p className="text-xs tracking-widest uppercase text-gray-500">
                                Total
                            </p>

                            <p className="mt-2 font-medium">
                                ₹
                                {order.totalAmount.toLocaleString("en-IN")}
                            </p>
                        </div>

                    </div>
                </div>

                {/* ================= ITEMS ================= */}
                <div className="mt-10 border border-gray-200 text-left">

                    <div className="p-7 border-b border-gray-200">
                        <h2 className="text-xl font-medium">
                            Your Looks
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className="p-7 flex justify-between gap-6"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.name}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Size: {item.size} ×{" "}
                                        {item.quantity}
                                    </p>
                                </div>

                                <p className="font-medium">
                                    ₹
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString("en-IN")}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>

                {/* ================= BUTTONS ================= */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">

                    <Link
                        href="/my-orders"
                        className="bg-black text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition"
                    >
                        View My Orders
                    </Link>

                    <Link
                        href="/products"
                        className="border border-black px-8 py-4 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </section>
        </main>
    );
}

export default function OrderSuccessPage() {
    return <OrderSuccessContent />;
}