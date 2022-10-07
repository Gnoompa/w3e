import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BigNumberish } from "ethers";

export interface State {
  nativeCurrencyToUsdPrice?: BigNumberish;
}

export const initialState: State = {};

export const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setNativeCurrencyToUsdPrice: (
      state,
      action: PayloadAction<State["nativeCurrencyToUsdPrice"]>
    ) => {
      state.nativeCurrencyToUsdPrice = action.payload;
    },
  },
});

export const { setNativeCurrencyToUsdPrice } = slice.actions;

export default slice.reducer;
