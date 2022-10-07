import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_BASE_URL = "https://api.web3events.ai";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (build) => ({
    getEventExplorerEvents: build.query({
      query: () => "events/tiers",
      transformResponse: (response: { data: [] }) => response.data,
    }),
  }),
});

export const { useGetEventExplorerEventsQuery } = api;
