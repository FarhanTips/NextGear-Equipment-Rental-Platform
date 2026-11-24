

import { authMutate } from "../core/server";


export const createFavorite = async (newFav: Record<string, string | Date>) => {
    const api = `${process.env.NEXT_PUBLIC_API_URL}/add-favorite`;
    const res = await authMutate(api, "POST", newFav);
    return res;
}

export const deleteFavEquip = async (favEquipId: string) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/delete-favEquip/${favEquipId}`;
  const res = await authMutate(api, "DELETE");
  return res;
}
