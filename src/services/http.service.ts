import axios, { AxiosRequestConfig } from "axios";
import { from, map } from "rxjs";

const get = <T>(url: string, config?: AxiosRequestConfig) => {
  return from(axios.get<T>(url, config)).pipe(map((response) => response.data));
};

export const httpService = {
  get,
};
