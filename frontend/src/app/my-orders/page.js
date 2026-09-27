"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function MyOrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            fetchOrders();
        }
    }, [user, authLoading]);

    const fetchOrders = async () => {
        try {
            const data = await apiFetch("/orders/my-orders");
            setOrders(data.orders || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <p className="text-2xl font-semibold tracking-[0.25em]">
                        TAJVERSE
                    </p>

                    <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mt-4">
                        Loading
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black overflow-hidden">
            {/* NAVBAR */}
            <nav className="border-b border-gray-200 px-6 py-5 animate-fade-down">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-2xl font-semibold tracking-[0.25em] transition-transform duration-500 hover:scale-[1.03]"
                    >
                        TAJVERSE
                    </Link>

                    <Link
                        href="/products"
                        className="group text-xs tracking-widest uppercase"
                    >
                        <span className="inline-block transition-transform duration-500 group-hover:-translate-x-1">
                            ←
                        </span>{" "}
                        Continue Shopping
                    </Link>
                </div>
            </nav>

            {/* CONTENT */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="animate-fade-up">
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                        Account
                    </p>

                    <h1 className="text-5xl md:text-6xl font-light mt-3 tracking-tight">
                        My Orders
                    </h1>

                    <div className="mt-6 h-px w-16 bg-black origin-left animate-line-grow" />
                </div>

                {error && (
                    <div className="mt-8 border border-red-300 bg-red-50 text-red-700 p-4 animate-fade-up">
                        {error}
                    </div>
                )}

                {!error && orders.length === 0 && (
                    <div className="text-center py-24 animate-fade-up">
                        <div className="mx-auto w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-2xl">○</span>
                        </div>

                        <h2 className="text-3xl font-light mt-8">
                            No orders yet
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Your purchased looks will appear here.
                        </p>

                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-3 mt-8 bg-black text-white px-8 py-4 text-sm tracking-widest uppercase transition-all duration-500 hover:bg-gray-800 hover:px-10"
                        >
                            Explore Looks

                            <span className="transition-transform duration-500 group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="mt-12 space-y-5">
                        {orders.map((order, index) => (
                            <Link
                                key={order._id}
                                href={`/my-orders/${order._id}`}
                                className="group block border border-gray-200 p-7 relative overflow-hidden transition-all duration-700 hover:border-black hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                {/* Hover background */}
                                <div className="absolute inset-0 bg-gray-50 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />

                                <div className="relative">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-gray-500">
                                                Order ID
                                            </p>

                                            <p className="font-medium mt-2 break-all">
                                                {order._id}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-3">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex gap-10">
                                            <div>
                                                <p className="text-xs tracking-widest uppercase text-gray-500">
                                                    Status
                                                </p>

                                                <p className="mt-2 capitalize transition-transform duration-500 group-hover:translate-x-1">
                                                    {order.orderStatus}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs tracking-widest uppercase text-gray-500">
                                                    Total
                                                </p>

                                                <p className="mt-2 font-medium">
                                                    ₹
                                                    {order.totalAmount.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                                        <p className="text-sm text-gray-500">
                                            {order.items.length}{" "}
                                            {order.items.length === 1
                                                ? "look"
                                                : "looks"}
                                        </p>

                                        <span className="text-xs tracking-widest uppercase flex items-center gap-2">
                                            View Order

                                            <span className="transition-transform duration-500 group-hover:translate-x-2">
                                                →
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}