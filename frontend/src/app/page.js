"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

// Replace these paths with your five transparent PNG images.
// Place the files inside frontend/public/models/.
const heroModels = [
  "/models/model-1.png",
  "/models/model-2.png",
  "/models/model-3.png",
  "/models/model-4.png",
  "/models/model-5.png",
];

const clamp = (value, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const phase = (progress, start, end) =>
  clamp((progress - start) / (end - start));

const smooth = (value) =>
  value * value * (3 - 2 * value);

const modelPositions = [
  { x: -2, y: 8, rotate: -3, scale: 0.86 },
  { x: -1, y: 15, rotate: 3, scale: 0.96 },
  { x: 0, y: 28, rotate: 0, scale: 1.12 },
  { x: 1, y: 15, rotate: -3, scale: 0.96 },
  { x: 2, y: 8, rotate: 3, scale: 0.86 },
];

export default function Home() {
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const heroRef = useRef(null);
  const progressRef = useRef(0);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const data = await apiFetch("/products");

        if (mounted) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================
  // REDUCED MOTION
  // ==========================================

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updatePreference = () =>
      setReducedMotion(media.matches);

    updatePreference();

    media.addEventListener?.("change", updatePreference);

    return () =>
      media.removeEventListener?.(
        "change",
        updatePreference
      );
  }, []);

  // ==========================================
  // SMOOTH SCROLL PROGRESS
  // ==========================================

  useEffect(() => {
    let frame = null;
    let targetProgress = 0;

    // Get the actual scroll position.
    const readScroll = () => {
      if (!heroRef.current) return;

      const rect =
        heroRef.current.getBoundingClientRect();

      const distance =
        heroRef.current.offsetHeight -
        window.innerHeight;

      if (distance <= 0) return;

      targetProgress = clamp(
        -rect.top / distance
      );
    };

    // Smoothly follow the actual scroll position.
    const animateScroll = () => {
      const difference =
        targetProgress - progressRef.current;

      /*
       * CONSTANT SMOOTHING
       *
       * The smoothing does NOT increase when
       * the user scrolls faster.
       *
       * This keeps the animation feeling consistent:
       *
       * slow scroll  -> smooth
       * fast scroll  -> smooth
       */
      const smoothing = 0.08;

      progressRef.current +=
        difference * smoothing;

      // Stop tiny floating-point movements.
      if (Math.abs(difference) < 0.00005) {
        progressRef.current = targetProgress;
      }

      setProgress(progressRef.current);

      if (
        Math.abs(
          targetProgress -
            progressRef.current
        ) > 0.00005
      ) {
        frame =
          requestAnimationFrame(
            animateScroll
          );
      } else {
        frame = null;
      }
    };

    const onScroll = () => {
      readScroll();

      // Only one animation loop at a time.
      if (frame === null) {
        frame =
          requestAnimationFrame(
            animateScroll
          );
      }
    };

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      onScroll
    );

    // Initial position.
    readScroll();

    progressRef.current =
      targetProgress;

    setProgress(targetProgress);

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll
      );

      window.removeEventListener(
        "resize",
        onScroll
      );

      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  // ==========================================
  // ANIMATION TIMELINE
  // ==========================================

  const p =
    reducedMotion
      ? 1
      : progress;

  // 0.04 - 0.20: text appears
  const textReveal =
    smooth(
      phase(
        p,
        0.04,
        0.20
      )
    );

  // 0.16 - 0.38: models appear and spread out
  const modelsReveal =
    smooth(
      phase(
        p,
        0.16,
        0.38
      )
    );

  // 0.43 - 0.68: background becomes white
  const whiteReveal =
    smooth(
      phase(
        p,
        0.43,
        0.68
      )
    );

  // 0.57 - 0.76: card backgrounds disappear
  const cardsDisappear =
    smooth(
      phase(
        p,
        0.57,
        0.76
      )
    );

  // 0.76 - 1: models move horizontally
  const horizontalMove =
    smooth(
      phase(
        p,
        0.76,
        1
      )
    );

  // ==========================================
  // BACKGROUND
  // ==========================================

  const bgValue =
    Math.round(
      15 +
        whiteReveal * 240
    );

  const heroBackground =
    `rgb(${bgValue}, ${bgValue}, ${bgValue})`;

  const textValue =
    Math.round(
      255 -
        whiteReveal * 240
    );

  const heroText =
    `rgb(${textValue}, ${textValue}, ${textValue})`;

  const featuredProducts =
    products.slice(0, 5);

  return (
    <main className="bg-white text-black overflow-x-clip">

      {/* ====================================== */}
      {/* FIXED NAVBAR */}
      {/* ====================================== */}

      <nav
        className="fixed top-0 left-0 right-0 z-[100]
                   px-5 md:px-10 py-5
                   flex items-center justify-between"
        style={{
          color: heroText,
          mixBlendMode: "normal",
        }}
      >
        <Link
          href="/"
          className="font-serif text-xl md:text-2xl
                     tracking-wide"
        >
          ✦ TAJVERSE
        </Link>

        <div className="flex items-center gap-2 md:gap-3">

          <Link
            href="/products"
            aria-label="Shop"
            className="w-9 h-9 md:w-11 md:h-11
                       rounded-full border border-current
                       flex items-center justify-center
                       hover:opacity-60 transition-opacity"
          >
            <span className="text-lg">
              ⌕
            </span>
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className="w-9 h-9 md:w-11 md:h-11
                       rounded-full border border-current
                       flex items-center justify-center
                       hover:opacity-60 transition-opacity"
          >
            <span className="text-sm">
              ♧
            </span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">

              <Link
                href=""
                className="hidden sm:inline-flex
                           border border-current rounded-full
                           px-5 py-3 text-xs"
              >
                {user.name}
              </Link>

              <button
                onClick={logout}
                className="rounded-full border border-current
                           px-4 py-3 text-xs"
              >
                Logout
              </button>

            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-current
                         px-5 py-3 text-xs
                         hover:opacity-60 transition-opacity"
            >
              Sign In
            </Link>
          )}

        </div>
      </nav>

      {/* ====================================== */}
      {/* SCROLL HERO */}
      {/* ====================================== */}

      <section
        ref={heroRef}
        className="relative h-[500vh]"
      >
        <div
          className="sticky top-0 w-full h-screen
                     overflow-hidden"
          style={{
            backgroundColor:
              heroBackground,
            color: heroText,
          }}
        >

          {/* HERO DESCRIPTION */}

          <div
            className="absolute z-20
                       left-5 md:left-10
                       top-[16%] md:top-[19%]
                       max-w-[180px] md:max-w-[330px]"
            style={{
              opacity:
                textReveal *
                (1 - cardsDisappear),

              transform:
                `translateY(${
                  (1 - textReveal) *
                  25
                }px)`,
            }}
          >
            <p
              className="text-[9px] md:text-xs
                         leading-relaxed"
            >
              At Tajverse, we create looks that move
              with grace and speak with style.
              From timeless classics to modern
              silhouettes — designed to make every
              entrance unforgettable.
            </p>
          </div>

          {/* HERO HEADING */}

          <div
            className="absolute z-20
                       right-5 md:right-10
                       top-[17%] md:top-[18%]
                       text-right"
            style={{
              opacity:
                textReveal *
                (1 - cardsDisappear),

              transform:
                `translateY(${
                  (1 - textReveal) *
                  35
                }px)`,
            }}
          >
            <h1
              className="font-serif uppercase
                         text-[22px] sm:text-3xl
                         md:text-5xl lg:text-6xl
                         leading-[0.95] tracking-wide"
            >
              Designed to make
              <br />
              an entrance.
            </h1>
          </div>

          {/* ====================================== */}
          {/* FIVE EDITORIAL MODELS */}
          {/* ====================================== */}

          <div
            className="absolute inset-x-0
                       top-[34%] md:top-[32%]
                       h-[55vh] md:h-[65vh]"
          >
            {heroModels.map(
              (image, index) => {
                const position =
                  modelPositions[index];

                // Initial cards gather near the center.
                // Then spread into five positions.
                const spread =
                  modelsReveal *
                  position.x;

                // Each card's final horizontal location.
                const finalX =
                  50 +
                  spread * 20;

                const offsetX =
                  horizontalMove *
                  -index *
                  4;

                const x =
                  finalX +
                  offsetX;

                const y =
                  (1 - modelsReveal) *
                    100 +
                  position.y *
                    modelsReveal;

                const rotation =
                  position.rotate *
                  modelsReveal *
                  (1 - cardsDisappear);

                const cardOpacity =
                  modelsReveal *
                  (1 - cardsDisappear);

                const modelOpacity =
                  modelsReveal;

                return (
                  <div
                    key={image}
                    className="absolute top-1/2
                               w-[38vw] sm:w-[26vw]
                               md:w-[18vw] lg:w-[17vw]
                               h-[38vh] md:h-[54vh]"
                    style={{
                      left: `${x}%`,

                      zIndex:
                        index === 2
                          ? 30
                          : 20 - index,

                      opacity:
                        modelOpacity,

                      /*
                       * GPU-friendly transforms
                       * for smoother movement.
                       */
                      transform: `
                        translate3d(
                          -50%,
                          -50%,
                          0
                        )
                        translate3d(
                          0,
                          ${y}px,
                          0
                        )
                        rotate(
                          ${rotation}deg
                        )
                        scale(
                          ${position.scale}
                        )
                      `,

                      willChange:
                        "transform, opacity",
                    }}
                  >

                    {/* CARD BACKGROUND */}

                    <div
                      className="absolute inset-0
                                 rounded-2xl md:rounded-3xl
                                 bg-[#d8dce0]
                                 shadow-xl overflow-hidden"
                      style={{
                        opacity:
                          cardOpacity,

                        transform:
                          `scale(${
                            1 -
                            cardsDisappear *
                              0.05
                          })`,
                      }}
                    />

                    {/* TRANSPARENT MODEL */}

                    <img
                      src={image}
                      alt={`Tajverse editorial model ${index + 1}`}
                      className="absolute inset-0
                                 w-full h-full
                                 object-contain
                                 object-bottom
                                 pointer-events-none"
                      style={{
                        filter:
                          `drop-shadow(
                            0 10px 12px rgba(
                              0,
                              0,
                              0,
                              ${
                                0.12 *
                                (1 -
                                  cardsDisappear)
                              }
                            )
                          )`,
                      }}
                    />

                  </div>
                );
              }
            )}
          </div>

          {/* SCROLL INDICATOR */}

          <div
            className="absolute bottom-8
                       left-5 md:left-10
                       text-[10px] uppercase
                       tracking-[0.3em]"
            style={{
              opacity:
                1 -
                phase(
                  p,
                  0.82,
                  0.98
                ),
            }}
          >
            Scroll to explore ↓
          </div>

          {/* COLLECTION LABEL */}

          <div
            className="absolute bottom-8
                       right-5 md:right-10
                       text-right"
            style={{
              opacity:
                phase(
                  p,
                  0.72,
                  0.9
                ),
            }}
          >
            <p
              className="text-[10px] uppercase
                         tracking-[0.3em]"
            >
              The Collection
            </p>

            <p
              className="font-serif
                         text-2xl md:text-4xl
                         mt-2"
            >
              TAJVERSE
            </p>
          </div>

        </div>
      </section>

      {/* ====================================== */}
      {/* HORIZONTAL COLLECTION */}
      {/* ====================================== */}

      <section
        className="bg-white py-14 md:py-20"
      >
        <div
          className="px-5 md:px-10
                     flex justify-between
                     items-end mb-10"
        >
          <div>

            <p
              className="text-[10px] uppercase
                         tracking-[0.3em]
                         text-neutral-500"
            >
              Discover
            </p>

            <h2
              className="font-serif text-4xl
                         md:text-6xl mt-3"
            >
              The Collection
            </h2>

          </div>

          <Link
            href="/products"
            className="text-xs uppercase
                       tracking-widest
                       border-b border-black pb-2"
          >
            View All
          </Link>
        </div>

        <div
          className="flex gap-3 md:gap-5
                     overflow-x-auto
                     px-5 md:px-10 pb-8
                     snap-x snap-mandatory"
        >
          {featuredProducts.map(
            (product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group shrink-0
                           w-[58vw] sm:w-[35vw]
                           md:w-[22vw]
                           snap-start"
              >

                <div
                  className="relative aspect-[3/4]
                             overflow-hidden
                             bg-neutral-100"
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full
                                 object-cover
                                 transition-transform
                                 duration-700
                                 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full
                                 flex items-center
                                 justify-center
                                 text-neutral-400"
                    >
                      No image
                    </div>
                  )}

                  <span
                    className="absolute top-3 right-3
                               bg-white/80 rounded-full
                               w-8 h-8
                               flex items-center
                               justify-center"
                  >
                    ♡
                  </span>
                </div>

                <div
                  className="flex justify-between
                             items-start mt-4
                             gap-3"
                >
                  <div>

                    <h3
                      className="font-medium text-sm"
                    >
                      {product.name}
                    </h3>

                    <p
                      className="text-xs
                                 text-neutral-500
                                 capitalize mt-1"
                    >
                      {product.gender} Collection
                    </p>

                  </div>

                  <span
                    className="text-sm
                               whitespace-nowrap"
                  >
                    ₹
                    {product.price?.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>
              </Link>
            )
          )}

          {!loading &&
            products.length === 0 && (
              <p
                className="text-neutral-500
                           text-sm"
              >
                The collection is coming soon.
              </p>
            )}

        </div>
      </section>

      {/* ====================================== */}
      {/* LATEST LOOKS */}
      {/* ====================================== */}

      <section
        className="bg-white
                   px-5 md:px-10
                   py-20 md:py-28"
      >
        <div
          className="flex items-end
                     justify-between mb-10"
        >
          <div>

            <p
              className="text-xs uppercase
                         tracking-[0.3em]
                         text-neutral-400"
            >
              Explore
            </p>

            <h2
              className="font-serif text-4xl
                         md:text-6xl mt-3"
            >
              Latest Looks
            </h2>

          </div>

          <Link
            href="/products"
            className="text-sm
                       border-b border-black pb-1"
          >
            Shop All
          </Link>
        </div>

        <div
          className="grid grid-cols-2
                     md:grid-cols-4
                     gap-x-4 gap-y-12"
        >
          {products
            .slice(0, 8)
            .map((product) => (
              <Link
                href={`/products/${product._id}`}
                key={product._id}
                className="group"
              >

                <div
                  className="aspect-[3/4]
                             overflow-hidden
                             bg-neutral-100
                             rounded-xl"
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full
                                 object-cover
                                 group-hover:scale-105
                                 transition-transform
                                 duration-700"
                    />
                  ) : (
                    <div
                      className="h-full flex
                                 items-center
                                 justify-center
                                 text-neutral-400"
                    >
                      No image
                    </div>
                  )}
                </div>

                <div
                  className="flex justify-between
                             mt-4 gap-3"
                >
                  <div>

                    <h3
                      className="text-sm
                                 font-medium"
                    >
                      {product.name}
                    </h3>

                    <p
                      className="text-xs
                                 text-neutral-400
                                 capitalize mt-1"
                    >
                      {product.gender} Collection
                    </p>

                  </div>

                  <p
                    className="text-sm
                               whitespace-nowrap"
                  >
                    ₹
                    {product.price?.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* ====================================== */}
      {/* EDITORIAL BANNER */}
      {/* ====================================== */}

      <section
        className="min-h-[65vh]
                   bg-[#111]
                   text-white
                   flex items-center
                   justify-center
                   text-center
                   px-6 py-20"
      >
        <div>

          <p
            className="text-xs uppercase
                       tracking-[0.35em]
                       text-neutral-400"
          >
            The Art of Dressing
          </p>

          <h2
            className="font-serif text-5xl
                       md:text-8xl uppercase
                       leading-[0.95] mt-8"
          >
            Make an
            <br />
            entrance.
          </h2>

          <Link
            href="/products"
            className="inline-block mt-10
                       rounded-full border
                       border-white/50
                       px-8 py-4
                       text-xs uppercase
                       tracking-widest
                       hover:bg-white
                       hover:text-black
                       transition-colors"
          >
            Explore Collection
          </Link>

        </div>
      </section>

      {/* ====================================== */}
      {/* FOOTER */}
      {/* ====================================== */}

      <footer
        className="bg-white
                   px-6 md:px-10
                   py-14 border-t"
      >
        <div
          className="flex flex-col
                     md:flex-row
                     justify-between
                     gap-10"
        >

          <div>

            <Link
              href="/"
              className="font-serif text-3xl"
            >
              ✦ TAJVERSE
            </Link>

            <p
              className="text-sm
                         text-neutral-500
                         max-w-xs mt-4"
            >
              Designed for entrances that deserve
              to be remembered.
            </p>

          </div>

          <div
            className="flex gap-14 text-sm"
          >

            <div
              className="flex flex-col gap-4"
            >
              <span
                className="text-neutral-400
                           uppercase
                           text-xs
                           tracking-widest"
              >
                Explore
              </span>

              <Link href="/products">
                Shop
              </Link>

              <Link href="/products?gender=men">
                Men
              </Link>

              <Link href="/products?gender=women">
                Women
              </Link>
            </div>

            <div
              className="flex flex-col gap-4"
            >
              <span
                className="text-neutral-400
                           uppercase
                           text-xs
                           tracking-widest"
              >
                Account
              </span>

              <Link href="/cart">
                Cart
              </Link>
            </div>

          </div>
        </div>

        <div
          className="border-t mt-16 pt-6
                     flex justify-between
                     text-xs text-neutral-400"
        >
          <span>
            © {new Date().getFullYear()} TAJVERSE
          </span>

          <span>
            All Rights Reserved
          </span>
        </div>
      </footer>

    </main>
  );
}