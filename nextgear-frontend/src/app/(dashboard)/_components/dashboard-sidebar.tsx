

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

import { getSession } from "@/lib/core/server";
import { Bookmark, BriefcaseBusiness, ClipboardList, Package, PlusCircle, User, Users } from "lucide-react"
import Link from "next/link";



const menuItemsByRole = {
    customer: [
        { name: "My Rentals", url: "/customer/myRentals", icon: BriefcaseBusiness },
        { name: "Favorites", url: "/customer/favorites", icon: Bookmark },
        { name: "Profile", url: "/dashboard/customer/profile", icon: User },
    ],
    owner: [
        { name: "Add Equipment", url: "/owner/addEquipment", icon: PlusCircle },
        { name: "My Equipment", url: "/owner/myEquipment", icon: Package },
        { name: "My Equipment Rental", url: "/owner/myEquipmentRental", icon: ClipboardList },
        { name: "My Profile", url: "/dashboard/owner/profile", icon: User },
    ],
    admin: [
        { name: "All Users", url: "/dashboard/admin/users", icon: Users },
        { name: "All Equipment", url: "/admin/allEquipments", icon: Package },
        { name: "All Rentals", url: "/admin/allRentals", icon: ClipboardList },
        { name: "My Profile", url: "/dashboard/admin/profile", icon: User },
    ],
}


export async function DashboardSidebar() {
    const session = await getSession();
    console.log("dashboard session", session);

    if (!session) {
        // redirect("/sign-in"); this is fun, check if you want to enjoy. /unauthorized will not work if you use this. Find why? Hint: dashboard er layout then admin er layout.
        return null;
    }

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {
                            menuItemsByRole[session.user.userRole].map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton render={<Link href={item.url} />}>
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
