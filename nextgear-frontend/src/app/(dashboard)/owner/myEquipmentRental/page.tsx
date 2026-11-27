

import Link from "next/link";
import {AlertCircle,CalendarDays,CheckCircle2,ClipboardList,Clock,MapPin,Package,Phone,XCircle,type LucideIcon,} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getBookingsByUserId } from "@/lib/api/bookings";
import { getEquipmentById } from "@/lib/api/equipments";
import { getSession } from "@/lib/core/server";
import { BookingType } from "@/lib/types/bookingType";
import { EquipmentType } from "@/lib/types/equipmentType";

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
            <Icon className="mr-1.5 size-3" aria-hidden="true" />
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

        {booking.metadata.contactNumber && (
            <p className="flex items-center gap-1.5 text-xs whitespace-nowrap text-stone-600">
                <Phone className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
                {booking.metadata.contactNumber}
            </p>
        )}

        {booking.metadata.address && (
            <span className="flex items-center gap-1.5 text-xs whitespace-nowrap text-stone-600">
                <MapPin className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
                <span className="truncate">{booking.metadata.address}</span>
            </span>
        )}
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
    "Equipment Information",
    "Customer Information",
    "Rental Duration",
    "Required Quantity",
    "Booking Amount",
    "Payment Status",
];

const OwnerEquipmentRentalPage = async () => {
    const session = await getSession();
    const ownerEquipRentals: BookingType[] = await getBookingsByUserId(session?.user.id as string);

    // Fetch equipment details for each rental
    const rentalsWithEquipment = await Promise.all(
        ownerEquipRentals.map(async (booking) => {
            const equipment = await getEquipmentById(booking.metadata.equipmentId);
            return { ...booking, equipment };
        })
    );

    console.log("rentalsWithEquipment", rentalsWithEquipment);

    return (
        <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Page heading */}
            <div className="mb-5 min-w-0 sm:mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-orange-700 uppercase ring-1 ring-orange-100 sm:text-[10px] sm:tracking-[0.16em]">
                    <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                    Owner Dashboard
                </span>

                <h1 className="mt-2.5 flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 sm:mt-3 sm:gap-2.5 sm:text-2xl lg:text-3xl">
                    My Equipment Rentals
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 sm:px-2.5 sm:py-1 sm:text-xs">
                        {rentalsWithEquipment.length}
                    </span>
                </h1>
                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-stone-500 sm:mt-2 sm:text-sm">
                    Every rental booked on your equipment, with customer and payment details.
                </p>
            </div>

            {/* Rentals list */}
            <Card className="border-stone-200 shadow-sm">
                <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                {rentalsWithEquipment.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16">
                        <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100 sm:size-14">
                            <ClipboardList className="size-6 sm:size-7" aria-hidden="true" />
                        </span>
                        <h2 className="mt-3.5 text-base font-bold text-slate-900 sm:mt-4 sm:text-lg">
                            No rentals yet
                        </h2>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-500 sm:text-sm">
                            None of your equipment has been rented yet. List more items to get noticed.
                        </p>
                        <Link
                            href="/owner/myEquipment"
                            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-4 text-xs font-bold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 sm:mt-5 sm:text-sm"
                        >
                            <Package className="size-4" aria-hidden="true" />
                            My Equipment
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto xl:block">
                            <table className="w-full min-w-225 text-left text-sm">
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
                                    {rentalsWithEquipment.map((booking) => (
                                        <tr key={booking._id} className="transition-colors hover:bg-orange-50/30">
                                            <td className="px-5 py-4">
                                                <EquipmentInfo equipment={booking.equipment} />
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
                                                    {booking.metadata.requiredQuantity}
                                                </p>
                                                <p className="mt-0.5 text-xs text-stone-400">units</p>
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
                        <div className="space-y-3 p-3 sm:space-y-4 sm:p-4 xl:hidden">
                            {rentalsWithEquipment.map((booking) => (
                                <article
                                    key={booking._id}
                                    className="rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <EquipmentInfo equipment={booking.equipment} />
                                        </div>
                                        <StatusBadge status={booking.payment_status} />
                                    </div>

                                    <div className="mt-3.5 rounded-xl bg-stone-50 px-3 py-2.5 ring-1 ring-stone-100 sm:mt-4">
                                        <p className="mb-2 text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                            Customer Information
                                        </p>
                                        <CustomerInfo booking={booking} />
                                    </div>

                                    <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
                                        <div className="col-span-2 rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-100 sm:col-span-1">
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

                                        <div className="rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-100">
                                            <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                Quantity
                                            </dt>
                                            <dd className="mt-1 text-xs font-semibold text-slate-800 sm:text-sm">
                                                {booking.metadata.requiredQuantity}
                                                <span className="ml-1 text-[10px] font-normal text-stone-400 sm:text-xs">
                                                    units
                                                </span>
                                            </dd>
                                        </div>

                                        <div className="rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-100">
                                            <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                Booking Amount
                                            </dt>
                                            <dd className="mt-1 text-xs font-semibold whitespace-nowrap text-slate-800 sm:text-sm">
                                                {formatCurrency(booking.paid_amount)}
                                            </dd>
                                        </div>
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

export default OwnerEquipmentRentalPage;
