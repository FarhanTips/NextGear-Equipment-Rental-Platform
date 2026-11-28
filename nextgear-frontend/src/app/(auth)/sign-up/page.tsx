

"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { ChangeEvent, SyntheticEvent, useState } from "react"
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast"
import AuthShell from "@/components/shared/authShell"
import { ArrowLeft, ArrowRight, Check, ImagePlus, Lock, Mail, PackagePlus, ShieldCheck, Upload, User, Wallet } from "lucide-react"

const inputClassName = "h-10 w-full min-w-0 rounded-xl border-stone-200 bg-stone-50/60 px-3.5 pl-10 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-100 dark:border-stone-200 dark:bg-stone-50 dark:text-stone-900 dark:placeholder:text-stone-400 sm:h-11 sm:text-sm"

const passwordRules = [
    "Minimum 6 characters",
    "At least one uppercase letter (A-Z)",
    "At least one lowercase letter (a-z)",
]

const signUpFeatures = [
    { icon: PackagePlus, title: "List in minutes", description: "Photos, price, and you're live." },
    { icon: Wallet, title: "You set the price", description: "Daily or weekly — your call." },
    { icon: ShieldCheck, title: "Get paid securely", description: "Payouts handled through NextGear." },
];

const earningsCard = (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:p-4">
        <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-stone-300 sm:text-xs">Your gear this month</span>
            <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-300 sm:text-[10px]">
                +18%
            </span>
        </div>

        <div className="mt-2 flex items-end justify-between gap-2 sm:mt-3">
            <p className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">$420</p>
            <span className="pb-0.5 text-[9px] text-stone-400 sm:text-[10px]">from 6 rentals</span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10 sm:mt-3">
            <div className="h-full w-3/4 rounded-full bg-linear-to-r from-orange-400 to-amber-300" />
        </div>
    </div>
);

export default function SignUpPage() {

    const router = useRouter();

    const [photo, setPhoto] = useState<File | null>(null);
    const [photoName, setPhotoName] = useState("");

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setPhoto(file ?? null);
        setPhotoName(file ? file.name : "");
    };

    const handleSignUp = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const user: Record<string, string> = {};

        formData.forEach((value, key) => {
            if (key !== "profilePhoto") {
                user[key] = value.toString();
            }
        });

        const imageFile = photo;

        let imageUrl = "";

        // Upload image to ImgBB
        if (imageFile && imageFile.size > 0) {
            try {
                const imageData = new FormData();
                imageData.append("image", imageFile);

                const response = await fetch(
                    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
                    {
                        method: "POST",
                        body: imageData,
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    toast.add({
                        type: "error",
                        description: "Image upload failed!",
                    });
                    return;
                }

                imageUrl = result.data.url;

            } catch {
                toast.add({
                    type: "error",
                    description: "Image upload failed!",
                });
                return;
            }
        }

        // Better Auth signup
        const { data, error } = await authClient.signUp.email({
            name: user.name,
            email: user.email,
            image: imageUrl || "https://static.vecteezy.com/system/resources/previews/073/638/610/non_2x/cute-white-peeking-duck-head-curious-duck-face-vector.jpg",
            password: user.password,
        });

        console.log("data", data);
        console.log("error", error);

        if (error) {
            toast.add({
                type: "error",
                description: error.message ?? "Something went wrong!",
            });
            return;
        }

        toast.add({
            type: "success",
            description: "Your account has been created successfully!",
        });

        router.push("/sign-in");
    };

    const handleGoogleSignUp = async () => {
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
            eyebrow="Join NextGear"
            title={
                <>
                    Make your gear
                    <br />
                    <span className="bg-linear-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                        work harder for you.
                    </span>
                </>
            }
            description="Rent what you need, or earn from what you already own. Free to join."
            features={signUpFeatures}
            highlight={earningsCard}
        >
            {/* Heading */}
            <div className="mb-6 sm:mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.16em] text-orange-700 uppercase ring-1 ring-orange-100 sm:gap-2 sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                    <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                    Get started
                </span>

                <h2 className="mt-3 text-xl leading-tight font-extrabold tracking-tight text-stone-900 sm:mt-4 sm:text-2xl md:text-3xl">
                    Create your account
                </h2>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-stone-500 sm:text-sm">
                    A few details and you&apos;re ready to rent or list gear.
                </p>
            </div>

            <form onSubmit={handleSignUp}>
                <FieldGroup className="gap-3 sm:gap-4">

                    <Field>
                        <Button
                            onClick={handleGoogleSignUp}
                            variant="outline"
                            type="button"
                            className="h-10 w-full cursor-pointer gap-2 rounded-xl border-stone-200 bg-white px-2 text-xs font-semibold text-stone-700 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-stone-900 dark:border-stone-200 dark:bg-white dark:text-stone-700 dark:hover:bg-orange-50 sm:h-11 sm:gap-2.5 sm:text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
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
                        <FieldLabel htmlFor="name" className="text-xs font-semibold text-stone-700 sm:text-sm">
                            Full Name
                        </FieldLabel>
                        <div className="relative min-w-0">
                            <User
                                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                                aria-hidden="true"
                            />
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Your full name"
                                minLength={3}
                                required
                                className={inputClassName}
                            />
                        </div>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email" className="text-xs font-semibold text-stone-700 sm:text-sm">
                            Email
                        </FieldLabel>
                        <div className="relative min-w-0">
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
                        <FieldLabel htmlFor="profilePhoto" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-stone-700 sm:gap-2 sm:text-sm">
                            <ImagePlus className="size-4 shrink-0 text-orange-500" aria-hidden="true" />
                            Profile Photo
                            <span className="text-[10px] font-normal text-stone-400 sm:text-xs">(optional)</span>
                        </FieldLabel>

                        {photoName ? (
                            <div className="flex min-w-0 items-center gap-2 rounded-xl border-2 border-orange-300 bg-orange-50/70 p-2.5 sm:gap-3 sm:p-4">
                                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-orange-600 shadow-sm sm:size-10">
                                    <Check className="size-4 sm:size-5" aria-hidden="true" />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-stone-700 sm:text-sm">Photo selected!</p>
                                    <p className="truncate text-[10px] text-stone-500 sm:text-xs">{photoName}</p>
                                </div>

                                <label
                                    htmlFor="profilePhoto"
                                    className="shrink-0 cursor-pointer rounded-lg border border-orange-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-orange-700 transition-colors hover:bg-orange-50 sm:px-3 sm:text-xs"
                                >
                                    Change
                                </label>

                                <Input
                                    id="profilePhoto"
                                    type="file"
                                    name="profilePhoto"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handlePhotoChange}
                                />
                            </div>
                        ) : (
                            <label
                                htmlFor="profilePhoto"
                                className="group flex min-w-0 cursor-pointer items-center gap-2.5 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/40 p-3 transition-colors hover:border-orange-300 hover:bg-orange-50/70 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 sm:gap-3 sm:p-4"
                            >
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-orange-600 shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 sm:size-10">
                                    <Upload className="size-4 sm:size-5" aria-hidden="true" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-xs leading-snug font-semibold text-stone-700 sm:text-sm">Click to upload a photo</span>
                                </span>

                                <Input
                                    id="profilePhoto"
                                    type="file"
                                    name="profilePhoto"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        )}

                        <FieldDescription className="mt-1.5 text-[10px] text-stone-500 sm:mt-2 sm:text-xs">
                            PNG or JPG · optional
                        </FieldDescription>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password" className="text-xs font-semibold text-stone-700 sm:text-sm">
                            Password
                        </FieldLabel>
                        <div className="relative min-w-0">
                            <Lock
                                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400"
                                aria-hidden="true"
                            />
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                required
                                minLength={6}
                                pattern="(?=.*[A-Z])(?=.*[a-z]).{6,}"
                                className={inputClassName}
                            />
                        </div>

                        <div className="mt-1.5 grid gap-1.5 sm:mt-2">
                            {passwordRules.map((rule) => (
                                <span key={rule} className="flex items-start gap-1.5 text-[10px] leading-relaxed text-stone-500 sm:gap-2 sm:text-xs">
                                    <Check className="mt-0.5 size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                                    <span>{rule}</span>
                                </span>
                            ))}
                        </div>
                    </Field>

                    <Field className="pt-1">
                        <Button
                            type="submit"
                            className="h-10 w-full cursor-pointer gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-3 text-xs font-bold text-white shadow-lg shadow-orange-600/25 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:h-11 sm:text-sm"
                        >
                            Create account
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Button>

                        <FieldDescription className="text-center text-xs leading-relaxed text-stone-500 sm:text-sm">
                            Already have an account?{" "}
                            <Link href="/sign-in" className="font-semibold text-orange-600 underline-offset-4 hover:text-orange-700 hover:underline">
                                Sign in
                            </Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </form>

            <div className="mt-6 text-center sm:mt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium text-stone-400 transition-colors hover:text-orange-600 sm:text-xs"
                >
                    <ArrowLeft className="size-3.5" aria-hidden="true" />
                    Back to homepage
                </Link>
            </div>
        </AuthShell>
    )
}
