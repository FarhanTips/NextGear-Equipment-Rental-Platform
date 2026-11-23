

import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Package } from "lucide-react";

import { EquipmentType } from "@/lib/types/equipmentType";

const rentalPeriod = (type: string) => {
    if (type === "Weekly") return "week";
    if (type === "Monthly") return "month";
    return "day";
};

const EquipmentCard = ({ equipment }: { equipment: EquipmentType }) => {
    const price = Number(equipment.rentalPrice) || 0;
    const available = Number(equipment.availableQuantity) > 0;

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5">
            {/* Image */}
            <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                {equipment.image ? (
                    <div
                        role="img"
                        aria-label={equipment.name}
                        className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${equipment.image})` }}
                    />
                ) : (
                    <div className="grid h-full place-items-center text-stone-300">
                        <Package className="size-10" aria-hidden="true" />
                    </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-slate-900/45 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 max-w-[70%] truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-stone-700 shadow-sm backdrop-blur">
                    {equipment.category}
                </span>

                <span
                    className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur ${
                        available
                            ? "bg-emerald-50/95 text-emerald-700"
                            : "bg-rose-50/95 text-rose-700"
                    }`}
                >
                    <span
                        className={`size-1.5 rounded-full ${
                            available ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                        aria-hidden="true"
                    />
                    {available ? "Available" : "Unavailable"}
                </span>
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col p-4">
                <h2 className="line-clamp-1 text-base font-bold text-slate-900">
                    {equipment.name}
                </h2>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-stone-500">
                    <MapPin className="size-3.5 shrink-0 text-orange-500" aria-hidden="true" />
                    <span className="line-clamp-1">{equipment.location}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2 py-1 text-[11px] font-semibold text-stone-600">
                        <Clock3 className="size-3" aria-hidden="true" />
                        {equipment.rentalType}
                    </span>

                    {available && (
                        <span className="text-[11px] text-stone-400">
                            {equipment.availableQuantity} available
                        </span>
                    )}
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-stone-100 pt-4">
                    <p className="text-lg font-extrabold text-slate-900">
                        ${price.toLocaleString()}
                        <span className="ml-1 text-[11px] font-medium text-stone-400">
                            / {rentalPeriod(equipment.rentalType)}
                        </span>
                    </p>

                    <Link
                        href={`/browse-equipments/${equipment._id}`}
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-3.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30"
                    >
                        View Details
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default EquipmentCard;
