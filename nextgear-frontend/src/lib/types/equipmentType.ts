

export interface NewEquipType {
    name: string;
    description: string;
    category: string;
    location: string;
    rentalPrice: string;
    rentalType: "Daily" | "Weekly" | "Monthly";
    availableQuantity: string;
    condition: "Brand New" | "Excellent" | "Good" | "Fair";
    brand: string;
    model: string;
    rentalTerms: string;
    status: "Pending" | "Approved" | "Rejected";
    image: string;
    ownerId: string;
}


export interface EquipmentType extends NewEquipType{
    _id: string;
}
