import { authMutate } from "../core/server";


export const verifiedBooking = async (sessionId: string) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/verified-bookings`;
  const res = await authMutate(api, "POST", {sessionId});
  return res;
}
