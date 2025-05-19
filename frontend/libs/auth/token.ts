import { cookies } from "next/headers";

export default async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("CASHTRACKR_TOKEN");
  return token?.value;
}
