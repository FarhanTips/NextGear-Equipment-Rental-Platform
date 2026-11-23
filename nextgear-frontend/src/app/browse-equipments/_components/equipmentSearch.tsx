

"use client";

import { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

const EquipmentSearch = () => {
    const router = useRouter();

    const handleSearch = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        console.log("data from search", data);

        const params = new URLSearchParams(window.location.search);
        params.set("search", data.searchField);
        router.push(`/browse-equipments?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
        >
            <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-300" />

            <div className="p-4">
                <div className="flex items-center gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                        <Search className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Search</h2>
                        <p className="text-[11px] text-stone-500">Search by name or location</p>
                    </div>
                </div>

                <div className="relative mt-4">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
                    <input
                        name="searchField"
                        type="text"
                        placeholder="e.g. Sony A7 III or Dhaka"
                        className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50/60 pr-3 pl-9 text-sm text-stone-900 transition-colors outline-none placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-3 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 text-sm font-bold text-white shadow-md shadow-orange-600/20 transition-all duration-200 hover:from-orange-500 hover:to-amber-400 hover:shadow-orange-500/30"
                >
                    Search
                    <ArrowRight className="size-4" aria-hidden="true" />
                </button>
            </div>
        </form>
    );
};

export default EquipmentSearch;
