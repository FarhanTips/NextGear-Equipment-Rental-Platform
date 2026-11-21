
"use client"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { SyntheticEvent } from "react"
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast"
import AuthShell from "@/components/shared/authShell"
import { ArrowLeft, ArrowRight, CalendarCheck, Heart, Lock, Mail, Package, ShieldCheck } from "lucide-react"

const inputClassName = "h-10 w-full min-w-0 rounded-xl border-stone-200 bg-stone-50/60 px-3 pl-10 text-xs text-stone-900 transition-colors placeholder:text-stone-400 focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-100 sm:h-11 sm:px-3.5 sm:pl-10 sm:text-sm dark:border-stone-200 dark:bg-stone-50 dark:text-stone-900 dark:placeholder:text-stone-400"

const signInFeatures = [
    { icon: CalendarCheck, title: "Bookings at a glance", description: "Pickups and returns, all in one place." },
    { icon: Heart, title: "Saved gear", description: "Rebook your favourite tools in seconds." },
    { icon: ShieldCheck, title: "Protected rentals", description: "Verified owners and secure payments." },
];

const upcomingPickup = (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:rounded-2xl sm:p-4">
        <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-stone-300 sm:text-xs">Upcoming pickup</span>
            <span className="shrink-0 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-300 sm:text-[10px]">
                Confirmed
            </span>
        </div>

        <div className="mt-3 flex min-w-0 items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-orange-500/15 text-orange-300 sm:size-9">
                <Package className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white sm:text-sm">Rotary hammer drill</p>
                <p className="truncate text-[10px] text-stone-400 sm:text-[11px]">Sat · 9:00 AM · 2.1 km away</p>
            </div>
        </div>
    </div>
);

export default function LogInPage() {

    const router = useRouter();

    const handleLogIn = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const user: Record<string, string> = {};

        formData.forEach((value, key) => {
            user[key] = value.toString();
        });

        console.log("data from form", user)

        const { data, error } = await authClient.signIn.email({
            email: user.email,
            password: user.password,
        });

        console.log("data", data);
        console.log("error", error);

        if (error) {
            toast.add({
                type: "error",
                description: error.message ?? "Something went wrong!",
                priority: "high",
            })
            return;
        }

        toast.add({
            type: "success",
            description: "Logged in successfully!",
        })
        router.push("/");
    };

    const handleGoogleSignIn = async () => {
        const { error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
            errorCallbackURL: "/sign-up",
        });
        console.log("Check rror", error);
        if (error) {
            toast.add({
                type: "error",
                description: error.message ?? "Something went wrong!",
            })
        }
    };

    return (
        <AuthShell
            eyebrow="Good to see you"
            title={
                <>
                    Pick up right
                    <br />
                    <span className="bg-linear-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                        where you left off.
                    </span>
                </>
            }
            description="Your bookings, saved gear, and trusted owners are all waiting."
            features={signInFeatures}
            highlight={upcomingPickup}
        >
            {/* Heading */}
            <div className="mb-6 sm:mb-8">
                <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] text-orange-700 uppercase ring-1 ring-orange-100 sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                    <span className="size-1.5 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
                    Welcome back
                </span>

                <h2 className="mt-3 text-xl leading-tight font-extrabold tracking-tight text-stone-900 sm:mt-4 sm:text-2xl md:text-3xl">
                    Sign in to NextGear
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-stone-500 sm:text-sm">
                    Use your email or Google account to continue.
                </p>
            </div>

            <form onSubmit={handleLogIn}>
                <FieldGroup className="gap-3.5 sm:gap-4">

                    <Field>
                        <Button
                            onClick={handleGoogleSignIn}
                            variant="outline"
                            type="button"
                            className="h-10 w-full cursor-pointer gap-2 rounded-xl border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-stone-900 sm:h-11 sm:gap-2.5 sm:px-4 sm:text-sm dark:border-stone-200 dark:bg-white dark:text-stone-700 dark:hover:bg-orange-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-3.5 shrink-0 sm:size-4" aria-hidden="true">
                                <path
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    fill="currentColor"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </Field>

                    <FieldSeparator className="*:data-[slot=field-separator-content]:bg-white">
                        <span className="text-[10px] font-medium text-stone-400 sm:text-xs">or continue</span>
                    </FieldSeparator>

                    <Field>
                        <FieldLabel htmlFor="email" className="text-xs font-semibold text-stone-700 sm:text-sm">
                            Email
                        </FieldLabel>
                        <div className="relative">
                            <Mail
                                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                                aria-hidden="true"
                            />
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                required
                                className={inputClassName}
                            />
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password" className="text-xs font-semibold text-stone-700 sm:text-sm">
                            Password
                        </FieldLabel>
                        <div className="relative">
                            <Lock
                                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                                aria-hidden="true"
                            />
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                minLength={6}
                                className={inputClassName}
                            />
                        </div>
                    </Field>

                    <Field className="pt-1">
                        <Button
                            type="submit"
                            className="h-10 w-full cursor-pointer gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-3 text-xs font-bold text-white shadow-lg shadow-orange-600/25 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:h-11 sm:px-4 sm:text-sm"
                        >
                            Sign in
                            <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                        </Button>

                        <FieldDescription className="text-center text-xs leading-relaxed text-stone-500 sm:text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/sign-up" className="font-semibold text-orange-600 underline-offset-4 hover:text-orange-700 hover:underline">
                                Create one
                            </Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </form>

            <div className="mt-6 text-center sm:mt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-400 transition-colors hover:text-orange-600 sm:text-xs"
                >
                    <ArrowLeft className="size-3.5" aria-hidden="true" />
                    Back to homepage
                </Link>
            </div>
        </AuthShell>
    )
}
