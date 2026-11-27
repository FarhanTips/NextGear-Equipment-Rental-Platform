

import { authMutate } from "../core/server";


export const UpdateUserRole = async (userId: string, userRole: string) => {
  const api = `${process.env.NEXT_PUBLIC_API_URL}/update-userRole/${userId}`;
  const res = await authMutate(api, "PATCH", {userRole});
  return res;
}
