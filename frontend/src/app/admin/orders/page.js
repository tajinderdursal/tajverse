"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

export default function AdminOrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push("/login");
            return;
        }

        if (user.role !== "admin") {
            router.push("/");
            return;
        }

        fetchOrders();
    }, [user, authLoading]);

    const fetchOrders = async () => {
        try {
            const data = await apiFetch("/orders/admin/all");
            setOrders(data.orders || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            setUpdating(orderId);
            setError("");

            await apiFetch(`/orders/admin/${orderId}/status`, {
                method: "PATCH",
                body: JSON.stringify({
                    orderStatus: status,
                }),
            });

            await fetchOrders();
        } catch (error) {
            setError(error.message);
        } finally {
            setUpdating(null);
        }
    };

    if (authLoading || loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-xs tracking-[0.3em] uppercase animate-pulse">
                    Loading Orders...
                </p>
            </main>
        );
    }

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

                    <div className="flex gap-6">
                        <Link
                            href="/admin"
                            className="text-xs tracking-widest uppercase"
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/admin/products"
                            className="text-xs tracking-widest uppercase"
                        >
                            Outfits
                        </Link>

                        <Link
                            href="/"
                            className="text-xs tracking-widest uppercase"
                        >
                            Store →
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="max-w-7xl mx-auto px-6 py-14">
                {/* HEADER */}
                <div className="animate-fade-up">
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                        Sales
                    </p>

                    <h1 className="text-5xl font-light mt-3">
                        Manage Orders
                    </h1>

                    <p className="text-gray-500 mt-4">
                        {orders.length} total{" "}
                        {orders.length === 1 ? "order" : "orders"}
                    </p>
                </div>

                {error && (
                    <div className="mt-8 border border-red-300 bg-red-50 text-red-700 p-4">
                        {error}
                    </div>
                )}

                {/* ORDERS */}
                {orders.length === 0 ? (
                    <div className="border border-gray-200 mt-12 p-16 text-center animate-fade-up">
                        <h2 className="text-3xl font-light">
                            No orders yet
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Customer orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="mt-12 space-y-5">
                        {orders.map((order, index) => (
                            <div
                                key={order._id}
                                className="border border-gray-200 p-7 hover:border-black transition-all duration-500 animate-fade-up"
                                style={{
                                    animationDelay: `${index * 80}ms`,
                                }}
                            >
                                {/* TOP */}
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    <div>
                                        <p className="text-xs tracking-widest uppercase text-gray-500">
                                            Order
                                        </p>

                                        <p className="font-medium mt-2 break-all">
                                            #{order._id}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-2">
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

                                    <div className="flex flex-wrap gap-8">
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-gray-500">
                                                Customer
                                            </p>

                                            <p className="mt-2">
                                                {order.user?.name ||
                                                    "Customer"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-gray-500">
                                                Payment
                                            </p>

                                            <p className="mt-2 capitalize">
                                                {order.paymentMethod}
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

                                {/* ITEMS */}
                                <div className="mt-7 pt-7 border-t border-gray-200">
                                    <p className="text-xs tracking-widest uppercase text-gray-500 mb-5">
                                        Items
                                    </p>

                                    <div className="space-y-4">
                                        {order.items.map(
                                            (item, itemIndex) => (
                                                <div
                                                    key={itemIndex}
                                                    className="flex justify-between gap-5"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {item.name}
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Size:{" "}
                                                            {item.size}{" "}
                                                            ×{" "}
                                                            {item.quantity}
                                                        </p>
                                                    </div>

                                                    <p>
                                                        ₹
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* STATUS */}
                                <div className="mt-7 pt-7 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                                    <div>
                                        <p className="text-xs tracking-widest uppercase text-gray-500">
                                            Current Status
                                        </p>

                                        <p className="mt-2 capitalize font-medium">
                                            {order.orderStatus}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <label className="text-xs tracking-widest uppercase text-gray-500">
                                            Update
                                        </label>

                                        <select
                                            value={order.orderStatus}
                                            disabled={
                                                updating === order._id
                                            }
                                            onChange={(e) =>
                                                updateStatus(
                                                    order._id,
                                                    e.target.value
                                                )
                                            }
                                            className="border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black bg-white"
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>

                                            <option value="confirmed">
                                                Confirmed
                                            </option>

                                            <option value="processing">
                                                Processing
                                            </option>

                                            <option value="shipped">
                                                Shipped
                                            </option>

                                            <option value="delivered">
                                                Delivered
                                            </option>

                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                        </select>

                                        {updating === order._id && (
                                            <span className="text-xs text-gray-500">
                                                Saving...
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}