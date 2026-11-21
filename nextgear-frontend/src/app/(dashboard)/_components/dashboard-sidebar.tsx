
'use client'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client";
import { Bookmark, BriefcaseBusiness, ClipboardList, LayoutDashboard, Package, PlusCircle, User, Users } from "lucide-react"


const menuItemsByRole = {
    customer: [
        { name: "My Rentals", url: "/dashboard/customer/rentals", icon: BriefcaseBusiness },
        { name: "Favorites", url: "/dashboard/customer/favorites", icon: Bookmark },
        { name: "Profile", url: "/dashboard/customer/profile", icon: User },
    ],
    owner: [
        { name: "Add Equipment", url: "/dashboard/owner/equipment/add", icon: PlusCircle },
        { name: "My Equipment", url: "/dashboard/owner/equipment", icon: Package },
        { name: "My Equipment Rental", url: "/dashboard/owner/rentals", icon: ClipboardList },
        { name: "My Profile", url: "/dashboard/owner/profile", icon: User },
    ],
    admin: [
        { name: "All Users", url: "/dashboard/admin/users", icon: Users },
        { name: "All Equipment", url: "/dashboard/admin/equipment", icon: Package },
        { name: "All Rentals", url: "/dashboard/admin/rentals", icon: ClipboardList },
        { name: "My Profile", url: "/dashboard/admin/profile", icon: User },
    ],
}


export function DashboardSidebar() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending || !session) {
        return null;
    }

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {
                            menuItemsByRole[session?.user.userRole].map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton render={<a href={item.url} />}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
