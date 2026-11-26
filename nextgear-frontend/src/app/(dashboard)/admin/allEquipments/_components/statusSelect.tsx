

"use client";

import { toast } from "@/components/ui/toast";
import { UpdateEquipmentStatus } from "@/lib/actions/equipments";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statusStyles: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const StatusSelect = ({ equipmentId, equipStatus }: { equipmentId: string; equipStatus: string }) => {
    const router = useRouter();

    const [value, setValue] = useState(equipStatus);

    const handleStatusChange = async (changedStatus: string) => {
        setValue(changedStatus);
        // TODO: update status using equipmentId
        // console.log(equipmentId, changedStatus);
        const statusUpdateResult = await UpdateEquipmentStatus(equipmentId, changedStatus);
        console.log("statusUpdateResult", statusUpdateResult);
        if (statusUpdateResult.modifiedCount > 0) {
            toast.add({
                type: "success",
                description: "Status updated successfully!",
            });
            router.refresh();
        }
        else {
            toast.add({
                type: "error",
                description: "Status Update Failed. Try Again Later!",
            });
        }
    };

    return (
        <select
            value={value}
            onChange={(event) => handleStatusChange(event.target.value)}
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
