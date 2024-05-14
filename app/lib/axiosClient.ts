import { Axios } from "axios";

export const client = new Axios({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
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
