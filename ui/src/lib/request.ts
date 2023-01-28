import axios from "axios";

const BASE_API_URL = (import.meta.env?.PUBLIC_API_URL || "") + "/api/v1";

export const request = axios.create({
  baseURL: (import.meta.env?.PUBLIC_API_URL || "") + "/api/v1",
});

export async function get(url: string) {
  try {
    const { data } = await request.get(url);
    return { ok: true, message: data?.message, data: data?.data };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.response?.data?.message || "Something went wrong",
      data: null,
    };
  }
}

export async function post(url: string, body: any) {
  try {
    const { data } = await request.post(url, body);
    return { ok: true, message: data?.message, data: data?.data };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.response?.data?.message || "Something went wrong",
      data: null,
    };
  }
}
