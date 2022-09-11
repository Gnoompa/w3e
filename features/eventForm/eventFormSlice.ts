import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SocialMediaIds } from "helpers/hooks";
import { RootState } from "app/store";

export interface State {
  fields: { name: string; tabId: number; isInvalid: boolean }[];
  eventPoster?: Blob;
  ticketPoster?: Blob;
}

export const initialState: State = {
  fields: [],
};

export const slice = createSlice({
  name: "eventForm",
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<State>) => action.payload,
    setFields: (state, action: PayloadAction<State["fields"]>) => {
      state.fields = action.payload;
    },
    setEventPoster: (state, action: PayloadAction<State["eventPoster"]>) => {
      state.eventPoster = action.payload;
    },
    setTicketPoster: (state, action: PayloadAction<State["ticketPoster"]>) => {
      state.ticketPoster = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setFields, resetState, setEventPoster, setTicketPoster } =
  slice.actions;

export const selectInvalidFields = (state: RootState) =>
  state.eventForm.fields.filter(({ isInvalid }) => isInvalid);

export default slice.reducer;
