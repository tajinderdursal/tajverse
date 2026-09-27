"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

        fetchDashboard();
    }, [user, authLoading]);

    const fetchDashboard = async () => {
        try {
            const [productData, orderData] = await Promise.all([
                apiFetch("/products"),
                apiFetch("/orders/admin/all"),
            ]);

            setProducts(productData.products || []);
            setOrders(orderData.orders || []);
        } catch (error) {
            console.error("Dashboard error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center animate-pulse">
                    <p className="text-2xl font-semibold tracking-[0.25em]">
                        TAJVERSE
                    </p>

                    <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mt-4">
                        Loading Dashboard
                    </p>
                </div>
            </main>
        );
    }

    const totalRevenue = orders.reduce(
        (total, order) => total + order.totalAmount,
        0
    );

    const pendingOrders = orders.filter(
        (order) =>
            order.orderStatus === "pending" ||
            order.orderStatus === "confirmed"
    ).length;

    const lowStockProducts = products.filter(
        (product) => product.stock <= 5
    ).length;

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

                    <div className="flex items-center gap-6">
                        <span className="text-xs tracking-widest uppercase text-gray-500">
                            Admin
                        </span>

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
                        Administration
                    </p>

                    <h1 className="text-5xl md:text-6xl font-light mt-3">
                        Dashboard
                    </h1>

                    <div className="mt-6 h-px w-16 bg-black animate-line-grow" />
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 mt-12 border border-gray-200">
                    <div className="bg-white p-7">
                        <p className="text-xs tracking-widest uppercase text-gray-500">
                            Total Outfits
                        </p>

                        <p className="text-4xl font-light mt-4">
                            {products.length}
                        </p>
                    </div>

                    <div className="bg-white p-7">
                        <p className="text-xs tracking-widest uppercase text-gray-500">
                            Total Orders
                        </p>

                        <p className="text-4xl font-light mt-4">
                            {orders.length}
                        </p>
                    </div>

                    <div className="bg-white p-7">
                        <p className="text-xs tracking-widest uppercase text-gray-500">
                            Revenue
                        </p>

                        <p className="text-4xl font-light mt-4">
                            ₹{totalRevenue.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="bg-white p-7">
                        <p className="text-xs tracking-widest uppercase text-gray-500">
                            Low Stock
                        </p>

                        <p className="text-4xl font-light mt-4">
                            {lowStockProducts}
                        </p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="grid md:grid-cols-2 gap-5 mt-12">
                    <Link
                        href="/admin/products"
                        className="group border border-gray-200 p-8 hover:border-black transition-all duration-500"
                    >
                        <p className="text-xs tracking-widest uppercase text-gray-500">
                            Catalog
                        </p>

                        <h2 className="text-3xl font-light mt-3">
                            Manage Outfits
                        </h2>

                        <p className="text-sm text-gray-500 mt-3">
                            Add, edit and manage your complete looks.
                        </p>

                        <span className="inline-block mt-8 transition-transform duration-500 group-hover:translate-x-2">
                            →
                        </span>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="group border border-gray-200 p-8 hover:border-black transition-all duration-500"
                    >
                        <p className="text-xs tracking-widest uppercase text-gray-500">
                            Sales
                        </p>

                        <h2 className="text-3xl font-light mt-3">
                            Manage Orders
                        </h2>

                        <p className="text-sm text-gray-500 mt-3">
                            View orders and update their status.
                        </p>

                        <span className="inline-block mt-8 transition-transform duration-500 group-hover:translate-x-2">
                            →
                        </span>
                    </Link>
                </div>

                {/* RECENT ORDERS */}
                <div className="mt-14">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <p className="text-xs tracking-widest uppercase text-gray-500">
                                Activity
                            </p>

                            <h2 className="text-3xl font-light mt-2">
                                Recent Orders
                            </h2>
                        </div>

                        <Link
                            href="/admin/orders"
                            className="text-xs tracking-widest uppercase"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="border border-gray-200">
                        {orders.length === 0 ? (
                            <p className="p-8 text-gray-500">
                                No orders yet.
                            </p>
                        ) : (
                            orders.slice(0, 5).map((order) => (
                                <div
                                    key={order._id}
                                    className="p-6 border-b last:border-b-0 border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50 transition-colors duration-500"
                                >
                                    <div>
                                        <p className="font-medium">
                                            #{order._id.slice(-8)}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {order.items.length}{" "}
                                            {order.items.length === 1
                                                ? "look"
                                                : "looks"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <span className="text-sm capitalize">
                                            {order.orderStatus}
                                        </span>

                                        <span className="font-medium">
                                            ₹
                                            {order.totalAmount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}