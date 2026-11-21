
import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Cog, Sparkles } from "lucide-react";

type AuthFeature = {
    icon: LucideIcon;
    title: string;
    description: string;
};

type AuthShellProps = {
    children: ReactNode;
    eyebrow: string;
    title: ReactNode;
    description: string;
    features: AuthFeature[];
    highlight: ReactNode;
};

const AuthShell = ({
    children,
    eyebrow,
    title,
    description,
    features,
    highlight,
}: AuthShellProps) => {
    return (
        <section className="min-h-[calc(100svh-6.5rem)] bg-stone-50 px-3 py-5 sm:min-h-[calc(100svh-4rem)] sm:px-5 sm:py-8 md:px-6 lg:px-8 lg:py-10 xl:py-12">
            <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_30px_80px_-40px_rgba(28,25,23,0.35)] sm:rounded-3xl lg:min-h-160 lg:grid-cols-[1.05fr_1fr] lg:rounded-[2rem]">

                {/* Mobile hero */}
                <div className="relative overflow-hidden bg-stone-950 px-5 py-6 text-white sm:px-7 sm:py-8 md:px-9 lg:hidden">
                    <div
                        className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-orange-500/25 blur-3xl sm:size-48"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] bg-size-[20px_20px] mask-[linear-gradient(to_bottom,black,transparent)]"
                        aria-hidden="true"
                    />

                    <span className="relative inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold tracking-[0.16em] text-orange-300 uppercase sm:text-[10px] sm:tracking-[0.18em]">
                        <Sparkles className="size-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{eyebrow}</span>
                    </span>

                    <p className="relative mt-3 text-xl leading-tight font-extrabold tracking-tight sm:mt-4 sm:text-2xl md:text-3xl">
                        {title}
                    </p>

                    <p className="relative mt-2 max-w-xl text-xs leading-relaxed text-stone-400 sm:text-sm">
                        {description}
                    </p>
                </div>

                {/* Desktop brand panel */}
                <aside className="relative hidden min-w-0 overflow-hidden bg-stone-950 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10 2xl:p-12">
                    <div
                        className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-orange-500/25 blur-3xl"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-amber-400/15 blur-3xl"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black,transparent_90%)]"
                        aria-hidden="true"
                    />

                    <Cog
                        className="pointer-events-none absolute -right-20 -bottom-20 size-64 text-white/3 xl:size-80"
                        strokeWidth={1}
                        aria-hidden="true"
                    />

                    <Link href="/" className="relative flex w-fit items-center gap-2.5">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-orange-500 via-amber-500 to-yellow-400 text-white shadow-lg shadow-orange-500/30 xl:size-10">
                            <Cog className="size-5" strokeWidth={2.25} aria-hidden="true" />
                        </span>

                        <span className="flex min-w-0 flex-col">
                            <span className="text-lg leading-none font-extrabold tracking-tight xl:text-xl">
                                Next
                                <span className="bg-linear-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                                    Gear
                                </span>
                            </span>

                            <span className="mt-1.5 text-[8px] font-semibold tracking-[0.2em] text-stone-400 uppercase xl:text-[9px]">
                                Equipment Rentals
                            </span>
                        </span>
                    </Link>

                    <div className="relative my-6 min-w-0 xl:my-8">
                        <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold tracking-[0.15em] text-orange-300 uppercase xl:text-[10px] xl:tracking-[0.18em]">
                            <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">{eyebrow}</span>
                        </span>

                        <h1 className="mt-4 text-2xl leading-[1.15] font-extrabold tracking-tight xl:mt-5 xl:text-3xl 2xl:text-[2.25rem]">
                            {title}
                        </h1>

                        <p className="mt-3 max-w-sm text-xs leading-relaxed text-stone-300 xl:text-sm">
                            {description}
                        </p>

                        <ul className="mt-6 space-y-3 xl:mt-7 xl:space-y-3.5">
                            {features.map(
                                ({
                                    icon: Icon,
                                    title: featureTitle,
                                    description: featureDescription,
                                }) => (
                                    <li
                                        key={featureTitle}
                                        className="flex min-w-0 items-start gap-3"
                                    >
                                        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-orange-300 xl:size-8">
                                            <Icon className="size-4" aria-hidden="true" />
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block text-xs font-semibold text-white xl:text-sm">
                                                {featureTitle}
                                            </span>

                                            <span className="block text-[11px] leading-relaxed text-stone-400 xl:text-xs">
                                                {featureDescription}
                                            </span>
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="relative min-w-0">{highlight}</div>
                </aside>

                {/* Form panel */}
                <div className="flex min-w-0 items-center justify-center px-5 py-7 sm:px-8 sm:py-9 md:px-10 lg:px-8 lg:py-10 xl:px-12 2xl:px-14">
                    <div className="w-full min-w-0 max-w-md">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthShell;
