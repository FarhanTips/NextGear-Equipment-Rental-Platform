import { authFetch } from "../core/server";


export const getBookingsByUserId = async (id: string) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/rentals/${id}`;
  const res = await authFetch(api);
  return res;
}
