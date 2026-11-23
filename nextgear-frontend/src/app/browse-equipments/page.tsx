import { getEquipments } from "@/lib/api/equipments";


interface BrowseEquipmentsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const BrowseEquipmentsPage = async ({ searchParams }: BrowseEquipmentsPageProps) => {
    const queryObject = await searchParams;
    console.log("queryObject", queryObject);
    const query = new URLSearchParams(queryObject as Record<string, string>).toString();
    console.log("query", query);

    const equipments = await getEquipments(query);
    console.log("equipments", equipments);
    return (
        <div>

        </div>
    );
};

export default BrowseEquipmentsPage;
