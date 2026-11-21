"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Cog, House, Package, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import UserInfo from "./userInfo";

const NavBar = () => {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Scroll subscription — this is a *correct* use of useEffect
    // (subscribing to an external system: window scroll).
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const homeActive = pathname === "/";
    const browseActive = pathname === "/upcoming";

    const navItems = [
        { href: "/", label: "Home", icon: House, active: homeActive },
        {
            href: "/upcoming",
            label: "All Equipment",
            icon: Package,
            active: browseActive,
        },
    ];

    const closeMobile = () => setMobileOpen(false);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300 ease-out",
                "supports-backdrop-filter:bg-orange-50/55",
                scrolled
                    ? "border-slate-200/80 bg-orange-50/75 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)]"
                    : "border-slate-200/60 bg-orange-50/45"
            )}
        >
            {/* Top accent — animated shimmer */}
            <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
                <div className="h-full w-full bg-linear-to-r from-transparent via-orange-400 to-transparent opacity-70" />
                <div className="absolute inset-0 h-full w-1/3 animate-[shimmer_6s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
            </div>

            <div className="mx-auto flex h-17 w-[92%] max-w-7xl items-center justify-between gap-4 sm:h-18 md:h-19">
                {/* Logo */}
                <Link
                    href="/"
                    onClick={closeMobile}
                    className="group flex shrink-0 items-center gap-2.5 transition-opacity duration-300 hover:opacity-90 sm:gap-3"
                >
                    <div className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-orange-500 via-orange-500 to-amber-400 text-white shadow-[0_4px_14px_-2px_rgba(249,115,22,0.45)] transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:rotate-3 group-hover:shadow-[0_8px_22px_-4px_rgba(249,115,22,0.55)] sm:size-10">
                        <div className="absolute inset-0 bg-linear-to-br from-white/30 via-white/5 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/10 to-transparent" />
                        <Cog className="relative size-4.5 transition-transform duration-700 ease-out group-hover:rotate-180 sm:size-5.25" />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[17px] leading-none font-extrabold text-slate-900 sm:text-[19px] md:text-[20px] tracking-[0.14em]">
                            Next
                            <span className="bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                Gear
                            </span>
                        </span>

                        <span className="mt-1 text-[8px] font-semibold tracking-widest text-slate-400 uppercase sm:mt-1.5 sm:text-[9px] sm:tracking-[0.18em]">
                            Equipment Marketplace
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav
                    className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/60 p-1 shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] md:flex"
                    aria-label="Main navigation"
                >
                    {navItems.map(({ href, label, icon: Icon, active }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "group relative flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 ease-out",
                                active
                                    ? "bg-white text-orange-600 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/60"
                                    : "text-slate-500 hover:bg-white/70 hover:text-slate-900 hover:shadow-sm"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "size-4 transition-all duration-300 ease-out",
                                    active
                                        ? "text-orange-500"
                                        : "text-slate-400 group-hover:-translate-y-0.5 group-hover:text-orange-500"
                                )}
                            />
                            {label}

                            {!active && (
                                <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-orange-400/0 transition-all duration-300 group-hover:ring-orange-400/20" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right side: User actions + Mobile toggle */}
                <div className="flex shrink-0 items-center gap-2">
                    <UserInfo />

                    <button
                        type="button"
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 active:scale-95 md:hidden"
                    >
                        <span className="relative block size-4">
                            <Menu
                                className={cn(
                                    "absolute inset-0 size-4 transition-all duration-300",
                                    mobileOpen
                                        ? "rotate-90 scale-0 opacity-0"
                                        : "rotate-0 scale-100 opacity-100"
                                )}
                                aria-hidden="true"
                            />
                            <X
                                className={cn(
                                    "absolute inset-0 size-4 transition-all duration-300",
                                    mobileOpen
                                        ? "rotate-0 scale-100 opacity-100"
                                        : "-rotate-90 scale-0 opacity-0"
                                )}
                                aria-hidden="true"
                            />
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile navigation — animated drawer */}
            <div
                id="mobile-nav"
                className={cn(
                    "overflow-hidden border-slate-200/60 bg-orange-50/60 transition-all duration-300 ease-out md:hidden",
                    mobileOpen
                        ? "max-h-40 border-t opacity-100"
                        : "max-h-0 border-t-0 opacity-0"
                )}
            >
                <nav
                    className="mx-auto flex w-[92%] items-center gap-2 py-2.5"
                    aria-label="Mobile navigation"
                >
                    {navItems.map(({ href, label, icon: Icon, active }, i) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={closeMobile}
                            aria-current={active ? "page" : undefined}
                            style={{
                                transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms",
                            }}
                            className={cn(
                                "group flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-300 ease-out",
                                mobileOpen
                                    ? "translate-y-0 opacity-100"
                                    : "-translate-y-1 opacity-0",
                                active
                                    ? "bg-linear-to-b from-orange-50 to-orange-50/50 text-orange-600 ring-1 ring-orange-100"
                                    : "text-slate-500 hover:bg-white/60 hover:text-slate-900"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5",
                                    active && "text-orange-500"
                                )}
                            />
                            {label}
                            {active && (
                                <span className="size-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.45)]" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default NavBar;
