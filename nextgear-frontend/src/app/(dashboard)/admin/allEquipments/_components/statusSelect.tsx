"use client";

import { useState } from "react";

const statusStyles: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const StatusSelect = ({ equipmentId, status }: { equipmentId: string; status: string }) => {
    const [value, setValue] = useState(status || "Pending");

    const handleStatus = (next: string) => {
        setValue(next);
        // TODO: update status using equipmentId
        console.log(equipmentId, next);
    };

    return (
        <select
            value={value}
            onChange={(event) => handleStatus(event.target.value)}
            aria-label="Change equipment status"
            className={`h-8 cursor-pointer rounded-lg border px-2.5 text-xs font-semibold outline-none transition-colors focus:ring-2 focus:ring-orange-200 ${statusStyles[value.toLowerCase()] ?? statusStyles.pending}`}
        >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
        </select>
    );
};

export default StatusSelect;
