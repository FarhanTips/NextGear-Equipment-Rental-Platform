
import Image from "next/image";
import { CalendarDays, Mail } from "lucide-react";

import { getAllUsers } from "@/lib/api/users";
import { UserType } from "@/lib/types/userType";
import RoleSelect from "./_components/roleSelect";

const roleBadgeStyles: Record<string, string> = {
    admin: "bg-violet-50 text-violet-700 ring-violet-200",
    owner: "bg-orange-50 text-orange-700 ring-orange-200",
    customer: "bg-sky-50 text-sky-700 ring-sky-200",
};

const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const UserAvatar = ({ user }: { user: UserType }) => {
    return (
        <div className="grid shrink-0 place-items-center overflow-hidden rounded-full bg-stone-100 bg-cover bg-center text-stone-400 ring-1 ring-stone-200 size-10 sm:size-12">
            {user.image ? (
                <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                />
            ) : (
                user.name?.charAt(0).toUpperCase() || "U"
            )}
        </div>
    );
};

const RoleBadge = ({ role }: { role: string }) => {
    const className = roleBadgeStyles[role] ?? roleBadgeStyles.customer;

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    );
};

const AdminAllUsersPage = async () => {
    const allUsers: UserType[] = await getAllUsers();

    return (
        <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Page heading */}
            <div className="mb-5 min-w-0 sm:mb-8">
                <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                    All Users
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 sm:px-2.5 sm:py-1 sm:text-xs">
                        {allUsers.length}
                    </span>
                </h1>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-stone-500 sm:mt-2 sm:text-sm">
                    Manage all registered users and their roles.
                </p>
            </div>

            {/* User list */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                {allUsers.length === 0 ? (
                    <p className="px-4 py-12 text-center text-xs sm:py-16 sm:text-sm">
                        No users found.
                    </p>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto xl:block">
                            <table className="w-full min-w-200 text-left text-sm">
                                <thead className="border-b border-stone-100 bg-stone-50/70">
                                    <tr>
                                        {["Name", "Email", "Role", "Registration Date", "Action"].map((column) => (
                                            <th
                                                key={column}
                                                className="px-5 py-3.5 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]"
                                            >
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100">
                                    {allUsers.map((user) => {
                                        const role = (user.userRole || "customer").toLowerCase();

                                        return (
                                            <tr key={user._id} className="transition-colors hover:bg-orange-50/30">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <UserAvatar user={user} />

                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold text-slate-900">
                                                                {user.name || "Unnamed user"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-1.5 text-sm whitespace-nowrap text-stone-600">
                                                        <Mail className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
                                                        <span className="truncate">{user.email || "—"}</span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <RoleBadge role={role} />
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 text-sm text-stone-600">
                                                        <CalendarDays className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
                                                        {formatDate(user.createdAt)}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <RoleSelect userId={user._id} userRole={role} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & tablet cards */}
                        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 xl:hidden">
                            {allUsers.map((user) => {
                                const role = (user.userRole || "customer").toLowerCase();

                                return (
                                    <article
                                        key={user._id}
                                        className="flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs transition-shadow hover:shadow-sm"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/90 px-4 py-2 text-[11px] font-medium text-stone-500 sm:px-5">
                                                <span>User</span>
                                                <RoleBadge role={role} />
                                            </div>

                                            <div className="p-4 sm:p-5">
                                                <div className="flex items-start gap-3">
                                                    <UserAvatar user={user} />

                                                    <div className="min-w-0 flex-1">
                                                        <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                                                            {user.name || "Unnamed user"}
                                                        </h2>
                                                        <p className="mt-0.5 truncate text-[11px] text-stone-500 sm:text-xs">
                                                            {user.email || "No email provided"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <dl className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5">
                                                    <div className="rounded-xl bg-stone-50/90 px-3 py-2 ring-1 ring-stone-200/70">
                                                        <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                            Email
                                                        </dt>
                                                        <dd className="mt-1 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                                                            {user.email || "—"}
                                                        </dd>
                                                    </div>

                                                    <div className="rounded-xl bg-stone-50/90 px-3 py-2 ring-1 ring-stone-200/70">
                                                        <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                            Registration Date
                                                        </dt>
                                                        <dd className="mt-1 text-xs font-semibold whitespace-nowrap text-slate-800 sm:text-sm">
                                                            {formatDate(user.createdAt)}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-stone-100 px-4 py-3 sm:px-5">
                                            <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase sm:text-[11px]">
                                                Change Role
                                            </span>
                                            <RoleSelect userId={user._id} userRole={role} />
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminAllUsersPage;
