import axios from "axios";
import type {  Method } from "axios";

const axiosInstance = axios.create({});

export interface AxiosInput {
  method: Method; // "GET" | "POST" | "PUT" | "DELETE" ...
  url: string; // URL as string (not the URL object)
  data?: any; // optional
  headers?: Record<string, string>; // optional
  params?: Record<string, any>; // optional
}

export const apiConnector = async ({
  method,
  url,
  data,
  headers,
  params,
}: AxiosInput) => {
  return axiosInstance({
    method,
    url,
    data: data ?? null,
    headers: headers ?? undefined,
    params: params ?? undefined,
  });
};
