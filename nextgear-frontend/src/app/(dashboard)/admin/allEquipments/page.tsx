import Link from "next/link";
import { Eye, Package, PackageOpen } from "lucide-react";

import { getAllEquipments } from "@/lib/api/equipments";
import { EquipmentType } from "@/lib/types/equipmentType";
import StatusSelect from "./_components/statusSelect";
import { DeleteEquipmentDialog } from "../../_components/shared/deleteEquipmentDialog";
import EditEquipmentDialog from "../../_components/shared/editEquipmentDialog";


const rentalPeriod = (type: string) => {
    if (type === "Weekly") return "week";
    if (type === "Monthly") return "month";
    return "day";
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

const ViewDetails = ({ id }: { id: string }) => (
    <Link
        href={`/browse-equipments/${id}`}
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 text-[11px] font-semibold whitespace-nowrap text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50 hover:text-slate-900 sm:text-xs"
    >
        <Eye className="size-3.5" aria-hidden="true" />
        View Details
    </Link>
);

const AdminAllEquipmentsPage = async () => {
    const allEquipments: EquipmentType[] = await getAllEquipments();

    return (
        <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Page heading */}
            <div className="mb-5 min-w-0 sm:mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-orange-700 uppercase ring-1 ring-orange-100 sm:text-[10px] sm:tracking-[0.16em]">
                    <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                    Admin Dashboard
                </span>

                <h1 className="mt-2.5 flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 sm:mt-3 sm:gap-2.5 sm:text-2xl lg:text-3xl">
                    All Equipments
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 sm:px-2.5 sm:py-1 sm:text-xs">
                        {allEquipments.length}
                    </span>
                </h1>
                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-stone-500 sm:mt-2 sm:text-sm">
                    Review and manage every equipment listed on the platform.
                </p>
            </div>

            {/* Equipment list */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                {allEquipments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16">
                        <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100 sm:size-14">
                            <PackageOpen className="size-6 sm:size-7" aria-hidden="true" />
                        </span>
                        <h2 className="mt-3.5 text-base font-bold text-slate-900 sm:mt-4 sm:text-lg">
                            No equipment yet
                        </h2>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-500 sm:text-sm">
                            No equipment has been listed on the platform yet.
                        </p>
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
                                        <th scope="col" className="px-5 py-3.5 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]">
                                            Details
                                        </th>
                                        <th scope="col" className="px-5 py-3.5 text-right text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100">
                                    {allEquipments.map((equipment) => {
                                        const price = Number(equipment.rentalPrice) || 0;

                                        return (
                                            <tr key={equipment._id} className="transition-colors hover:bg-orange-50/30">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <EquipmentThumb equipment={equipment} className="size-11" />

                                                        <div className="min-w-0 flex-1">
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
                                                    <span className="inline-flex rounded-full pr-2 py-1 text-xs font-medium whitespace-nowrap text-stone-600">
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
                                                    <StatusSelect
                                                        equipmentId={equipment._id}
                                                        equipStatus={equipment.status}
                                                    />
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <ViewDetails id={equipment._id} />
                                                </td>

                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                                        <EditEquipmentDialog equipment={equipment}></EditEquipmentDialog>

                                                        <DeleteEquipmentDialog equipId={equipment._id}></DeleteEquipmentDialog>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & tablet cards */}
                        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4 xl:hidden">
                            {allEquipments.map((equipment) => {
                                const price = Number(equipment.rentalPrice) || 0;

                                return (
                                    <article
                                        key={equipment._id}
                                        className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm sm:p-5"
                                    >
                                        <div>
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

                                            <dl className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-2.5">
                                                <div className="rounded-xl bg-stone-50/90 px-3 py-2 ring-1 ring-stone-200/70">
                                                    <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                        Category
                                                    </dt>
                                                    <dd className="mt-1 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                                                        {equipment.category}
                                                    </dd>
                                                </div>

                                                <div className="rounded-xl bg-stone-50/90 px-3 py-2 ring-1 ring-stone-200/70">
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

                                                <div className="rounded-xl bg-stone-50/90 px-3 py-2 ring-1 ring-stone-200/70">
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

                                                <div className="rounded-xl bg-stone-50/90 px-3 py-2 ring-1 ring-stone-200/70">
                                                    <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                        Status
                                                    </dt>
                                                    <dd className="mt-1">
                                                        <StatusSelect
                                                            equipmentId={equipment._id}
                                                            equipStatus={equipment.status}
                                                        />
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
                                            <ViewDetails id={equipment._id} />
                                            <div className="ml-auto flex items-center gap-1.5 whitespace-nowrap">
                                                <EditEquipmentDialog equipment={equipment}></EditEquipmentDialog>
                                                <DeleteEquipmentDialog equipId={equipment._id}></DeleteEquipmentDialog>
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

export default AdminAllEquipmentsPage;
