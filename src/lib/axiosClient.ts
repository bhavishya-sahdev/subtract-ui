import { Axios } from "axios";

export const client = new Axios({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
  /** Needed if you want to set cookies on the frontend */
  withCredentials: true,
  transformRequest: [
    function (data) {
      // Automatically parse data as JSON
      return JSON.stringify(data);
    },
  ],
  transformResponse: [
    function (data) {
      // Automatically parse data as JSON
      return JSON.parse(data);
    },
  ],
});
