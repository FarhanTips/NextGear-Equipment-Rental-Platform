import { authFetch } from "../core/server";


export const getUserById = async (id: string) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`;
  const res = await authFetch(api);
  return res;
}

export const getAllUsers = async () => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/all-users`;
  const res = await authFetch(api);
  return res;
}
