
"use client";

import { toast } from "@/components/ui/toast";
import { UpdateUserRole } from "@/lib/actions/users";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roleStyles: Record<string, string> = {
    admin: "border-violet-200 bg-violet-50 text-violet-700",
    owner: "border-orange-200 bg-orange-50 text-orange-700",
    customer: "border-sky-200 bg-sky-50 text-sky-700",
};

const RoleSelect = ({ userId, userRole }: { userId: string; userRole: string }) => {
    const router = useRouter();
    
    const [role, setRole] = useState(userRole);

    const handleUserRole = async (newRole: string) => {
        setRole(newRole);

        // TODO: connect your role update logic here.
        // console.log(userId, newRole);
        const updateUserRoleResult = await UpdateUserRole(userId, newRole);
        console.log("updateUserRoleResult", updateUserRoleResult);
        if (updateUserRoleResult.modifiedCount > 0) {
            toast.add({
                type: "success",
                description: "userRole updated successfully!",
            });
            router.refresh();
        }
        else {
            toast.add({
                type: "error",
                description: "userRole Update Failed. Try Again Later!",
            });
        }
    };

    return (
        <select
            value={role}
            onChange={(event) => handleUserRole(event.target.value)}
            aria-label="Change user role"
            className={`h-8 cursor-pointer rounded-lg border px-2 text-xs font-semibold outline-none ${roleStyles[role] ?? roleStyles.customer}`}
        >
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
            <option value="customer">Customer</option>
        </select>
    );
};

export default RoleSelect;
