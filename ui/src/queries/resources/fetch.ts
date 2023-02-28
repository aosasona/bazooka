import CustomException from "../../lib/CustomException";
import { get } from "../../lib/request";
import type { SystemResources } from "../../lib/types";

export async function fetchSystemResources(): Promise<SystemResources> {
  const data = await get("/resources");
  if (!data.ok) {
    throw new CustomException(data.message);
  }

  return data.data;
}
