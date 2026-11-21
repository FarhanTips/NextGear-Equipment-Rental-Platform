"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Cog, Moon, Package, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import UserInfo from "./userInfo";

const subscribe = (callback: () => void) => {
    window.addEventListener("theme-change", callback);
    return () => window.removeEventListener("theme-change", callback);
};

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

const persistTheme = (dark: boolean) => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.cookie = `theme=${dark ? "dark" : "light"}; path=/; max-age=31536000; samesite=lax`;
};

const NavBar = () => {
    const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const pathname = usePathname();

    useEffect(() => {
        if (localStorage.getItem("theme") === "dark" && !document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.add("dark");
            persistTheme(true);
            window.dispatchEvent(new Event("theme-change"));
        }
    }, []);

    const toggleTheme = () => {
        const next = !dark;
        document.documentElement.classList.toggle("dark", next);
        persistTheme(next);
        window.dispatchEvent(new Event("theme-change"));
    };

    const browseActive = pathname === "/upcoming";

    return (
        <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-white/85 shadow-sm shadow-stone-900/5 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-orange-500/50 before:to-transparent dark:border-white/10 dark:bg-stone-950/85 dark:shadow-black/20">

            {/* Main bar */}
            <div className="mx-auto grid h-16 w-11/12 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 md:h-20">

                {/* Brand */}
                <Link href="/" className="group flex items-center gap-2.5 justify-self-start">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-orange-500 via-amber-500 to-yellow-400 text-white shadow-lg shadow-orange-500/30 transition-shadow duration-300 group-hover:shadow-orange-500/50 md:size-10">
                        <Cog
                            className="size-5 transition-transform duration-500 group-hover:rotate-90 motion-reduce:transform-none"
                            strokeWidth={2.25}
                            aria-hidden="true"
                        />
                    </span>

                    <span className="flex flex-col">
                        <span className="text-lg leading-none font-extrabold tracking-tight text-stone-900 md:text-xl dark:text-white">
                            Next
                            <span className="bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-300">
                                Gear
                            </span>
                        </span>
                        <span className="mt-1.5 hidden text-[9px] font-semibold tracking-[0.22em] text-stone-400 uppercase sm:block dark:text-stone-500">
                            Equipment Rentals
                        </span>
                    </span>
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden items-center justify-center md:flex" aria-label="Main navigation">
                    <Link
                        href="/upcoming"
                        aria-current={browseActive ? "page" : undefined}
                        className={cn(
                            "group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                            browseActive
                                ? "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300"
                                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-white/5 dark:hover:text-white"
                        )}
                    >
                        <Package
                            className={cn(
                                "size-4 transition-transform duration-300 group-hover:-rotate-12",
                                browseActive
                                    ? "text-orange-600 dark:text-orange-300"
                                    : "text-stone-400 dark:text-stone-500"
                            )}
                            aria-hidden="true"
                        />
                        Browse Gear
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
                        title={dark ? "Switch to light theme" : "Switch to dark theme"}
                        className="group size-9 cursor-pointer rounded-full border border-stone-200/80 bg-white/70 text-stone-600 shadow-sm transition-all duration-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 sm:size-10 dark:border-white/10 dark:bg-white/5 dark:text-stone-300 dark:hover:border-orange-400/30 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
                    >
                        <span className="relative grid size-4 place-items-center">
                            <Sun
                                className={cn(
                                    "absolute size-4 transition-all duration-300",
                                    dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                                )}
                                aria-hidden="true"
                            />
                            <Moon
                                className={cn(
                                    "absolute size-4 transition-all duration-300",
                                    dark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                                )}
                                aria-hidden="true"
                            />
                        </span>
                    </Button>

                    <span className="mx-0.5 hidden h-6 w-px bg-stone-200 sm:block dark:bg-white/10" aria-hidden="true" />

                    <UserInfo />
                </div>
            </div>

            {/* Mobile navigation */}
            <div className="border-t border-stone-200/70 bg-white/40 sm:hidden dark:border-white/5 dark:bg-white/2">
                <div className="mx-auto flex w-11/12 max-w-7xl items-center justify-between gap-3 py-2">
                    <Link
                        href="/upcoming"
                        aria-current={browseActive ? "page" : undefined}
                        className="group flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700 ring-1 ring-orange-100 transition-colors duration-200 hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/20 dark:hover:bg-orange-500/20"
                    >
                        <Package className="size-4" aria-hidden="true" />
                        Browse Gear
                        <ArrowRight
                            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </Link>

                    <span className="text-[10px] font-semibold tracking-[0.18em] text-stone-400 uppercase dark:text-stone-500">
                        Rent · Use · Return
                    </span>
                </div>
            </div>
        </header>
    );
};

export default NavBar;
