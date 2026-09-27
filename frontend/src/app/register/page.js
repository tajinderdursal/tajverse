"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../../lib/api";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            setSuccess("Account created successfully.");

            setTimeout(() => {
                router.push("/login");
            }, 1000);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-black flex items-center justify-center px-6 py-12">

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


                {/* TITLE */}

                <div className="text-center">

                    <p className="
                        text-xs
                        uppercase
                        tracking-[0.3em]
                        text-gray-400
                    ">
                        Join TAJVERSE
                    </p>

                    <h1 className="
                        text-4xl
                        md:text-5xl
                        font-serif
                        mt-3
                    ">
                        Create Account
                    </h1>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleRegister}
                    className="mt-10 space-y-5"
                >

                    {/* NAME */}

                    <div>

                        <label className="text-sm">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Your name"
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


                    {/* EMAIL */}

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


                    {/* PASSWORD */}

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
                            placeholder="Minimum 6 characters"
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


                    {/* ERROR */}

                    {error && (

                        <p className="text-sm text-red-500">
                            {error}
                        </p>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <p className="text-sm text-green-600">
                            {success}
                        </p>

                    )}


                    {/* SUBMIT */}

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
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>


                {/* LOGIN */}

                <p className="
                    text-center
                    text-sm
                    text-gray-500
                    mt-8
                ">
                    Already have an account?{" "}

                    <Link
                        href="/login"
                        className="
                            text-black
                            underline
                            underline-offset-4
                        "
                    >
                        Sign in
                    </Link>

                </p>

            </div>

        </main>
    );
}