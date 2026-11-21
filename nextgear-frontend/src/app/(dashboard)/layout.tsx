

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./_components/dashboard-sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="min-h-0 flex-1">
            <DashboardSidebar />

            <main className="min-w-0 flex-1">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}
