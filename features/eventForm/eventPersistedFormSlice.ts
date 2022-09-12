import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SocialMediaIds } from "helpers/hooks";

export interface State {
  eventTitle: string;
  eventShortDescription?: string;
  eventLongDescription?: string;
  eventLocation?: string;
  eventAdditionalLocationInfo?: string;
  eventStartDate?: string;
  eventStartTime?: string;
  eventEndDate?: string;
  eventEndTime?: string;
  isInSubscriptionMode?: boolean;
  isIndefiniteSubscription?: boolean;
  subscriptionDuration?: number;
  eventTicketName: { [key: number]: string };
  eventTicketDescription: { [key: number]: string };
  isUnlimitedTicketSupply: { [key: number]: boolean };
  isFreeTicketPrice: { [key: number]: boolean };
  ticketSupply: { [key: number]: number };
  ticketPrice: { [key: number]: string };
  beneficiary: string;
  eventManagers: (string | undefined)[];
  eventMediaLinks: { [key in SocialMediaIds]?: string };
  tabIndex: number;
}

export const initialState: State = {
  eventTitle: "",
  beneficiary: "",
  eventStartDate: "",
  eventStartTime: "",
  eventEndDate: "",
  eventEndTime: "",
  eventShortDescription: "",
  eventLongDescription: "",
  eventLocation: "",
  eventAdditionalLocationInfo: "",
  ticketPrice: {},
  eventTicketName: {},
  isUnlimitedTicketSupply: {},
  ticketSupply: {},
  eventTicketDescription: {},
  isFreeTicketPrice: {},
  eventManagers: [],
  eventMediaLinks: {},
  tabIndex: 0,
};

export const slice = createSlice({
  name: "eventForm",
  initialState,
  reducers: {
    setEvent: (state, action: PayloadAction<State>) => action.payload,
    upsertEvent: (state, action: PayloadAction<Partial<State>>) => ({
      ...state,
      ...action.payload,
    }),
    resetEvent: () => initialState,
  },
});

export const { setEvent, resetEvent, upsertEvent } = slice.actions;

export default slice.reducer;
