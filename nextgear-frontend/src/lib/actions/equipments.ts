

import { authMutate } from "../core/server";
import { NewEquipType } from "../types/equipmentType";


export const createEquipment = async (newEquip: NewEquipType) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/add-equipment`;
  const res = await authMutate(api, "POST", newEquip);
  return res;
}
