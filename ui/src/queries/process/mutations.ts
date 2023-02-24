import CustomException from "../../lib/CustomException";
import { post } from "../../lib/request";

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
