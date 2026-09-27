"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../lib/api";


function ProductsContent() {
    const searchParams = useSearchParams();

    const initialGender = searchParams.get("gender") || "all";

    const [products, setProducts] = useState([]);
    const [gender, setGender] = useState(initialGender);
    const [sort, setSort] = useState("newest");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);


    const loadProducts = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (gender !== "all") {
                params.append("gender", gender);
            }

            if (sort) {
                params.append("sort", sort);
            }

            const query = params.toString();

            const data = await apiFetch(
                query ? `/products?${query}` : "/products"
            );

            setProducts(data.products || []);
        } catch (error) {
            console.error("Failed to load products:", error.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadProducts();
    }, [gender, sort]);


    const handleSearch = (event) => {
        event.preventDefault();
        loadProducts();
    };


    return (
        <main className="min-h-screen bg-white text-black">

            {/* ================= NAVBAR ================= */}

            <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-gray-200">

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
                        className="font-medium"
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
                        border
                        border-black
                        flex
                        items-center
                        justify-center
                        hover:bg-black
                        hover:text-white
                        transition-all
                    "
                >
                    🛒
                </Link>

            </nav>


            {/* ================= HEADER ================= */}

            <section className="px-6 md:px-10 pt-14 pb-10">

                <p
                    className="
                        text-xs
                        uppercase
                        tracking-[0.3em]
                        text-gray-400
                    "
                >
                    TAJVERSE COLLECTION
                </p>

                <h1
                    className="
                        text-5xl
                        md:text-7xl
                        font-serif
                        mt-3
                    "
                >
                    Complete Looks
                </h1>

                <p
                    className="
                        text-sm
                        text-gray-500
                        max-w-xl
                        mt-5
                        leading-relaxed
                    "
                >
                    Explore complete outfits designed for different
                    styles, occasions and personalities.
                </p>

            </section>


            {/* ================= FILTER BAR ================= */}

            <section className="px-6 md:px-10">

                <div
                    className="
                        border-y
                        border-gray-200
                        py-5
                        flex
                        flex-col
                        lg:flex-row
                        gap-5
                        lg:items-center
                        lg:justify-between
                    "
                >

                    {/* GENDER */}

                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => setGender("all")}
                            className={`
                                px-5
                                py-2
                                rounded-full
                                text-sm
                                border
                                transition-all
                                duration-300
                                ${
                                    gender === "all"
                                        ? "bg-black text-white border-black"
                                        : "border-gray-300 hover:border-black"
                                }
                            `}
                        >
                            All
                        </button>


                        <button
                            onClick={() => setGender("men")}
                            className={`
                                px-5
                                py-2
                                rounded-full
                                text-sm
                                border
                                transition-all
                                duration-300
                                ${
                                    gender === "men"
                                        ? "bg-black text-white border-black"
                                        : "border-gray-300 hover:border-black"
                                }
                            `}
                        >
                            Men
                        </button>


                        <button
                            onClick={() => setGender("women")}
                            className={`
                                px-5
                                py-2
                                rounded-full
                                text-sm
                                border
                                transition-all
                                duration-300
                                ${
                                    gender === "women"
                                        ? "bg-black text-white border-black"
                                        : "border-gray-300 hover:border-black"
                                }
                            `}
                        >
                            Women
                        </button>

                    </div>


                    {/* SEARCH + SORT */}

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            gap-3
                        "
                    >

                        {/* SEARCH */}

                        <form
                            onSubmit={handleSearch}
                            className="
                                flex
                                border
                                border-gray-300
                                rounded-full
                                overflow-hidden
                            "
                        >

                            <input
                                type="text"
                                placeholder="Search outfits..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                className="
                                    outline-none
                                    px-5
                                    py-2
                                    text-sm
                                    w-48
                                    md:w-64
                                "
                            />

                            <button
                                type="submit"
                                className="
                                    px-5
                                    text-sm
                                    bg-black
                                    text-white
                                    hover:bg-gray-800
                                    transition-colors
                                "
                            >
                                Search
                            </button>

                        </form>


                        {/* SORT */}

                        <select
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value)
                            }
                            className="
                                border
                                border-gray-300
                                rounded-full
                                px-5
                                py-2
                                text-sm
                                outline-none
                                bg-white
                                cursor-pointer
                            "
                        >
                            <option value="newest">
                                Newest
                            </option>

                            <option value="price_asc">
                                Price: Low to High
                            </option>

                            <option value="price_desc">
                                Price: High to Low
                            </option>
                        </select>

                    </div>

                </div>

            </section>


            {/* ================= PRODUCT COUNT ================= */}

            <div className="px-6 md:px-10 pt-8">

                <p className="text-sm text-gray-400">
                    {loading
                        ? "Loading outfits..."
                        : `${products.length} outfits`}
                </p>

            </div>


            {/* ================= PRODUCTS ================= */}

            <section className="px-6 md:px-10 py-8">

                {loading ? (

                    <div
                        className="
                            min-h-[300px]
                            flex
                            items-center
                            justify-center
                            text-gray-400
                        "
                    >
                        Loading collection...
                    </div>

                ) : products.length === 0 ? (

                    <div
                        className="
                            min-h-[300px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                        "
                    >

                        <h2 className="text-2xl font-serif">
                            No outfits found
                        </h2>

                        <p className="text-sm text-gray-400 mt-2">
                            Try another search or category.
                        </p>

                    </div>

                ) : (

                    <div
                        className="
                            grid
                            grid-cols-2
                            md:grid-cols-3
                            lg:grid-cols-4
                            gap-x-4
                            gap-y-12
                        "
                    >

                        {products.map((product) => (

                            <Link
                                href={`/products/${product._id}`}
                                key={product._id}
                                className="group"
                            >

                                {/* IMAGE */}

                                <div
                                    className="
                                        relative
                                        aspect-[3/4]
                                        rounded-2xl
                                        overflow-hidden
                                        bg-gray-100
                                    "
                                >

                                    {product.images?.[0] ? (

                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="
                                                w-full
                                                h-full
                                                object-cover
                                                transition-transform
                                                duration-700
                                                ease-out
                                                group-hover:scale-105
                                            "
                                        />

                                    ) : (

                                        <div
                                            className="
                                                w-full
                                                h-full
                                                flex
                                                items-center
                                                justify-center
                                                text-gray-400
                                            "
                                        >
                                            {product.name}
                                        </div>

                                    )}


                                    {/* HOVER OVERLAY */}

                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            bg-black
                                            opacity-0
                                            group-hover:opacity-20
                                            transition-opacity
                                            duration-500
                                        "
                                    />


                                    {/* VIEW OUTFIT */}

                                    <div
                                        className="
                                            absolute
                                            bottom-5
                                            left-1/2
                                            -translate-x-1/2
                                            translate-y-3
                                            opacity-0
                                            group-hover:translate-y-0
                                            group-hover:opacity-100
                                            transition-all
                                            duration-500
                                        "
                                    >

                                        <span
                                            className="
                                                bg-white
                                                text-black
                                                px-6
                                                py-3
                                                rounded-full
                                                text-xs
                                                whitespace-nowrap
                                                shadow-xl
                                            "
                                        >
                                            View Outfit
                                        </span>

                                    </div>

                                </div>


                                {/* PRODUCT DETAILS */}

                                <div className="flex justify-between mt-4">

                                    <div>

                                        <h2
                                            className="
                                                text-sm
                                                font-medium
                                            "
                                        >
                                            {product.name}
                                        </h2>

                                        <p
                                            className="
                                                text-xs
                                                text-gray-400
                                                mt-1
                                                capitalize
                                            "
                                        >
                                            {product.gender} collection
                                        </p>

                                    </div>


                                    <p className="text-sm">
                                        ₹{product.price}
                                    </p>

                                </div>

                            </Link>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}


/*
 * The page itself does NOT call useSearchParams().
 * This allows Next.js to prerender the route safely.
 */
export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-white text-black flex items-center justify-center">
                    <div className="text-gray-400">
                        Loading collection...
                    </div>
                </main>
            }
        >
            <ProductsContent />
        </Suspense>
    );
}