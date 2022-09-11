import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SocialMediaIds } from "helpers/hooks";

export interface State {
  name?: string | JSX.Element;
  shortDescription?: string | JSX.Element;
  longDescription?: string | JSX.Element;
  image?: string | JSX.Element;
  location?: string | JSX.Element;
  date?: (string | JSX.Element)[];
  eventTicketPriceLabel?: string | JSX.Element;
  eventTicketsTotalSupply?: string | JSX.Element;
  mediaLinks?: { [key in SocialMediaIds]?: string };
  isUnlimitedTicketSupply?: boolean;
  isFreeTicketPrice?: boolean;
}

export const initialState: State = {};

export const slice = createSlice({
  name: "eventPreview",
  initialState,
  reducers: {
    setEventData: (state, action: PayloadAction<State>) => action.payload,
    resetEventData: () => initialState,
  },
});

export const { setEventData, resetEventData } = slice.actions;

export default slice.reducer;
