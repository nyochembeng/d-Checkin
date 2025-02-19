import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Array {
  // Define your types here
  id: number;
  name: string;
}

export const counterApiSlice = createApi({
  reducerPath: "counterApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.example.com",
    prepareHeaders(headers) {
      // If you need to add headers, do so here
      headers.set("Authorization", "api-key");

      return headers;
    },
  }),
  endpoints(builder) {
    // Define your API endpoints here
    return {
      fetchArray: builder.query<Array[], number | void>({
        query(limit = 10) {
          return `/array?limit=${limit}`;
        },
      }),
    };
  },
});

export const { useFetchArrayQuery } = counterApiSlice;