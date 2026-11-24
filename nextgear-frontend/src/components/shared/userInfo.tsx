
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    ChevronDown,
    CirclePlus,
    ClipboardList,
    LogIn,
    LogOut,
    Package,
} from "lucide-react";

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
                <div className="size-8 animate-pulse rounded-full bg-slate-100 sm:size-9 md:size-10" aria-hidden="true" />
                <div className="hidden h-6 w-20 animate-pulse rounded-full bg-slate-100 sm:block sm:h-7 sm:w-24" aria-hidden="true" />
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
                    });
                    router.push("/sign-in");
                },
            },
        });
    };

    // Not logged in
    if (!session?.user) {
        return (
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                {/* Login - Premium glass design */}
                <Link
                    href="/sign-in"
                    className="group inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-orange-200/80 bg-white/75 px-3 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 hover:shadow-[0_5px_16px_-5px_rgba(249,115,22,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:translate-y-0 sm:h-9 sm:gap-2 sm:px-4 sm:text-xs md:h-10 md:text-sm"
                >
                    <LogIn className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 sm:size-4" />
                    Log in
                </Link>

                {/* Register - Premium gradient design */}
                <Link
                    href="/sign-up"
                    className="hidden sm:inline-flex group relative h-8 items-center justify-center gap-1.5 overflow-hidden rounded-full bg-linear-to-r from-orange-500 via-orange-500 to-amber-400 px-3 text-[11px] font-bold text-white shadow-[0_4px_14px_-3px_rgba(249,115,22,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_7px_20px_-4px_rgba(249,115,22,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 active:translate-y-0 sm:h-9 sm:gap-2 sm:px-4 sm:text-xs md:h-10 md:px-5 md:text-sm"
                >
                    <span className="absolute inset-0 bg-linear-to-b from-white/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <span className="relative">Register</span>

                    <ArrowRight className="relative size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:size-4" />
                </Link>
            </div>
        );
    }

    const initial = session.user.name?.charAt(0).toUpperCase() || "U";

    return (
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

            {/* Dashboard - Desktop */}
            <Link
                href={`/${session?.user.userRole}`}
                className="group hidden h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/60 hover:text-orange-600 hover:shadow-md active:translate-y-0 sm:inline-flex sm:h-9 sm:gap-2 sm:px-3 sm:text-xs md:h-10 md:px-4 md:text-sm"
            >
                Dashboard

                <ArrowRight className="size-3.5 text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-orange-500 sm:size-4" />
            </Link>

            {/* Account Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            title={session?.user.name}
                            className="group h-8 cursor-pointer gap-1 rounded-xl border border-slate-200 bg-white px-1 shadow-sm transition-all duration-300 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-md sm:h-9 sm:gap-2 sm:px-1.5 md:h-10 md:pr-2.5"
                        >
                            <Avatar className="size-6 ring-2 ring-white shadow-sm sm:size-7 md:size-8">
                                <AvatarImage
                                    src={
                                        session.user.image?.startsWith("http")
                                            ? session.user.image
                                            : undefined
                                    }
                                    alt={session.user.name || "User"}
                                />

                                <AvatarFallback className="bg-linear-to-br from-orange-500 to-amber-500 text-[10px] font-bold text-white sm:text-xs">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>

                            {/* User information - Tablet and desktop */}
                            <span className="hidden max-w-20 flex-col items-start leading-tight sm:flex md:max-w-24 lg:max-w-28">
                                <span className="w-full truncate text-[10px] font-semibold text-slate-800 md:text-xs">
                                    {session.user.name}
                                </span>

                                <span className="w-full truncate text-[9px] font-medium text-slate-500 md:text-[10px]">
                                    {session.user.email}
                                </span>
                            </span>

                            <ChevronDown
                                className="hidden size-3 text-slate-400 transition-all duration-300 group-hover:text-orange-500 group-data-[state=open]:rotate-180 sm:block md:size-3.5"
                                aria-hidden="true"
                            />
                        </Button>
                    }
                />

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-[min(17rem,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-1.5 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_8px_20px_-8px_rgba(15,23,42,0.08)] backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
                >

                    {/* Profile Header */}
                    <DropdownMenuGroup>
                        <div className="relative flex items-center gap-2.5 overflow-hidden rounded-xl bg-linear-to-br from-orange-50 via-white to-amber-50/60 p-2.5 ring-1 ring-orange-100/60 sm:gap-3 sm:p-3">
                            <div className="absolute -top-8 -right-8 size-24 rounded-full bg-orange-200/20 blur-2xl" />

                            <Avatar className="relative size-9 shrink-0 ring-2 ring-white shadow-md sm:size-10">
                                <AvatarImage
                                    src={
                                        session.user.image?.startsWith("http")
                                            ? session.user.image
                                            : undefined
                                    }
                                    alt={session.user.name || "User"}
                                />

                                <AvatarFallback className="bg-linear-to-br from-orange-500 to-amber-500 text-xs font-bold text-white sm:text-sm">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>

                            <div className="relative min-w-0 flex-1">
                                <p className="truncate text-xs font-bold tracking-tight text-slate-900 sm:text-sm">
                                    {session.user.name}
                                </p>

                                <p className="truncate text-[10px] text-slate-500 sm:text-xs">
                                    {session.user.email}
                                </p>
                            </div>
                        </div>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-1.5 bg-slate-100/80" />

                    {/* Account Links */}
                    <DropdownMenuGroup>
                        {accountLinks.map(({ href, label, icon: Icon }) => (
                            <DropdownMenuItem
                                key={href}
                                className="group cursor-pointer rounded-xl p-0 focus:bg-orange-50"
                            >
                                <Link
                                    href={href}
                                    className="flex min-h-10 w-full items-center gap-2.5 px-2 py-2 text-xs font-medium text-slate-700 transition-colors duration-200 group-focus:text-orange-700 sm:min-h-11 sm:gap-3 sm:text-sm"
                                >
                                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 ring-1 ring-slate-200/60 transition-all duration-200 group-focus:bg-orange-100 group-focus:text-orange-600 group-focus:ring-orange-200/60 sm:size-8">
                                        <Icon className="size-3.5 sm:size-4" aria-hidden="true" />
                                    </span>

                                    {label}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>

                    {/* Dashboard - Mobile */}
                    <div className="sm:hidden">
                        <DropdownMenuSeparator className="my-1.5 bg-slate-100/80" />

                        <DropdownMenuItem className="group cursor-pointer rounded-xl p-0 focus:bg-orange-50">
                            <Link
                                href={`/${session?.user.userRole}`}
                                className="flex min-h-10 w-full items-center gap-2.5 px-2 py-2 text-xs font-medium text-slate-700 transition-colors duration-200 group-focus:text-orange-700"
                            >
                                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 ring-1 ring-slate-200/60 group-focus:bg-orange-100 group-focus:text-orange-600">
                                    <ArrowRight className="size-3.5" aria-hidden="true" />
                                </span>

                                Dashboard
                            </Link>
                        </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="my-1.5 bg-slate-100/80" />

                    {/* Sign Out */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={handleSignOut}
                            className="group min-h-10 cursor-pointer gap-2.5 rounded-xl px-2 py-2 text-xs font-medium focus:bg-red-50 sm:min-h-11 sm:gap-3 sm:text-sm"
                        >
                            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500 ring-1 ring-red-100 transition-all duration-200 group-focus:bg-red-100 group-focus:ring-red-200 sm:size-8">
                                <LogOut className="size-3.5 sm:size-4" aria-hidden="true" />
                            </span>

                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default UserInfo;
