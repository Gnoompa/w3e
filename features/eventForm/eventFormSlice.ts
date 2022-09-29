import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SocialMediaIds } from "helpers/hooks";
import { RootState } from "app/store";

export interface State {
  fields: { name: string; tabId: number | undefined; isInvalid: boolean }[];
  eventPoster?: Blob;
  ticketPosters?: { [key: number]: Blob };
  editingTicketIndex?: number;
}

export const initialState: State = {
  fields: [],
  editingTicketIndex: undefined,
  ticketPosters: {},
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
    setTicketPosters: (
      state,
      action: PayloadAction<State["ticketPosters"]>
    ) => {
      state.ticketPosters = action.payload;
    },
    setEditingTicketIndex: (
      state,
      action: PayloadAction<State["editingTicketIndex"]>
    ) => {
      state.editingTicketIndex = action.payload;
    },
    resetState: () => initialState,
  },
});

export const {
  setFields,
  resetState,
  setEventPoster,
  setTicketPosters,
  setEditingTicketIndex,
} = slice.actions;

export const selectInvalidFields = (state: RootState) =>
  state.eventForm.fields.filter(({ isInvalid }) => isInvalid);

export default slice.reducer;
