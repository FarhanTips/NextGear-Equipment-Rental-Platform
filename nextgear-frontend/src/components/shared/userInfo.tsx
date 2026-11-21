"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, CirclePlus, ClipboardList, LogOut, Package } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { toast } from "../ui/toast";

const accountLinks = [
    { href: "/add-event", label: "List Your Gear", icon: CirclePlus },
    { href: "/manage-events", label: "My Gear", icon: ClipboardList },
    { href: "/joined-events", label: "My Rentals", icon: Package },
];

const UserInfo = () => {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="flex items-center gap-2" role="status">
                <span className="sr-only">Loading account</span>
                <div className="size-9 animate-pulse rounded-full bg-stone-200 sm:size-10 dark:bg-stone-800" aria-hidden="true" />
                <div className="hidden h-7 w-24 animate-pulse rounded-full bg-stone-200 sm:block dark:bg-stone-800" aria-hidden="true" />
            </div>
        );
    }

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.add({
                        type: "success",
                        description: "Signed out successfully!",
                    })
                    router.push("/sign-in");
                },
            },
        });
    };

    if (!session?.user) {
        return (
            <Link
                href="/sign-in"
                className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-linear-to-r from-orange-600 to-amber-500 px-4 text-sm font-semibold text-white shadow-md shadow-orange-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-orange-500 hover:to-amber-400 hover:shadow-lg hover:shadow-orange-600/30 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 sm:h-10 sm:px-5 dark:focus-visible:ring-offset-stone-950"
            >
                Sign in
                <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                />
            </Link>
        );
    }

    const initial = session.user.name?.charAt(0).toUpperCase() || "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        title={session.user.name || "Account"}
                        className="group h-9 cursor-pointer gap-2 rounded-full border border-stone-200/80 bg-white/70 pr-1 pl-1 shadow-sm transition-all duration-200 hover:border-orange-200 hover:bg-orange-50/70 sm:h-10 sm:pr-2.5 dark:border-white/10 dark:bg-white/5 dark:hover:border-orange-400/30 dark:hover:bg-orange-500/10"
                    >
                        <Avatar className="size-7 sm:size-8">
                            <AvatarImage
                                src={session.user.image?.startsWith("http") ? session.user.image : undefined}
                                alt={session.user.name}
                            />
                            <AvatarFallback className="bg-linear-to-br from-orange-500 to-amber-500 text-xs font-bold text-white">
                                {initial}
                            </AvatarFallback>
                        </Avatar>

                        <span className="hidden max-w-28 flex-col items-start leading-tight sm:flex">
                            <span className="w-full truncate text-xs font-semibold text-stone-800 dark:text-stone-100">
                                {session.user.name}
                            </span>
                            <span className="w-full truncate text-[10px] font-medium text-stone-500 dark:text-stone-400">
                                {session.user.email}
                            </span>
                        </span>

                        <ChevronDown
                            className="hidden size-3.5 text-stone-400 transition-transform duration-200 group-hover:text-orange-500 sm:block dark:text-stone-500"
                            aria-hidden="true"
                        />
                    </Button>
                }
            />

            <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-72 overflow-hidden rounded-2xl border border-stone-200/80 bg-white/95 p-1.5 shadow-2xl shadow-stone-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-stone-900/95 dark:shadow-black/40"
            >
                <DropdownMenuGroup>
                    <div className="flex items-center gap-3 rounded-xl bg-linear-to-br from-orange-50 via-white to-amber-50 p-3 dark:from-orange-500/10 dark:via-stone-900 dark:to-amber-500/10">
                        <Avatar className="size-10 ring-2 ring-white dark:ring-stone-800">
                            <AvatarImage
                                src={session.user.image?.startsWith("http") ? session.user.image : undefined}
                                alt={session.user.name}
                            />
                            <AvatarFallback className="bg-linear-to-br from-orange-500 to-amber-500 text-sm font-bold text-white">
                                {initial}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">
                                {session.user.name}
                            </p>
                            <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1.5 bg-stone-100 dark:bg-white/10" />

                <DropdownMenuGroup>
                    {accountLinks.map(({ href, label, icon: Icon }) => (
                        <DropdownMenuItem
                            key={href}
                            className="cursor-pointer rounded-xl p-0 focus:bg-orange-50 dark:focus:bg-orange-500/10"
                        >
                            <Link
                                href={href}
                                className="flex w-full items-center gap-3 px-2 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-200"
                            >
                                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-500 transition-colors duration-200 group-focus/dropdown-menu-item:bg-orange-100 group-focus/dropdown-menu-item:text-orange-600 dark:bg-white/5 dark:text-stone-400 dark:group-focus/dropdown-menu-item:bg-orange-500/15 dark:group-focus/dropdown-menu-item:text-orange-300">
                                    <Icon className="size-4" aria-hidden="true" />
                                </span>
                                {label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1.5 bg-stone-100 dark:bg-white/10" />

                <DropdownMenuGroup>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleSignOut}
                        className="cursor-pointer gap-3 rounded-xl px-2 py-2.5 font-medium"
                    >
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                            <LogOut className="size-4" aria-hidden="true" />
                        </span>
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserInfo;
