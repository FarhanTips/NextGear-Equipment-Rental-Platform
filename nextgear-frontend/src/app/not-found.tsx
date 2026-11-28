import Link from "next/link";
import { Cog, House, Package } from "lucide-react";

const GlobalNotFound = () => {
    return (
        <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-linear-to-b from-orange-50/70 via-white to-stone-50 px-4 py-16 sm:px-6 lg:px-8">
            {/* Soft decorative glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-orange-200/30 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full bg-amber-200/30 blur-3xl"
            />

            <div className="relative w-full max-w-lg">
                {/* Card */}
                <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-orange-950/5">
                    <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                    <div className="px-6 py-10 text-center sm:px-10 sm:py-14">
                        {/* Icon */}
                        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100 sm:size-20">
                            <Package className="size-8 sm:size-10" aria-hidden="true" />
                        </div>

                        {/* Error code */}
                        <p className="mt-6 bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text text-6xl font-extrabold tracking-tighter text-transparent sm:text-7xl">
                            404
                        </p>

                        {/* Eyebrow */}
                        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-orange-700 uppercase ring-1 ring-orange-100 sm:text-[10px] sm:tracking-[0.16em]">
                            <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                            Page not found
                        </span>

                        {/* Heading */}
                        <h1 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                            This page has been rented out.
                        </h1>

                        {/* Description */}
                        <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-stone-500 sm:text-sm">
                            The page you&apos;re looking for may have been moved, renamed, or never existed. Let&apos;s get you back to browsing.
                        </p>

                        {/* Divider */}
                        <div className="mx-auto my-6 h-px w-16 bg-linear-to-r from-transparent via-orange-300 to-transparent" />

                        {/* Buttons */}
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                            <Link
                                href="/"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-4 text-xs font-bold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:h-11 sm:text-sm"
                            >
                                <House className="size-4" aria-hidden="true" />
                                Back to Home
                            </Link>

                            <Link
                                href="/browse-equipments"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-xs font-semibold text-stone-600 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none sm:h-11 sm:text-sm"
                            >
                                <Package className="size-4" aria-hidden="true" />
                                Browse Equipment
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Brand */}
                <div className="mt-6 text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-orange-500 via-orange-500 to-amber-400 text-white shadow-sm">
                            <Cog className="size-4" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-extrabold tracking-[0.14em] text-slate-900">
                            Next
                            <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                Gear
                            </span>
                        </span>
                    </Link>

                    <p className="mt-2 text-[11px] font-medium tracking-wide text-stone-400 sm:text-xs">
                        Equipment Marketplace · Rent what you need, list what you own.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default GlobalNotFound;
