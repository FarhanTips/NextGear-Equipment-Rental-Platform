

import { authMutate } from "../core/server";


export const createEquipment = async (newEquip) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/add-equipment`;
  const res = await authMutate(api, "POST", newEquip);
  return res;
}
