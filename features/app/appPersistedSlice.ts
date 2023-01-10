import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface State {
  ver: string;
}

export const initialState: State = {
  ver: "a-1.0.2",
};

export const slice = createSlice({
  name: "appPersisted",
  initialState,
  reducers: {},
});

export default slice.reducer;
