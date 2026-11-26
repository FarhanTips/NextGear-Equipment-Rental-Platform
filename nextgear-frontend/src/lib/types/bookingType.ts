

export interface BookingType {
  _id: string;
  sessionId: string;
  status: string;
  payment_status: string;
  payment_intent: string;
  metadata: {
    additionalNotes: string;
    address: string;
    contactNumber: string;
    customerId: string;
    endDate: string;
    equipmentId: string;
    requiredQuantity: string;
    startDate: string;
  };
  customer_email: string;
  paid_amount: number;
  currency: string;
  payment_date: string;
}
