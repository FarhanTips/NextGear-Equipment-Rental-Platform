

export interface EquipmentType {
    _id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    rentalPrice: number;
    rentalType: "Daily" | "Weekly" | "Monthly";
    availableQuantity: number;
    condition: "Brand New" | "Excellent" | "Good" | "Fair";
    brand: string;
    model: string;
    rentalTerms: string;
    status: "Pending" | "Approved" | "Rejected";
    image: string;
    ownerId: string;
}
