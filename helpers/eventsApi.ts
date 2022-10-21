import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BigNumberish } from "ethers";

export const API_BASE_URL = /.*test|localhost.*/.test(global.location?.href)
  ? "https://api.test.web3events.ai"
  : "https://api.web3events.ai";

const transformResponse = (response: { data: [] }) => response.data;

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (build) => ({
    getEvents: build.query({
      query: (status: string = "") => `events/tiers?status=${status}`,
      transformResponse,
    }),
    getEvent: build.query({
      query: (eventTokenId: BigNumberish) => `event/${eventTokenId}/tiers`,
      transformResponse,
    }),
  }),
});

export const { useGetEventQuery, useGetEventsQuery, useLazyGetEventsQuery } =
  api;
