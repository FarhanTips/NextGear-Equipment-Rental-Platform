

import { authFetch } from "../core/server";


export const getEquipments = async (query="") => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/equipments?${query}`;
  const res = await authFetch(api);
  return res;
}
