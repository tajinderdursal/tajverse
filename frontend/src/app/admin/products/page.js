"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

export default function AdminProductsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
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

        fetchProducts();
    }, [user, authLoading]);

    const fetchProducts = async () => {
        try {
            const data = await apiFetch("/products");
            setProducts(data.products || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleProduct = async (product) => {
        try {
            await apiFetch(`/products/${product._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    active: !product.active,
                }),
            });

            fetchProducts();
        } catch (error) {
            setError(error.message);
        }
    };

    if (authLoading || loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-xs tracking-[0.3em] uppercase animate-pulse">
                    Loading Products...
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
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 animate-fade-up">
                    <div>
                        <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                            Catalog
                        </p>

                        <h1 className="text-5xl font-light mt-3">
                            Manage Outfits
                        </h1>

                        <p className="text-gray-500 mt-4">
                            {products.length} complete looks
                        </p>
                    </div>

                    <Link
                        href="/admin/products/create"
                        className="group inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition-all duration-500"
                    >
                        Add New Look

                        <span className="transition-transform duration-500 group-hover:rotate-90">
                            +
                        </span>
                    </Link>
                </div>

                {error && (
                    <div className="mt-8 border border-red-300 bg-red-50 text-red-700 p-4">
                        {error}
                    </div>
                )}

                {/* PRODUCT TABLE */}
                <div className="mt-12 border border-gray-200 overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-200 text-left">
                                <th className="p-5 text-xs tracking-widest uppercase text-gray-500">
                                    Outfit
                                </th>

                                <th className="p-5 text-xs tracking-widest uppercase text-gray-500">
                                    Gender
                                </th>

                                <th className="p-5 text-xs tracking-widest uppercase text-gray-500">
                                    Price
                                </th>

                                <th className="p-5 text-xs tracking-widest uppercase text-gray-500">
                                    Stock
                                </th>

                                <th className="p-5 text-xs tracking-widest uppercase text-gray-500">
                                    Status
                                </th>

                                <th className="p-5 text-xs tracking-widest uppercase text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="p-12 text-center text-gray-500"
                                    >
                                        No outfits found.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors duration-500"
                                    >
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-16 h-20 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                                        No Image
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-medium">
                                                        {product.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        SKU: {product.sku}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-5 capitalize">
                                            {product.gender}
                                        </td>

                                        <td className="p-5">
                                            ₹
                                            {product.price.toLocaleString(
                                                "en-IN"
                                            )}
                                        </td>

                                        <td className="p-5">
                                            <span
                                                className={
                                                    product.stock <= 5
                                                        ? "text-red-600"
                                                        : ""
                                                }
                                            >
                                                {product.stock}
                                            </span>
                                        </td>

                                        <td className="p-5">
                                            <span
                                                className={
                                                    product.active
                                                        ? "text-black"
                                                        : "text-gray-400"
                                                }
                                            >
                                                {product.active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="p-5">
                                            <div className="flex items-center gap-5">
                                                <Link
                                                    href={`/admin/products/${product._id}`}
                                                    className="text-xs tracking-widest uppercase hover:underline"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        toggleProduct(product)
                                                    }
                                                    className="text-xs tracking-widest uppercase text-gray-500 hover:text-black transition"
                                                >
                                                    {product.active
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}