

import { authMutate } from "../core/server";


export const createEquipment = async (newEquip: Record<string, string | number | Date>) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/add-equipment`;
  const res = await authMutate(api, "POST", newEquip);
  return res;
}

export const deleteEquipment = async (equipId: string) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/delete-equipment/${equipId}`;
  const res = await authMutate(api, "DELETE");
  return res;
}

export const UpdateEquipment = async (equipId: string, editedEquipment: Record<string, string | number>) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/update-equipment/${equipId}`;
  const res = await authMutate(api, "PATCH", editedEquipment);
  return res;
}

export const UpdateEquipmentStatus = async (equipId: string, equipStatus: string) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/update-equipment-status/${equipId}`;
  const res = await authMutate(api, "PATCH", {status: equipStatus});
  return res;
}
