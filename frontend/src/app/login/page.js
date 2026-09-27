"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
 const { refreshUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

           await refreshUser();

router.push("/");
router.refresh();

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">

            <div className="w-full max-w-md">

                {/* BRAND */}

                <Link
                    href="/"
                    className="
                        block
                        text-center
                        text-2xl
                        font-serif
                        tracking-wide
                        mb-12
                    "
                >
                    ✦ TAJVERSE
                </Link>


                <div className="text-center">

                    <p className="
                        text-xs
                        uppercase
                        tracking-[0.3em]
                        text-gray-400
                    ">
                        Welcome back
                    </p>

                    <h1 className="
                        text-4xl
                        md:text-5xl
                        font-serif
                        mt-3
                    ">
                        Sign In
                    </h1>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleLogin}
                    className="mt-10 space-y-5"
                >

                    <div>

                        <label className="text-sm">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="you@example.com"
                            required
                            className="
                                w-full
                                mt-2
                                px-5
                                py-4
                                border
                                border-gray-300
                                rounded-xl
                                outline-none
                                focus:border-black
                                transition-colors
                            "
                        />

                    </div>


                    <div>

                        <label className="text-sm">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="••••••••"
                            required
                            className="
                                w-full
                                mt-2
                                px-5
                                py-4
                                border
                                border-gray-300
                                rounded-xl
                                outline-none
                                focus:border-black
                                transition-colors
                            "
                        />

                    </div>


                    {error && (

                        <p className="text-sm text-red-500">
                            {error}
                        </p>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-black
                            text-white
                            py-4
                            rounded-full
                            text-sm
                            hover:bg-gray-800
                            transition-colors
                            disabled:bg-gray-300
                        "
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>


                {/* REGISTER */}

                <p className="
                    text-center
                    text-sm
                    text-gray-500
                    mt-8
                ">
                    Don't have an account?{" "}

                    <Link
                        href="/register"
                        className="
                            text-black
                            underline
                            underline-offset-4
                        "
                    >
                        Create one
                    </Link>
                </p>

            </div>

        </main>
    );
}