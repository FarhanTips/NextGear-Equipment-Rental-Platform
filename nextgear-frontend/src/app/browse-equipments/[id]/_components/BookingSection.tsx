"use client";

import { useState } from "react";
import { CalendarDays, CreditCard, CheckCircle2 } from "lucide-react";

type Props = {
  equipmentName: string;
  rentalPrice: number;
  rentalType: string;
  availableQuantity: number;
  onBook?: (data: {
    rentalStartDate: string;
    rentalEndDate: string;
    mobileNo: string;
    email: string;
    deliveryAddress: string;
    specialInstructions: string;
    quantity: number;
    total: number;
    duration: number;
    period: string;
  }) => void;
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100";
const labelClass = "text-xs font-semibold text-stone-600";

export default function BookingSection({
  equipmentName,
  rentalPrice,
  rentalType,
  availableQuantity,
  onBook,
}: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const period =
    rentalType === "Weekly" ? "week" : rentalType === "Monthly" ? "month" : "day";

  let duration = 0;
  if (startDate && endDate) {
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (days > 0) {
      if (rentalType === "Weekly") duration = Math.ceil(days / 7);
      else if (rentalType === "Monthly") duration = Math.ceil(days / 30);
      else duration = days;
    }
  }

  const total = rentalPrice * quantity * Math.max(duration, 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !mobileNo || !email || !deliveryAddress) return;
    onBook?.({
      rentalStartDate: startDate,
      rentalEndDate: endDate,
      mobileNo,
      email,
      deliveryAddress,
      specialInstructions,
      quantity,
      total,
      duration: Math.max(duration, 1),
      period,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">Booking Request Submitted</h3>
        <p className="mt-2 text-sm text-stone-600">
          Received your booking for <strong>{equipmentName}</strong>.
        </p>
        <div className="mt-6 rounded-xl bg-stone-50 p-4 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-stone-600">Total</span>
            <span className="font-bold text-orange-600">${total.toLocaleString()}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-stone-600">{quantity} × {duration} {period}{duration === 1 ? "" : "s"}</span>
            <span className="font-semibold text-slate-900">@ ${rentalPrice.toLocaleString()}/{period}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="start" className={labelClass}>Rental start date</label>
          <input id="start" type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="end" className={labelClass}>Rental end date</label>
          <input id="end" type="date" required min={startDate || undefined} value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="mobile" className={labelClass}>Mobile no</label>
          <input id="mobile" type="tel" placeholder="+1 555 000 0000" required value={mobileNo} onChange={e => setMobileNo(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="address" className={labelClass}>Delivery address</label>
        <input id="address" type="text" placeholder="Street, city, zip code" required value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>Special instructions (optional)</label>
        <textarea id="notes" rows={3} placeholder="Anything the owner should know?" value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)} className={`${inputClass} resize-none`} />
      </div>

      <div>
        <label htmlFor="qty" className={labelClass}>Quantity</label>
        <input id="qty" type="number" min={1} max={availableQuantity} required value={quantity} onChange={e => {
          const v = Number(e.target.value) || 1;
          setQuantity(Math.min(Math.max(v, 1), availableQuantity));
        }} className={inputClass} />
        <p className="mt-1 text-[11px] text-stone-400">{availableQuantity} unit{availableQuantity === 1 ? "" : "s"} available</p>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-stone-600">Rate</span>
          <span className="font-semibold text-slate-900">${rentalPrice.toLocaleString()} / {period}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-stone-600">Quantity</span>
          <span className="font-semibold text-slate-900">{quantity}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-stone-600">Duration</span>
          <span className="font-semibold text-slate-900">{duration > 0 ? `${duration} ${period}${duration === 1 ? "" : "s"}` : "Select dates"}</span>
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-orange-200/70 pt-3">
          <span className="text-sm font-semibold text-stone-700 flex items-center gap-2"><CreditCard className="size-4 text-orange-500" aria-hidden="true" />{duration > 0 ? "Total" : "Estimated total"}</span>
          <span className="text-2xl font-extrabold text-orange-600">${total.toLocaleString()}</span>
        </div>
      </div>

      <button type="submit" disabled={!startDate || !endDate || !mobileNo || !email || !deliveryAddress} className="w-full h-12 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-500 hover:to-amber-400">
        <CalendarDays className="size-4 inline mr-2" aria-hidden="true" />Confirm Booking
      </button>

      <p className="text-center text-[11px] text-stone-400">No charge until confirmed by the owner.</p>
    </form>
  );
}