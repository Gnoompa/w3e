import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_BASE_URL = /.*test|localhost.*/.test(global.location?.href)
  ? "https://api.test.web3events.ai"
  : "https://api.web3events.ai";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (build) => ({
    getEventExplorerEvents: build.query({
      query: (status: string = "") => `events/tiers?status=${status}`,
      transformResponse: (response: { data: [] }) => response.data,
    }),
  }),
});

export const {
  useGetEventExplorerEventsQuery,
  useLazyGetEventExplorerEventsQuery,
} = api;
