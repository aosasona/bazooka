import CustomException from "../../lib/CustomException";
import { get } from "../../lib/request";
import type { Process } from "../../lib/types";

export async function fetchProcesses(): Promise<Process[]> {
  const data = await get("/processes");
  if (!data.ok) {
    throw new CustomException(data.message);
  }

  return data.data;
}
