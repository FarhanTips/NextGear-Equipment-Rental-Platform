

import { Calendar, BriefcaseBusiness, CheckCircle2, XCircle, AlertCircle, Clock, Package, type LucideIcon, } from "lucide-react";
import { getEquipmentById } from "@/lib/api/equipments";
import { getBookingsByUserId } from "@/lib/api/bookings";
import { getSession } from "@/lib/core/server";
import { BookingType } from "@/lib/types/bookingType";
import { EquipmentType } from "@/lib/types/equipmentType";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
        <Badge variant="outline" className={className}>
            <Icon className="size-3 mr-1.5" aria-hidden="true" />
            {label}
        </Badge>
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

const EquipmentInfo = ({
    equipment,
    badge,
}: {
    equipment: EquipmentType | null;
    badge?: React.ReactNode;
}) => (
    <div className="flex items-center gap-3">
        <EquipmentThumb equipment={equipment} className="size-11 sm:size-12" />

        <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="truncate text-sm font-bold text-slate-900">
                    {equipment?.name || "Equipment not found"}
                </p>
                {badge}
            </div>
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

const DateCell = ({ date }: { date?: string }) => (
    <div className="flex items-center gap-1.5 text-slate-700">
        <Calendar className="size-3.5 text-stone-400 shrink-0" aria-hidden="true" />
        <span>{formatDate(date)}</span>
    </div>
);

const columns = [
    "Equipment Name",
    "Rental Start Date",
    "Rental End Date",
    "Booking Date",
    "Required Quantity",
    "Total Amount",
    "Payment Status",
    "Booking Status",
];

const MyRentalsPage = async () => {
    const session = await getSession();
    const bookings: BookingType[] = await getBookingsByUserId(session?.user.id as string);

    // Fetch equipment details for each booking
    const bookingsWithEquipment = await Promise.all(
        bookings.map(async (booking) => {
            const equipment = await getEquipmentById(booking.metadata.equipmentId);
            return { ...booking, equipment };
        })
    );

    console.log("bookingsWithEquipment", bookingsWithEquipment)

    return (
        <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Page heading */}
            <div className="mb-5 min-w-0 sm:mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-orange-700 uppercase ring-1 ring-orange-100 sm:text-[10px] sm:tracking-[0.16em]">
                    <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                    Customer Dashboard
                </span>

                <h1 className="mt-2.5 flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 sm:mt-3 sm:gap-2.5 sm:text-2xl lg:text-3xl">
                    My Rentals
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 sm:px-2.5 sm:py-1 sm:text-xs">
                        {bookingsWithEquipment.length}
                    </span>
                </h1>
                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-stone-500 sm:mt-2 sm:text-sm">
                    All your equipment rental bookings in one place.
                </p>
            </div>

            {/* Rentals list */}
            <Card className="border-stone-200 shadow-sm">
                <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                {bookingsWithEquipment.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16">
                        <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100 sm:size-14">
                            <BriefcaseBusiness className="size-6 sm:size-7" aria-hidden="true" />
                        </span>
                        <h2 className="mt-3.5 text-base font-bold text-slate-900 sm:mt-4 sm:text-lg">
                            No rentals yet
                        </h2>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-500 sm:text-sm">
                            You haven&apos;t booked any equipment yet. Start browsing to find what you need.
                        </p>
                        <Link
                            href="/browse-equipments"
                            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-4 text-xs font-bold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 sm:mt-5 sm:text-sm"
                        >
                            <Calendar className="size-4" aria-hidden="true" />
                            Browse Equipment
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto xl:block">
                            <table className="w-full min-w-215 text-left text-sm">
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
                                    {bookingsWithEquipment.map((booking) => (
                                        <tr key={booking._id} className="transition-colors hover:bg-orange-50/30">
                                            <td className="px-5 py-4">
                                                <EquipmentInfo equipment={booking.equipment} />
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <DateCell date={booking.metadata.startDate} />
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <DateCell date={booking.metadata.endDate} />
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <DateCell date={booking.payment_date} />
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">
                                                {booking.metadata.requiredQuantity}
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-900">
                                                {formatCurrency(booking.paid_amount)}
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <StatusBadge status={booking.payment_status} />
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <StatusBadge status={booking.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & tablet cards */}
                        <div className="space-y-3 p-3 sm:space-y-4 sm:p-4 xl:hidden">
                            {bookingsWithEquipment.map((booking) => (
                                <article
                                    key={booking._id}
                                    className="rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                                >
                                    <EquipmentInfo
                                        equipment={booking.equipment}
                                        badge={<StatusBadge status={booking.status} />}
                                    />

                                    <dl className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-4 sm:gap-2.5">
                                        {[
                                            { label: "Rental Start", value: formatDate(booking.metadata.startDate) },
                                            { label: "Rental End", value: formatDate(booking.metadata.endDate) },
                                            { label: "Booking Date", value: formatDate(booking.payment_date) },
                                            { label: "Required Quantity", value: booking.metadata.requiredQuantity },
                                            { label: "Total Amount", value: formatCurrency(booking.paid_amount) },
                                            { label: "Payment Status", value: booking.payment_status },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-100"
                                            >
                                                <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                    {item.label}
                                                </dt>
                                                <dd className="mt-1 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                                                    {item.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default MyRentalsPage;
