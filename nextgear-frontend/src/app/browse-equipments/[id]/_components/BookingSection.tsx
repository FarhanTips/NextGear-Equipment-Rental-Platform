


"use client";

import { SyntheticEvent, useState } from "react";
import { CalendarDays, CreditCard } from "lucide-react";
import { EquipmentType } from "@/lib/types/equipmentType";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100";

const labelClass = "text-xs font-semibold text-stone-600";

const unitDays = { Daily: 1, Weekly: 7, Monthly: 30 };

interface BookingSectionProps {
  equipment: EquipmentType;
}

export default function BookingSection({ equipment }: BookingSectionProps) {
  const { data: session } = authClient.useSession();

  const { rentalPrice, rentalType, availableQuantity } = equipment;

  const period = rentalType.toLowerCase();

  const [bookingInfo, setBookingInfo] = useState({
    startDate: "",
    endDate: "",
    quantity: 1,
  });

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const days =
    bookingInfo.startDate && bookingInfo.endDate
      ? Math.round(
        (new Date(bookingInfo.endDate).getTime() -
          new Date(bookingInfo.startDate).getTime()) /
        86400000
      )
      : 0;

  const duration =
    days > 0 ? Math.ceil(days / unitDays[rentalType]) : 0;

  const total = duration * bookingInfo.quantity * rentalPrice;

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (session?.user.userRole !== "customer") {
      toast.add({
        type: "error",
        description: "Booking is available for CUSTOMERS only!",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);

    const bookingData = {
      equipmentId: equipment._id,
      email: session?.user.email,
      address: formData.get("address"),
      additionalNotes: formData.get("additionalNotes"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      requiredQuantity: Number(formData.get("quantity")),
      contactNumber: formData.get("contactNumber"),
      customerId: session?.user.id,
      days,
      duration,
      rentalType,
      rentalPrice,
      total,
    };

    console.log("bookingData", bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className={labelClass}>
            Rental from
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
            min={today}
            value={bookingInfo.startDate}
            onChange={(e) =>
              setBookingInfo({ ...bookingInfo, startDate: e.target.value })
            }
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="endDate" className={labelClass}>
            Rental end
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
            min={bookingInfo.startDate || today}
            value={bookingInfo.endDate}
            onChange={(e) =>
              setBookingInfo({ ...bookingInfo, endDate: e.target.value })
            }
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className={labelClass}>
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          max={availableQuantity}
          required
          value={bookingInfo.quantity}
          onChange={(e) =>
            setBookingInfo({
              ...bookingInfo, quantity: Math.min(Math.max(Number(e.target.value) || 1, 1), availableQuantity),
            })
          }
          className={inputClass}
        />
        <p className="mt-1 text-[11px] text-stone-400">
          {availableQuantity} units available
        </p>
      </div>

      <div>
        <label htmlFor="contactNumber" className={labelClass}>Contact Number</label>
        <input
          id="contactNumber"
          name="contactNumber"
          type="tel"
          placeholder="e.g. 01XXXXXXXXX"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="address" className={labelClass}>Address</label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="Street, city, zip code"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="additionalNotes" className={labelClass}>
          Additional Notes (optional)
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          rows={3}
          placeholder="Anything the owner should know?"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
        <div className="flex justify-between text-sm">
          <span>Rate</span>
          <span>${rentalPrice.toLocaleString()} / {period}</span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span>Quantity</span>
          <span>{bookingInfo.quantity}</span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span>Duration</span>
          <span>
            {duration > 0 ? `${duration} ${period}${duration === 1 ? "" : "s"}` : "Select dates"}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-orange-200/70 pt-3">
          <span className="text-sm font-semibold flex items-center gap-2">
            <CreditCard className="size-4 text-orange-500" />
            Estimated total
          </span>
          <span className="text-2xl font-extrabold text-orange-600">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={duration < 1}
        className="w-full h-12 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-6 text-sm font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CalendarDays className="size-4 inline mr-2" />
        Confirm Booking
      </button>

      <p className="text-center text-[11px] text-stone-400">
        No charge until confirmed by the owner.
      </p>
    </form>
  );
}
