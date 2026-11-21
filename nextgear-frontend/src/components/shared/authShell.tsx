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

const AuthShell = ({ children, eyebrow, title, description, features, highlight }: AuthShellProps) => {
    return (
        <section className="min-h-[calc(100vh-6.5rem)] bg-stone-50 px-4 py-8 sm:min-h-[calc(100vh-4rem)] sm:px-6 lg:px-8 lg:py-12">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_30px_80px_-40px_rgba(28,25,23,0.35)] lg:grid lg:min-h-[640px] lg:grid-cols-[1.05fr_1fr]">

                {/* Mobile hero */}
                <div className="relative overflow-hidden bg-stone-950 px-6 py-7 text-white lg:hidden">
                    <div className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-orange-500/25 blur-3xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />

                    <span className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-orange-300 uppercase">
                        <Sparkles className="size-3" aria-hidden="true" />
                        {eyebrow}
                    </span>

                    <p className="relative mt-4 text-2xl leading-tight font-extrabold tracking-tight">
                        {title}
                    </p>
                    <p className="relative mt-2 text-xs leading-relaxed text-stone-400">
                        {description}
                    </p>
                </div>

                {/* Desktop brand panel */}
                <aside className="relative hidden overflow-hidden bg-stone-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
                    <div className="pointer-events-none absolute -top-24 -left-20 size-72 rounded-full bg-orange-500/25 blur-3xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-amber-400/15 blur-3xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" aria-hidden="true" />
                    <Cog className="pointer-events-none absolute -right-20 -bottom-20 size-80 text-white/[0.03]" strokeWidth={1} aria-hidden="true" />

                    <Link href="/" className="relative flex w-fit items-center gap-2.5">
                        <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-orange-500 via-amber-500 to-yellow-400 text-white shadow-lg shadow-orange-500/30">
                            <Cog className="size-5" strokeWidth={2.25} aria-hidden="true" />
                        </span>
                        <span className="flex flex-col">
                            <span className="text-xl leading-none font-extrabold tracking-tight">
                                Next
                                <span className="bg-linear-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                                    Gear
                                </span>
                            </span>
                            <span className="mt-1.5 text-[9px] font-semibold tracking-[0.22em] text-stone-400 uppercase">
                                Equipment Rentals
                            </span>
                        </span>
                    </Link>

                    <div className="relative my-8">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-orange-300 uppercase">
                            <Sparkles className="size-3.5" aria-hidden="true" />
                            {eyebrow}
                        </span>

                        <h1 className="mt-5 text-3xl leading-[1.15] font-extrabold tracking-tight xl:text-[2.25rem]">
                            {title}
                        </h1>

                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-300">
                            {description}
                        </p>

                        <ul className="mt-7 space-y-3.5">
                            {features.map(({ icon: Icon, title: featureTitle, description: featureDescription }) => (
                                <li key={featureTitle} className="flex items-start gap-3">
                                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-orange-300">
                                        <Icon className="size-4" aria-hidden="true" />
                                    </span>
                                    <span>
                                        <span className="block text-sm font-semibold text-white">{featureTitle}</span>
                                        <span className="block text-xs text-stone-400">{featureDescription}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative">{highlight}</div>
                </aside>

                {/* Form panel */}
                <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
                    <div className="w-full max-w-md">{children}</div>
                </div>
            </div>
        </section>
    );
};

export default AuthShell;
