import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface State {
  eventTitle: string;
}

const initialState: State = {
  eventTitle: "",
};

export const slice = createSlice({
  name: "eventForm",
  initialState,
  reducers: {
    setEventTitle: (state, action: PayloadAction<string>) => {
      state.eventTitle = action.payload;
    },
  },
});

export const { setEventTitle } = slice.actions;

export default slice.reducer;
