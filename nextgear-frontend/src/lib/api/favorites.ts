

import { authFetch } from "../core/server";


export const getMyFavorites = async (query="") => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/my-favorites?${query}`;
  const res = await authFetch(api);
  return res;
}
