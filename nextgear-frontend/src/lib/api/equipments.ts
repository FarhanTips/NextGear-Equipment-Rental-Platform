

import { authFetch } from "../core/server";


export const getEquipments = async (query="") => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/equipments?${query}`;
  const res = await authFetch(api);
  return res;
}

export const getEquipmentById = async (id: string) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/equipments/${id}`;
  const res = await authFetch(api);
  return res;
}

export const getOwnerEquipments = async (ownerId: string) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/owner-equipments/${ownerId}`;
  const res = await authFetch(api);
  return res;
}

export const getAllEquipments = async () => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/all-equipments`;
  const res = await authFetch(api);
  return res;
}
