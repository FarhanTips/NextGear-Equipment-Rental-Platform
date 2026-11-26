

import Link from "next/link";
import { CheckCircle2, Clock3, Eye, Package, PackageOpen, PlusCircle, XCircle, } from "lucide-react";

import { getOwnerEquipments } from "@/lib/api/equipments";
import { getSession } from "@/lib/core/server";
import { EquipmentType } from "@/lib/types/equipmentType";
import { DeleteEquipmentDialog } from "./_components/deleteEquipmentDialog";
import EditEquipmentDialog from "./_components/editEquipmentDialog";

const statusStyles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusIcons: Record<string, typeof Clock3> = {
    pending: Clock3,
    approved: CheckCircle2,
    rejected: XCircle,
};

const rentalPeriod = (type: string) => {
    if (type === "Weekly") return "week";
    if (type === "Monthly") return "month";
    return "day";
};

const StatusBadge = ({ status }: { status: string }) => {
    const statusKey = status.toLowerCase();
    const StatusIcon = statusIcons[statusKey] ?? Clock3;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ring-1 sm:text-xs ${statusStyles[statusKey] ?? statusStyles.pending}`}
        >
            <StatusIcon className="size-3 sm:size-3.5" aria-hidden="true" />
            {status}
        </span>
    );
};

const EquipmentThumb = ({
    equipment,
    className,
}: {
    equipment: EquipmentType;
    className: string;
}) => (
    <div
        className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-stone-100 bg-cover bg-center text-stone-400 ring-1 ring-stone-200 ${className}`}
        style={equipment.image ? { backgroundImage: `url(${equipment.image})` } : undefined}
    >
        {!equipment.image && <Package className="size-4 sm:size-5" aria-hidden="true" />}
    </div>
);

const EquipmentActions = ({ equipment, card = false }: { equipment: EquipmentType; card?: boolean }) => {
    const linkClass =
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold whitespace-nowrap transition-colors sm:text-xs";

    return (
        <div className={card ? "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" : "flex items-center justify-end gap-2"}>

            <EditEquipmentDialog equipment={equipment}></EditEquipmentDialog>

            <DeleteEquipmentDialog equipId={equipment._id}></DeleteEquipmentDialog>

            <Link
                href={`/browse-equipments/${equipment._id}`}
                title="View equipment details"
                className={`${linkClass} border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50 hover:text-slate-900 ${card ? "col-span-2 sm:col-span-1" : ""}`}
            >
                <Eye className="size-3.5" aria-hidden="true" />
                View Details
            </Link>
        </div>
    );
};

const MyEquipmentsPage = async () => {
    const session = await getSession();
    const myEquipments: EquipmentType[] = await getOwnerEquipments(session?.user.id as string);

    return (
        <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Page heading */}
            <div className="mb-5 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-orange-700 uppercase ring-1 ring-orange-100 sm:text-[10px] sm:tracking-[0.16em]">
                        <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                        Owner Dashboard
                    </span>

                    <h1 className="mt-2.5 flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 sm:mt-3 sm:gap-2.5 sm:text-2xl lg:text-3xl">
                        My Equipment
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 sm:px-2.5 sm:py-1 sm:text-xs">
                            {myEquipments.length}
                        </span>
                    </h1>
                    <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-stone-500 sm:mt-2 sm:text-sm">
                        Manage everything you have listed for rent in one place.
                    </p>
                </div>

                <Link
                    href="/owner/addEquipment"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-4 text-xs font-bold text-white shadow-lg shadow-orange-600/25 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30 sm:h-10 sm:w-fit sm:text-sm"
                >
                    <PlusCircle className="size-4" aria-hidden="true" />
                    Add Equipment
                </Link>
            </div>

            {/* Equipment list */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                {myEquipments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16">
                        <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100 sm:size-14">
                            <PackageOpen className="size-6 sm:size-7" aria-hidden="true" />
                        </span>
                        <h2 className="mt-3.5 text-base font-bold text-slate-900 sm:mt-4 sm:text-lg">
                            No equipment yet
                        </h2>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-500 sm:text-sm">
                            You have not added any equipment for rent. Add your first item to get started.
                        </p>
                        <Link
                            href="/owner/addEquipment"
                            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-4 text-xs font-bold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 sm:mt-5 sm:text-sm"
                        >
                            <PlusCircle className="size-4" aria-hidden="true" />
                            Add Equipment
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto xl:block">
                            <table className="w-full min-w-215 text-left text-sm">
                                <thead className="border-b border-stone-100 bg-stone-50/70">
                                    <tr>
                                        <th scope="col" className="px-5 py-3.5 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]">
                                            Equipment Name
                                        </th>
                                        <th scope="col" className="px-5 py-3.5 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]">
                                            Category
                                        </th>
                                        <th scope="col" className="px-5 py-3.5 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]">
                                            Rental Price
                                        </th>
                                        <th scope="col" className="px-5 py-3.5 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]">
                                            Available Quantity
                                        </th>
                                        <th scope="col" className="px-5 py-3.5 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]">
                                            Status
                                        </th>
                                        <th scope="col" className="px-5 py-3.5 text-right text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100">
                                    {myEquipments.map((equipment) => {
                                        const status = equipment.status || "Pending";
                                        const price = Number(equipment.rentalPrice) || 0;

                                        return (
                                            <tr key={equipment._id} className="transition-colors hover:bg-orange-50/30">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <EquipmentThumb equipment={equipment} className="size-11" />

                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold text-slate-900">
                                                                {equipment.name}
                                                            </p>
                                                            {(equipment.brand || equipment.model) && (
                                                                <p className="mt-0.5 truncate text-xs text-stone-500">
                                                                    {[equipment.brand, equipment.model]
                                                                        .filter(Boolean)
                                                                        .join(" · ")}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="inline-flex rounded-full py-1 text-xs font-medium text-stone-600">
                                                        {equipment.category}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <p className="font-semibold text-slate-900">
                                                        ${price.toLocaleString()}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-stone-400">
                                                        per {rentalPeriod(equipment.rentalType)}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <p className="font-semibold text-slate-900">
                                                        {equipment.availableQuantity}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-stone-400">units</p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <StatusBadge status={status} />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <EquipmentActions equipment={equipment} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & tablet cards */}
                        {/* প্যারেন্ট পেজ/সেকশনে bg-stone-100 বা bg-slate-100 থাকলে পার্থক্য সবচেয়ে ভালো বোঝা যাবে */}
                        <div className="flex flex-col gap-4 rounded-2xl bg-stone-100/80 p-3 sm:gap-5 sm:p-4 xl:hidden">
                            {myEquipments.map((equipment, index) => {
                                const status = equipment.status || "Pending";
                                const price = Number(equipment.rentalPrice) || 0;

                                return (
                                    <article
                                        key={equipment._id}
                                        className="overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-sm"
                                    >
                                        {/* কার্ডের ওপরের ছোট আইডেন্টিফায়ার বার */}
                                        <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/90 px-3.5 py-2 text-[11px] font-medium text-stone-500 sm:px-5">
                                            <span>Item #{index + 1}</span>
                                            <StatusBadge status={status} />
                                        </div>

                                        <div className="p-3.5 sm:p-5">
                                            <div className="flex items-start gap-3">
                                                <EquipmentThumb
                                                    equipment={equipment}
                                                    className="size-12 shrink-0 rounded-xl sm:size-14"
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                                                        {equipment.name}
                                                    </h2>

                                                    {(equipment.brand || equipment.model) && (
                                                        <p className="mt-0.5 truncate text-[11px] text-stone-500 sm:text-xs">
                                                            {[equipment.brand, equipment.model]
                                                                .filter(Boolean)
                                                                .join(" · ")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <dl className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-3 sm:gap-2.5">
                                                <div className="col-span-2 rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-200/70 sm:col-span-1">
                                                    <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                        Category
                                                    </dt>
                                                    <dd className="mt-1 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                                                        {equipment.category}
                                                    </dd>
                                                </div>

                                                <div className="rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-200/70">
                                                    <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                        Rental Price
                                                    </dt>
                                                    <dd className="mt-1 text-xs font-semibold whitespace-nowrap text-slate-800 sm:text-sm">
                                                        ${price.toLocaleString()}
                                                        <span className="ml-1 text-[10px] font-normal text-stone-400 sm:text-xs">
                                                            /{rentalPeriod(equipment.rentalType)}
                                                        </span>
                                                    </dd>
                                                </div>

                                                <div className="rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-200/70">
                                                    <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                        Available
                                                    </dt>
                                                    <dd className="mt-1 text-xs font-semibold text-slate-800 sm:text-sm">
                                                        {equipment.availableQuantity}
                                                        <span className="ml-1 text-[10px] font-normal text-stone-400 sm:text-xs">
                                                            units
                                                        </span>
                                                    </dd>
                                                </div>
                                            </dl>

                                            <div className="mt-3.5 border-t border-stone-100 pt-3">
                                                <EquipmentActions equipment={equipment} card />
                                            </div>
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

export default MyEquipmentsPage;
