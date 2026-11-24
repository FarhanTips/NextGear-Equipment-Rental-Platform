"use client";

import Link from "next/link";
import { Lock, Home, AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <section className=" py-20 w-10/12 mx-auto">
            <div className="w-full max-w-md mx-auto text-center border border-amber-500 rounded-2xl md:px-6 md:py-10 p-4">
                <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                    <Lock className="size-8" aria-hidden="true" />
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    Access Denied
                </h1>

                <p className="mt-3 max-w-sm mx-auto text-sm leading-relaxed text-stone-500">
                    You don&apos;t have permission to view this page. Please return to the homepage.
                </p>

                <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50/60 p-4">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-orange-100 text-orange-600">
                            <AlertTriangle className="size-4" aria-hidden="true" />
                        </span>
                        <div className="text-left">
                            <h3 className="text-xs font-semibold text-stone-900">Why am I seeing this?</h3>
                            <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-stone-500">
                                <li className="flex items-start gap-1.5">
                                    <span className="shrink-0 text-orange-500">•</span>
                                    You don&apos;t have the permission!
                                </li>
                                <li className="flex items-start gap-1.5">
                                    <span className="shrink-0 text-orange-500">•</span>
                                    Your account doesn&apos;t have the required role
                                </li>
                                <li className="flex items-start gap-1.5">
                                    <span className="shrink-0 text-orange-500">•</span>
                                    The page may be restricted to owners or customers
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <Link
                    href="/"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/25 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                    <Home className="size-4 shrink-0" aria-hidden="true" />
                    Back to Homepage
                </Link>

                <p className="mt-6 text-[11px] text-stone-400">
                    &copy; {new Date().getFullYear()} NextGear. All rights reserved.
                </p>
            </div>
        </section>

    );
}
