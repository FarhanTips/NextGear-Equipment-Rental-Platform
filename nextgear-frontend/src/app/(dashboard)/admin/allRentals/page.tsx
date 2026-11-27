

import { AlertCircle, CalendarDays, CheckCircle2, ClipboardList, Clock, Mail, MapPin, Package, Phone, User, XCircle, type LucideIcon } from "lucide-react";
import { getAllBookings } from "@/lib/api/bookings";
import { getEquipmentById } from "@/lib/api/equipments";
import { getUserById } from "@/lib/api/users";
import { BookingType } from "@/lib/types/bookingType";
import { EquipmentType } from "@/lib/types/equipmentType";
import { UserType } from "@/lib/types/userType";

const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatCurrency = (amount?: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount) || 0);

const statusStyles: Record<string, { className: string; icon: LucideIcon }> = {
    paid: { className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
    confirmed: { className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
    completed: { className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
    active: { className: "bg-emerald-50 text-emerald-700 ring-emerald-200", icon: CheckCircle2 },
    pending: { className: "bg-amber-50 text-amber-700 ring-amber-200", icon: Clock },
    cancelled: { className: "bg-rose-50 text-rose-700 ring-rose-200", icon: XCircle },
    failed: { className: "bg-rose-50 text-rose-700 ring-rose-200", icon: XCircle },
    refunded: { className: "bg-blue-50 text-blue-700 ring-blue-200", icon: AlertCircle },
};

const StatusBadge = ({ status }: { status: string }) => {
    const key = status?.toLowerCase() ?? "";
    const { className, icon: Icon } = statusStyles[key] ?? {
        className: "bg-stone-50 text-stone-700 ring-stone-200",
        icon: Package,
    };
    const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ring-1 sm:text-xs ${className}`}
        >
            <Icon className="size-3 sm:size-3.5" aria-hidden="true" />
            {label}
        </span>
    );
};

const EquipmentThumb = ({
    equipment,
    className,
}: {
    equipment: EquipmentType | null;
    className: string;
}) => (
    <div
        className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-stone-100 bg-cover bg-center text-stone-400 ring-1 ring-stone-200 ${className}`}
        style={equipment?.image ? { backgroundImage: `url(${equipment.image})` } : undefined}
    >
        {!equipment?.image && <Package className="size-4 sm:size-5" aria-hidden="true" />}
    </div>
);

const UserAvatar = ({ user }: { user: UserType | null }) => (
    <div
        className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-stone-100 bg-cover bg-center text-stone-400 ring-1 ring-stone-200"
        style={user?.image ? { backgroundImage: `url(${user.image})` } : undefined}
    >
        {!user?.image && <User className="size-4" aria-hidden="true" />}
    </div>
);

const EquipmentInfo = ({ equipment }: { equipment: EquipmentType | null }) => (
    <div className="flex items-center gap-3">
        <EquipmentThumb equipment={equipment} className="size-11 sm:size-12" />

        <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
                {equipment?.name || "Equipment not found"}
            </p>
            {(equipment?.brand || equipment?.model) && (
                <p className="mt-0.5 truncate text-xs text-stone-500">
                    {[equipment?.brand, equipment?.model].filter(Boolean).join(" · ")}
                </p>
            )}
            {equipment?.category && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-400">
                    <Package className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
                    <span className="truncate">{equipment.category}</span>
                </p>
            )}
        </div>
    </div>
);

const CustomerInfo = ({ booking }: { booking: BookingType }) => (
    <div className="min-w-0 space-y-1">
        <p className="truncate text-sm font-semibold text-slate-900">
            {booking.customer_email || "Unknown customer"}
        </p>

        <p className="flex items-center gap-1.5 text-xs whitespace-nowrap text-stone-600">
            <Phone className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
            {booking.metadata.contactNumber}
        </p>

        <span className="flex items-center gap-1.5 text-xs whitespace-nowrap text-stone-600">
            <MapPin className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
            <span className="truncate">{booking.metadata.address}</span>
        </span>
    </div>
);

const OwnerInfo = ({ owner }: { owner: UserType }) => (
    <div className="flex items-center gap-3">
        <UserAvatar user={owner} />

        <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
                {owner.name}
            </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs whitespace-nowrap text-stone-600">
                    <Mail className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
                    {owner.email}
                </p>
        </div>
    </div>
);

const RentalDuration = ({ startDate, endDate }: { startDate?: string; endDate?: string }) => (
    <div className="text-xs">
        <p className="flex items-center gap-1.5 whitespace-nowrap font-semibold text-slate-800">
            <CalendarDays className="size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
            {formatDate(startDate)}
        </p>
        <p className="mt-1 whitespace-nowrap pl-5 text-stone-400">to {formatDate(endDate)}</p>
    </div>
);

const columns = [
    "Equipment Name",
    "Owner Information",
    "Customer Information",
    "Rental Duration",
    "Booking Amount",
    "Payment Status",
];

const AdminAllRentalsPage = async () => {
    const allRentals: BookingType[] = await getAllBookings();

    // Fetch equipment and owner details for each rental
    const rentals = await Promise.all(
        allRentals.map(async (booking) => {
            const equipment = await getEquipmentById(booking.metadata.equipmentId);
            const owner = await getUserById(equipment.ownerId);
            return { ...booking, equipment, owner };
        })
    );

    return (
        <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Page heading */}
            <div className="mb-5 min-w-0 sm:mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-orange-700 uppercase ring-1 ring-orange-100 sm:text-[10px] sm:tracking-[0.16em]">
                    <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                    Admin Dashboard
                </span>

                <h1 className="mt-2.5 flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 sm:mt-3 sm:gap-2.5 sm:text-2xl lg:text-3xl">
                    All Rentals
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 sm:px-2.5 sm:py-1 sm:text-xs">
                        {rentals.length}
                    </span>
                </h1>
                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-stone-500 sm:mt-2 sm:text-sm">
                    Every rental booking on the platform, with customer, owner and payment details.
                </p>
            </div>

            {/* Rentals list */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                {rentals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16">
                        <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100 sm:size-14">
                            <ClipboardList className="size-6 sm:size-7" aria-hidden="true" />
                        </span>
                        <h2 className="mt-3.5 text-base font-bold text-slate-900 sm:mt-4 sm:text-lg">
                            No rentals yet
                        </h2>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-500 sm:text-sm">
                            No rental bookings have been made on the platform yet.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto xl:block">
                            <table className="w-full min-w-250 text-left text-sm">
                                <thead className="border-b border-stone-100 bg-stone-50/70">
                                    <tr>
                                        {columns.map((column) => (
                                            <th
                                                key={column}
                                                scope="col"
                                                className="px-5 py-3.5 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]"
                                            >
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100">
                                    {rentals.map((booking) => (
                                        <tr key={booking._id} className="transition-colors hover:bg-orange-50/30">
                                            <td className="px-5 py-4">
                                                <EquipmentInfo equipment={booking.equipment} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <OwnerInfo owner={booking.owner} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <CustomerInfo booking={booking} />
                                            </td>

                                            <td className="px-5 py-4">
                                                <RentalDuration
                                                    startDate={booking.metadata.startDate}
                                                    endDate={booking.metadata.endDate}
                                                />
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <p className="font-semibold text-slate-900">
                                                    {formatCurrency(booking.paid_amount)}
                                                </p>
                                                <p className="mt-0.5 text-xs text-stone-400">
                                                    {booking.currency?.toUpperCase() || "USD"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <StatusBadge status={booking.payment_status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & tablet cards */}
                        <div className="flex flex-col gap-4 rounded-2xl bg-stone-100/80 p-3 sm:gap-5 sm:p-4 xl:hidden">
                            {rentals.map((booking, index) => (
                                <article
                                    key={booking._id}
                                    className="overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-2 border-b border-stone-100 bg-stone-50/90 px-3.5 py-2 text-[11px] font-medium text-stone-500 sm:px-5">
                                        <span>Rental #{index + 1}</span>
                                        <StatusBadge status={booking.payment_status} />
                                    </div>

                                    <div className="p-3.5 sm:p-5">
                                        <div className="flex items-start gap-3">
                                            <EquipmentThumb
                                                equipment={booking.equipment}
                                                className="size-12 shrink-0 rounded-xl sm:size-14"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                                                    {booking.equipment?.name || "Equipment not found"}
                                                </h2>

                                                {(booking.equipment?.brand || booking.equipment?.model) && (
                                                    <p className="mt-0.5 truncate text-[11px] text-stone-500 sm:text-xs">
                                                        {[booking.equipment?.brand, booking.equipment?.model]
                                                            .filter(Boolean)
                                                            .join(" · ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3.5 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-2.5">
                                            <div className="rounded-xl bg-stone-50 px-3 py-2.5 ring-1 ring-stone-200/70">
                                                <p className="mb-2 text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                    Customer Information
                                                </p>
                                                <CustomerInfo booking={booking} />
                                            </div>

                                            <div className="rounded-xl bg-stone-50 px-3 py-2.5 ring-1 ring-stone-200/70">
                                                <p className="mb-2 text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                    Owner Information
                                                </p>
                                                <OwnerInfo owner={booking.owner} />
                                            </div>
                                        </div>

                                        <dl className="mt-2 grid grid-cols-2 gap-2 sm:gap-2.5">
                                            <div className="rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-200/70">
                                                <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                    Rental Duration
                                                </dt>
                                                <dd className="mt-1">
                                                    <RentalDuration
                                                        startDate={booking.metadata.startDate}
                                                        endDate={booking.metadata.endDate}
                                                    />
                                                </dd>
                                            </div>

                                            <div className="rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-200/70">
                                                <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                    Booking Amount
                                                </dt>
                                                <dd className="mt-1 text-xs font-semibold whitespace-nowrap text-slate-800 sm:text-sm">
                                                    {formatCurrency(booking.paid_amount)}
                                                    <span className="ml-1 text-[10px] font-normal text-stone-400 sm:text-xs">
                                                        {booking.currency?.toUpperCase() || "USD"}
                                                    </span>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminAllRentalsPage;
