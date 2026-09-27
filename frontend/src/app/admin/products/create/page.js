"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";

export default function CreateProductPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    
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
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImageFile(file);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const uploadImage = async () => {
        if (!imageFile) {
            throw new Error("Please select an image");
        }

        const formData = new FormData();

        formData.append("image", imageFile);

        setUploadingImage(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/products/upload-image`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Image upload failed"
                );
            }

            return data.imageUrl;
        } finally {
            setUploadingImage(false);
        }
    };

    const handleNameChange = (e) => {
        const name = e.target.value;

        setForm({
            ...form,
            name,
            slug: generateSlug(name),
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        // 1. Upload image to Cloudinary
        const imageUrl = await uploadImage();

        console.log("Cloudinary image URL:", imageUrl);

        // 2. Create product with Cloudinary URL
        await apiFetch("/products", {
            method: "POST",
            body: JSON.stringify({
                name: form.name,
                slug: form.slug,
                description: form.description,
                price: Number(form.price),
                currency: "INR",
                gender: form.gender,

                sizes: form.sizes
                    .split(",")
                    .map((size) => size.trim())
                    .filter(Boolean),

                // IMPORTANT
                images: [imageUrl],

                sku: form.sku,
                stock: Number(form.stock),
                active: true,
            }),
        });

        router.push("/admin/products");
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};
    if (authLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-xs tracking-[0.3em] uppercase animate-pulse">
                    Loading...
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
                        Add New Look
                    </h1>

                    <p className="text-gray-500 mt-4">
                        Create a complete outfit for the TAJVERSE collection.
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
                                    onChange={handleNameChange}
                                    placeholder="Midnight Fit"
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
                                    placeholder="midnight-fit"
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
                                    placeholder="Complete black oversized shirt and black trousers outfit."
                                    rows="4"
                                    required
                                    className="w-full border border-gray-300 mt-2 p-4 outline-none focus:border-black resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* PRICE & CATEGORY */}
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
                                    placeholder="2499"
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

                                <p className="text-xs text-gray-400 mt-2">
                                    Separate sizes with commas.
                                </p>
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
                                    placeholder="20"
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
        <label className="block text-xs tracking-widest uppercase text-gray-500 mb-3">
            Select Image
        </label>

        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-4 text-sm"
            required
        />

        {imagePreview && (
            <div className="mt-6">
                <p className="text-xs tracking-widest uppercase text-gray-500 mb-3">
                    Preview
                </p>

                <img
                    src={imagePreview}
                    alt="Outfit preview"
                    className="w-64 h-80 object-cover"
                />
            </div>
        )}

        <p className="text-xs text-gray-400 mt-3">
            Maximum file size: 5 MB
        </p>
    </div>
</div>

                    {/* SKU */}
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
                                placeholder="MEN-OUTFIT-003"
                                required
                                className="w-full border-b border-gray-300 px-2 py-4 outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-black text-white py-5 text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading
                                ? "Creating Look..."
                                : "Create Look"}
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