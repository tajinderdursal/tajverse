"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { apiFetch } from "../../../lib/api";

export default function OrderDetailsPage() {
    const params = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            const data = await apiFetch(`/orders/${params.id}`);
            setOrder(data.order);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <p className="text-2xl font-semibold tracking-[0.25em]">
                        TAJVERSE
                    </p>

                    <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mt-4">
                        Loading Order
                    </p>
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="text-center animate-fade-up">
                    <h1 className="text-4xl font-light">
                        Order Not Found
                    </h1>

                    <p className="text-gray-500 mt-4">
                        {error || "Unable to load this order."}
                    </p>

                    <Link
                        href="/my-orders"
                        className="inline-block mt-8 bg-black text-white px-8 py-4 text-xs tracking-widest uppercase"
                    >
                        Back to Orders
                    </Link>
                </div>
            </main>
        );
    }

    const statusSteps = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
    ];

    const currentIndex = statusSteps.indexOf(order.orderStatus);

    return (
        <main className="min-h-screen bg-white text-black">
            {/* NAVBAR */}
            <nav className="border-b border-gray-200 px-6 py-5 animate-fade-down">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-2xl font-semibold tracking-[0.25em]"
                    >
                        TAJVERSE
                    </Link>

                    <Link
                        href="/my-orders"
                        className="text-xs tracking-widest uppercase"
                    >
                        ← My Orders
                    </Link>
                </div>
            </nav>

            <section className="max-w-6xl mx-auto px-6 py-16">
                {/* HEADER */}
                <div className="animate-fade-up">
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                        Order Details
                    </p>

                    <h1 className="text-4xl md:text-5xl font-light mt-3">
                        Your Order
                    </h1>

                    <p className="text-sm text-gray-500 mt-4 break-all">
                        Order ID: {order._id}
                    </p>
                </div>

                {/* STATUS */}
                <div className="mt-12 border border-gray-200 p-7 animate-fade-up">
                    <p className="text-xs tracking-widest uppercase text-gray-500">
                        Order Status
                    </p>

                    <h2 className="text-2xl font-light mt-3 capitalize">
                        {order.orderStatus}
                    </h2>

                    {order.orderStatus !== "cancelled" && (
                        <div className="mt-10 overflow-x-auto">
                            <div className="min-w-[650px] flex items-start">
                                {statusSteps.map((step, index) => {
                                    const completed =
                                        currentIndex >= index;

                                    return (
                                        <div
                                            key={step}
                                            className="flex-1 relative text-center"
                                        >
                                            {index !== 0 && (
                                                <div
                                                    className={`absolute top-3 left-0 w-1/2 h-px ${
                                                        currentIndex >= index
                                                            ? "bg-black"
                                                            : "bg-gray-200"
                                                    }`}
                                                />
                                            )}

                                            {index !== statusSteps.length - 1 && (
                                                <div
                                                    className={`absolute top-3 right-0 w-1/2 h-px ${
                                                        currentIndex > index
                                                            ? "bg-black"
                                                            : "bg-gray-200"
                                                    }`}
                                                />
                                            )}

                                            <div
                                                className={`relative z-10 mx-auto w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-700 ${
                                                    completed
                                                        ? "bg-black border-black"
                                                        : "bg-white border-gray-300"
                                                }`}
                                            >
                                                {completed && (
                                                    <span className="text-white text-xs">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>

                                            <p
                                                className={`mt-4 text-xs uppercase tracking-widest ${
                                                    completed
                                                        ? "text-black"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {step}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* ORDER ITEMS */}
                <div className="mt-8 border border-gray-200 animate-fade-up">
                    <div className="p-7 border-b border-gray-200">
                        <h2 className="text-xl font-medium">
                            Your Looks
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className="p-7 flex flex-col md:flex-row gap-6 md:items-center md:justify-between group"
                            >
                                <div className="flex gap-5">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-32 object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-24 h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                            No Image
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-medium text-lg">
                                            {item.name}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-2">
                                            Size: {item.size}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
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

                {/* TWO COLUMNS */}
                <div className="grid lg:grid-cols-2 gap-8 mt-8">
                    {/* SHIPPING */}
                    <div className="border border-gray-200 p-7 animate-fade-up">
                        <p className="text-xs tracking-widest uppercase text-gray-500">
                            Shipping Address
                        </p>

                        <div className="mt-6 space-y-2 text-sm">
                            <p className="font-medium">
                                {order.shippingAddress.name}
                            </p>

                            <p>
                                {order.shippingAddress.address}
                            </p>

                            <p>
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.state}
                            </p>

                            <p>
                                {order.shippingAddress.pincode}
                            </p>

                            <p className="pt-3 text-gray-500">
                                Phone: {order.shippingAddress.phone}
                            </p>
                        </div>
                    </div>

                    {/* PAYMENT SUMMARY */}
                    <div className="border border-gray-200 p-7 animate-fade-up">
                        <p className="text-xs tracking-widest uppercase text-gray-500">
                            Payment Summary
                        </p>

                        <div className="mt-6 space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>
                                    ₹
                                    {order.subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                    {order.shippingFee === 0
                                        ? "FREE"
                                        : `₹${order.shippingFee}`}
                                </span>
                            </div>

                            <div className="border-t border-gray-200 pt-5 flex justify-between text-lg font-medium">
                                <span>Total</span>
                                <span>
                                    ₹
                                    {order.totalAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>

                            <div className="pt-3">
                                <p className="text-xs tracking-widest uppercase text-gray-500">
                                    Payment Method
                                </p>

                                <p className="mt-2 capitalize">
                                    {order.paymentMethod === "cod"
                                        ? "Cash on Delivery"
                                        : "Razorpay"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs tracking-widest uppercase text-gray-500">
                                    Payment Status
                                </p>

                                <p className="mt-2 capitalize">
                                    {order.paymentStatus}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK BUTTON */}
                <div className="mt-10">
                    <Link
                        href="/my-orders"
                        className="group inline-flex items-center gap-3 border border-black px-8 py-4 text-xs tracking-widest uppercase transition-all duration-500 hover:bg-black hover:text-white"
                    >
                        <span className="transition-transform duration-500 group-hover:-translate-x-1">
                            ←
                        </span>

                        Back to My Orders
                    </Link>
                </div>
            </section>
        </main>
    );
}