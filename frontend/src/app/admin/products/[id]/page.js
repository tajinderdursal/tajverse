"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        gender: "men",
        sizes: "",
        image: "",
        sku: "",
        stock: "",
        active: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

        if (params.id) {
            fetchProduct();
        }
    }, [user, authLoading, params.id]);

    const fetchProduct = async () => {
        try {
            const data = await apiFetch(`/products/${params.id}`);
            const product = data.product;

            setForm({
                name: product.name || "",
                slug: product.slug || "",
                description: product.description || "",
                price: product.price || "",
                gender: product.gender || "men",
                sizes: product.sizes?.join(", ") || "",
                image: product.images?.[0] || "",
                sku: product.sku || "",
                stock: product.stock || 0,
                active: product.active,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSaving(true);

        try {
            await apiFetch(`/products/${params.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    name: form.name,
                    slug: form.slug,
                    description: form.description,
                    price: Number(form.price),
                    gender: form.gender,
                    sizes: form.sizes
                        .split(",")
                        .map((size) => size.trim())
                        .filter(Boolean),
                    images: form.image ? [form.image] : [],
                    sku: form.sku,
                    stock: Number(form.stock),
                    active: form.active,
                }),
            });

            router.push("/admin/products");
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-xs tracking-[0.3em] uppercase animate-pulse">
                    Loading Outfit...
                </p>
            </main>
        );
    }

    if (!user || user.role !== "admin") {
        return null;
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

                    <Link
                        href="/admin/products"
                        className="text-xs tracking-widest uppercase"
                    >
                        ← Manage Outfits
                    </Link>
                </div>
            </nav>

            <section className="max-w-4xl mx-auto px-6 py-14">
                {/* HEADER */}
                <div className="animate-fade-up">
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">
                        Catalog
                    </p>

                    <h1 className="text-5xl font-light mt-3">
                        Edit Look
                    </h1>

                    <p className="text-gray-500 mt-4">
                        Update this complete outfit.
                    </p>
                </div>

                {error && (
                    <div className="mt-8 border border-red-300 bg-red-50 text-red-700 p-4">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-12 space-y-10"
                >
                    {/* BASIC INFORMATION */}
                    <div>
                        <h2 className="text-xl font-medium">
                            Basic Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="text-xs tracking-widest uppercase text-gray-500">
                                    Outfit Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="text-xs tracking-widest uppercase text-gray-500">
                                    Slug
                                </label>

                                <input
                                    type="text"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    required
                                    className="w-full border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs tracking-widest uppercase text-gray-500">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                    className="w-full border border-gray-300 mt-2 p-4 outline-none focus:border-black resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* COLLECTION */}
                    <div>
                        <h2 className="text-xl font-medium">
                            Collection Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="text-xs tracking-widest uppercase text-gray-500">
                                    Price (INR)
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="w-full border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="text-xs tracking-widest uppercase text-gray-500">
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full border-b border-gray-300 px-2 py-4 outline-none focus:border-black bg-white"
                                >
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs tracking-widest uppercase text-gray-500">
                                    Sizes
                                </label>

                                <input
                                    type="text"
                                    name="sizes"
                                    value={form.sizes}
                                    onChange={handleChange}
                                    placeholder="S, M, L, XL"
                                    required
                                    className="w-full border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="text-xs tracking-widest uppercase text-gray-500">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                    className="w-full border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                                />
                            </div>
                        </div>
                    </div>

                    {/* IMAGE */}
                    <div>
                        <h2 className="text-xl font-medium">
                            Outfit Image
                        </h2>

                        <div className="mt-6">
                            {form.image && (
                                <img
                                    src={form.image}
                                    alt={form.name}
                                    className="w-40 h-52 object-cover mb-6"
                                />
                            )}

                            <label className="text-xs tracking-widest uppercase text-gray-500">
                                Image URL
                            </label>

                            <input
                                type="url"
                                name="image"
                                value={form.image}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    {/* INVENTORY */}
                    <div>
                        <h2 className="text-xl font-medium">
                            Inventory
                        </h2>

                        <div className="mt-6">
                            <label className="text-xs tracking-widest uppercase text-gray-500">
                                SKU
                            </label>

                            <input
                                type="text"
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                required
                                className="w-full border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                            />
                        </div>

                        <label className="flex items-center gap-3 mt-8 cursor-pointer">
                            <input
                                type="checkbox"
                                name="active"
                                checked={form.active}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />

                            <span className="text-sm">
                                Outfit is active and visible in the store
                            </span>
                        </label>
                    </div>

                    {/* ACTIONS */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-black text-white py-5 text-xs tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <Link
                            href="/admin/products"
                            className="flex-1 border border-black py-5 text-center text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-500"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </section>
        </main>
    );
}