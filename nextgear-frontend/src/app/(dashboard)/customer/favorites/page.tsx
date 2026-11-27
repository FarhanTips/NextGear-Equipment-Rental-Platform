

import Link from "next/link";
import { Bookmark, CheckCircle2, Eye, MapPin, Package, Search, XCircle } from "lucide-react";

import { getEquipmentById } from "@/lib/api/equipments";
import { getMyFavorites } from "@/lib/api/favorites";
import { getSession } from "@/lib/core/server";
import { EquipmentType } from "@/lib/types/equipmentType";
import { FavoriteType } from "@/lib/types/favoriteType";
import { RemoveFavoriteDialog } from "./_components/removeFavorite";


const rentalPeriod = (type: string) => {
    if (type === "Weekly") return "week";
    if (type === "Monthly") return "month";
    return "day";
};

const AvailabilityBadge = ({ available }: { available: boolean }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ring-1 sm:text-xs ${available
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-rose-50 text-rose-700 ring-rose-200"
            }`}
    >
        {available ? (
            <CheckCircle2 className="size-3 sm:size-3.5" aria-hidden="true" />
        ) : (
            <XCircle className="size-3 sm:size-3.5" aria-hidden="true" />
        )}
        {available ? "Available" : "Unavailable"}
    </span>
);

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

const FavoritesPage = async () => {
    const session = await getSession();
    const myFavorites: FavoriteType[] = await getMyFavorites(`customerId=${session?.user.id}`);

    // Fetch the details of every favorited equipment.
    const favoriteEquipments: EquipmentType[] = (
        await Promise.all(
            myFavorites.map((favorite) => getEquipmentById(favorite.equipmentId))
        )
    ).filter((equipment): equipment is EquipmentType => Boolean(equipment));

    return (
        <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Page heading */}
            <div className="mb-5 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-orange-700 uppercase ring-1 ring-orange-100 sm:text-[10px] sm:tracking-[0.16em]">
                        <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                        Customer Dashboard
                    </span>

                    <h1 className="mt-2.5 flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 sm:mt-3 sm:gap-2.5 sm:text-2xl lg:text-3xl">
                        My Favorites
                        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600 sm:px-2.5 sm:py-1 sm:text-xs">
                            {favoriteEquipments.length}
                        </span>
                    </h1>
                    <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-stone-500 sm:mt-2 sm:text-sm">
                        All the equipment you have saved for later, in one place.
                    </p>
                </div>
            </div>

            {/* Favorites list */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

                {favoriteEquipments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6 sm:py-16">
                        <span className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100 sm:size-14">
                            <Bookmark className="size-6 sm:size-7" aria-hidden="true" />
                        </span>
                        <h2 className="mt-3.5 text-base font-bold text-slate-900 sm:mt-4 sm:text-lg">
                            No favorites yet
                        </h2>
                        <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-500 sm:text-sm">
                            Save equipment you love from any listing and it will show up here for quick access.
                        </p>
                        <Link
                            href="/browse-equipments"
                            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-4 text-xs font-bold text-white shadow-lg shadow-orange-600/20 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 sm:mt-5 sm:text-sm"
                        >
                            <Search className="size-4" aria-hidden="true" />
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
                                            Availability
                                        </th>
                                        <th scope="col" className="px-5 py-3.5 text-right text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase 2xl:text-[11px]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-100">
                                    {favoriteEquipments.map((equipment, idx) => {
                                        const price = Number(equipment.rentalPrice) || 0;
                                        const quantity = Number(equipment.availableQuantity) || 0;

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
                                                            {equipment.location && (
                                                                <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-400">
                                                                    <MapPin className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
                                                                    <span className="truncate">{equipment.location}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-stone-600">
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
                                                    <AvailabilityBadge available={quantity > 0} />
                                                    <p className="mt-1 text-xs text-stone-400">
                                                        {quantity} in stock
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/browse-equipments/${equipment._id}`}
                                                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 text-[11px] font-semibold whitespace-nowrap text-stone-600 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 sm:text-xs"
                                                        >
                                                            <Eye className="size-3.5" aria-hidden="true" />
                                                            View Details
                                                        </Link>

                                                        <RemoveFavoriteDialog favEquipId={myFavorites[idx]._id}></RemoveFavoriteDialog>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & tablet cards */}
                        <div className="space-y-3 p-3 sm:space-y-4 sm:p-4 xl:hidden">
                            {favoriteEquipments.map((equipment, idx) => {
                                const price = Number(equipment.rentalPrice) || 0;
                                const quantity = Number(equipment.availableQuantity) || 0;

                                return (
                                    <article
                                        key={equipment._id}
                                        className="rounded-2xl border border-stone-200/90 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                                    >
                                        <div className="flex items-start gap-3">
                                            <EquipmentThumb
                                                equipment={equipment}
                                                className="size-12 sm:size-14"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                    <h2 className="min-w-0 truncate text-sm font-bold text-slate-900 sm:text-base">
                                                        {equipment.name}
                                                    </h2>
                                                    <AvailabilityBadge available={quantity > 0} />
                                                </div>

                                                {(equipment.brand || equipment.model) && (
                                                    <p className="mt-1 truncate text-[11px] text-stone-500 sm:text-xs">
                                                        {[equipment.brand, equipment.model]
                                                            .filter(Boolean)
                                                            .join(" · ")}
                                                    </p>
                                                )}

                                                {equipment.location && (
                                                    <p className="mt-1 flex items-center gap-1 text-[11px] text-stone-400 sm:text-xs">
                                                        <MapPin className="size-3 shrink-0 text-orange-500" aria-hidden="true" />
                                                        <span className="truncate">{equipment.location}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <dl className="mt-3.5 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-3 sm:gap-2.5">
                                            <div className="col-span-2 rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-100 sm:col-span-1">
                                                <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                    Category
                                                </dt>
                                                <dd className="mt-1 truncate text-xs font-semibold text-slate-800 sm:text-sm">
                                                    {equipment.category}
                                                </dd>
                                            </div>

                                            <div className="rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-100">
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

                                            <div className="rounded-xl bg-stone-50 px-3 py-2 ring-1 ring-stone-100">
                                                <dt className="text-[9px] font-bold tracking-widest text-stone-400 uppercase sm:text-[10px]">
                                                    Available
                                                </dt>
                                                <dd className="mt-1 text-xs font-semibold text-slate-800 sm:text-sm">
                                                    {quantity}
                                                    <span className="ml-1 text-[10px] font-normal text-stone-400 sm:text-xs">
                                                        units
                                                    </span>
                                                </dd>
                                            </div>
                                        </dl>

                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <Link
                                                href={`/browse-equipments/${equipment._id}`}
                                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 text-[11px] font-semibold whitespace-nowrap text-stone-600 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 sm:text-xs"
                                            >
                                                <Eye className="size-3.5" aria-hidden="true" />
                                                View Details
                                            </Link>

                                            <RemoveFavoriteDialog favEquipId={myFavorites[idx]._id}></RemoveFavoriteDialog>
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

export default FavoritesPage;
