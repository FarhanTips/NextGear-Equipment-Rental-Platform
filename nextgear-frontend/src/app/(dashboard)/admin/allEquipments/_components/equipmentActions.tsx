"use client";

import { Pencil, Trash2 } from "lucide-react";

const buttonClass =
    "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold whitespace-nowrap transition-colors sm:text-xs";

const EquipmentActions = ({ equipmentId }: { equipmentId: string }) => {
    const handleUpdate = () => {
        // TODO: implement update using equipmentId
        console.log("update", equipmentId);
    };

    return (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
            <button
                type="button"
                onClick={handleUpdate}
                className={`${buttonClass} border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100`}
            >
                <Pencil className="size-3.5" aria-hidden="true" />
                Update
            </button>

            <button
                type="button"
                className={`${buttonClass} border-stone-200 bg-white text-stone-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600`}
            >
                <Trash2 className="size-3.5" aria-hidden="true" />
                Delete
            </button>
        </div>
    );
};

export default EquipmentActions;
