import CustomException from "../../lib/CustomException";
import { get, post } from "../../lib/request";

export async function killProcesses(PIDs: Number[]) {
  const body = {
    pids: PIDs,
  };
  const data = await post("/processes/kill", body);

  if (!data.ok) {
    throw new CustomException(data.message);
  }

  return data.data;
}

export async function findByPort(port: string) {
  const data = await get(`/processes/port/${port}`);

  if (!data.ok) {
    throw new CustomException(data.message);
  }

  return data.data;
}
