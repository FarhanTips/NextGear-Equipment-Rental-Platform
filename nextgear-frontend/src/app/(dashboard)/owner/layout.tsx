

import { requireRole } from "@/lib/core/server";

const OwnerLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireRole("owner");
    return children;
};

export default OwnerLayout;
