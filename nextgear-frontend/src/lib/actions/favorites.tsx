

import { authMutate } from "../core/server";


export const createFavorite = async (newFav: Record<string, string | Date>) => {
    const api = `${process.env.NEXT_PUBLIC_API_URL}/add-favorite`;
    const res = await authMutate(api, "POST", newFav);
    return res;
}
