

"use client";

import { ChangeEvent } from "react";
import { ArrowDownWideNarrow, CalendarClock, Check, CircleCheck, DollarSign, RotateCcw, SlidersHorizontal, Tag, } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
    "Cameras & Photography",
    "Audio & Sound",
    "Lighting & Studio",
    "Drones & Aerial",
    "Computers & Tablets",
    "Tools & Machinery",
    "Events & Party",
    "Sports & Outdoor",
    "Other",
];

const rentalTypes = ["Daily", "Weekly", "Monthly"];

const prices = [
    { label: "Under $50", value: "1-49" },
    { label: "$50 – $150", value: "50-150" },
    { label: "$151 – $300", value: "151-300" },
    { label: "Above $300", value: "301-" },
];

const availabilityOptions = [
    { label: "1 to 5", value: "low-stock" },
    { label: "Above 5", value: "full-stock" },
];

const sortOptions = [
    { label: "Recently Added", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
];

const optionClass =
    "group flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-stone-600 transition-colors select-none hover:bg-stone-50 has-checked:bg-orange-50 has-checked:font-semibold has-checked:text-orange-700";

const boxClass =
    "grid size-4 shrink-0 place-items-center rounded-[5px] border-2 border-stone-300 bg-white text-white transition-colors group-has-focus-visible:ring-2 group-has-focus-visible:ring-orange-500/30 peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:[&_svg]:opacity-100";

const EquipmentFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // console.log(searchParams.toString());

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        const params = new URLSearchParams(window.location.search);
        console.log("params", params.toString());

        // Price options are ranges like "50-150", so set minPrice and maxPrice.
        if (name === "price") {
            const [minPrice, maxPrice] = value.split("-");

            params.set("minPrice", minPrice);

            if (maxPrice) {
                params.set("maxPrice", maxPrice);
            } else {
                params.delete("maxPrice");
            }
        } else {
            params.set(name, value);
        }

        router.push(`/browse-equipments?${params.toString()}`);
    };

    const handleClear = () => {
        router.push("/browse-equipments");
    };

    return (
        <aside
            aria-label="Equipment filters"
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
        >
            <div className="flex items-center justify-between gap-2 border-b border-stone-100 bg-stone-50/60 px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                        <SlidersHorizontal className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">Filters</h2>
                        <p className="text-[11px] text-stone-500">Narrow down your results</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-2.5 text-[11px] font-bold text-orange-700 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-100 hover:text-orange-800"
                >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    Clear All
                </button>
            </div>

            <div className="space-y-4 p-4">
                {/* Category */}
                <fieldset>
                    <legend className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase">
                        <Tag className="size-3.5 text-orange-500" aria-hidden="true" />
                        Equipment Category
                    </legend>

                    <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
                        {categories.map((category) => (
                            <label key={category} className={optionClass}>
                                <input
                                    type="radio"
                                    name="category"
                                    value={category}
                                    checked={searchParams.get("category") === category}
                                    onChange={handleOnChange}
                                    className="peer sr-only"
                                />
                                <span className={boxClass}>
                                    <Check className="size-3 opacity-0 transition-opacity" strokeWidth={3} aria-hidden="true" />
                                </span>
                                <span className="truncate">{category}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Rental type */}
                <fieldset className="border-t border-stone-100 pt-4">
                    <legend className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase">
                        <CalendarClock className="size-3.5 text-orange-500" aria-hidden="true" />
                        Rental Type
                    </legend>

                    <div className="space-y-0.5">
                        {rentalTypes.map((type) => (
                            <label key={type} className={optionClass}>
                                <input
                                    type="radio"
                                    name="rentalType"
                                    value={type}
                                    checked={searchParams.get("rentalType") === type}
                                    onChange={handleOnChange}
                                    className="peer sr-only"
                                />
                                <span className={boxClass}>
                                    <Check className="size-3 opacity-0 transition-opacity" strokeWidth={3} aria-hidden="true" />
                                </span>
                                <span className="truncate">{type}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Price range */}
                <fieldset className="border-t border-stone-100 pt-4">
                    <legend className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase">
                        <DollarSign className="size-3.5 text-orange-500" aria-hidden="true" />
                        Price Range
                    </legend>

                    <div className="space-y-0.5">
                        {prices.map((price) => (
                            <label key={price.label} className={optionClass}>
                                <input
                                    type="radio"
                                    name="price"
                                    value={price.value}
                                    checked={
                                        searchParams.get("minPrice") === price.value.split("-")[0] &&
                                        (searchParams.get("maxPrice") ?? "") === price.value.split("-")[1]
                                    }
                                    onChange={handleOnChange}
                                    className="peer sr-only"
                                />
                                <span className={boxClass}>
                                    <Check className="size-3 opacity-0 transition-opacity" strokeWidth={3} aria-hidden="true" />
                                </span>
                                <span className="truncate">{price.label}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Availability */}
                <fieldset className="border-t border-stone-100 pt-4">
                    <legend className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase">
                        <CircleCheck className="size-3.5 text-orange-500" aria-hidden="true" />
                        Available Units
                    </legend>

                    <div className="space-y-0.5">
                        {availabilityOptions.map((option) => (
                            <label key={option.value} className={optionClass}>
                                <input
                                    type="radio"
                                    name="availableQuantity"
                                    value={option.value}
                                    checked={searchParams.get("availableQuantity") === option.value}
                                    onChange={handleOnChange}
                                    className="peer sr-only"
                                />
                                <span className={boxClass}>
                                    <Check className="size-3 opacity-0 transition-opacity" strokeWidth={3} aria-hidden="true" />
                                </span>
                                <span className="truncate">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Sorting */}
                <fieldset className="border-t border-stone-100 pt-4">
                    <legend className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] text-stone-400 uppercase">
                        <ArrowDownWideNarrow className="size-3.5 text-orange-500" aria-hidden="true" />
                        Sorting
                    </legend>

                    <div className="space-y-0.5">
                        {sortOptions.map((option) => (
                            <label key={option.value} className={optionClass}>
                                <input
                                    type="radio"
                                    name="sort"
                                    value={option.value}
                                    checked={searchParams.get("sort") === option.value}
                                    onChange={handleOnChange}
                                    className="peer sr-only"
                                />
                                <span className={boxClass}>
                                    <Check className="size-3 opacity-0 transition-opacity" strokeWidth={3} aria-hidden="true" />
                                </span>
                                <span className="truncate">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
            </div>
        </aside>
    );
};

export default EquipmentFilters;
