import { SearchX } from "lucide-react";

import { getEquipments } from "@/lib/api/equipments";
import { EquipmentType } from "@/lib/types/equipmentType";
import EquipmentSearch from "./_components/equipmentSearch";
import EquipmentFilters from "./_components/equipmentFilters";
import EquipmentCard from "./_components/equipmentCard";

interface BrowseEquipmentsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const BrowseEquipmentsPage = async ({ searchParams }: BrowseEquipmentsPageProps) => {
    const queryObject = await searchParams;
    const query = new URLSearchParams(queryObject as Record<string, string>).toString();

    const equipments: EquipmentType[] = await getEquipments(query);

    return (
        <div className="min-h-screen bg-orange-50/30">
            {/* Page heading */}
            <section className="relative overflow-hidden border-b border-orange-100 bg-linear-to-br from-orange-50 via-amber-50/60 to-white">
                <div className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-orange-200/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-amber-200/30 blur-3xl" />

                <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-orange-700 uppercase ring-1 ring-orange-100">
                        <span className="size-1.5 rounded-full bg-orange-500" aria-hidden="true" />
                        Browse Marketplace
                    </span>

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                Rent the gear you need
                            </h1>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500">
                                Browse approved equipment from trusted owners. Filter by category, price,
                                and location to find the perfect match.
                            </p>
                        </div>

                        <span className="w-fit rounded-full border border-orange-100 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-600 shadow-sm">
                            {equipments.length} {equipments.length === 1 ? "item" : "items"} found
                        </span>
                    </div>
                </div>
            </section>

            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="grid gap-6 md:grid-cols-[280px_1fr] lg:gap-8">
                    {/* Sidebar: search + filters */}
                    <div className="flex flex-col gap-4 self-start md:sticky md:top-24">
                        <EquipmentSearch />
                        <EquipmentFilters />
                    </div>

                    {/* Equipment grid */}
                    <section>
                        {equipments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center shadow-sm">
                                <span className="grid size-14 place-items-center rounded-2xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                                    <SearchX className="size-7" aria-hidden="true" />
                                </span>
                                <h2 className="mt-4 text-lg font-bold text-slate-900">
                                    No equipment found
                                </h2>
                                <p className="mt-1 max-w-sm text-sm leading-relaxed text-stone-500">
                                    Try changing your search or filters to see more results.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {equipments.map((equipment) => (
                                    <EquipmentCard key={equipment._id} equipment={equipment} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BrowseEquipmentsPage;
