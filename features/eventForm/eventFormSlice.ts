import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { SocialMediaIds } from "helpers/hooks";

export interface State {
  eventTitle: string;
  eventShortDescription?: string;
  eventLongDescription?: string;
  eventTicketDescription?: string;
  eventLocation?: string;
  eventAdditionalLocationInfo?: string;
  eventStartDate?: string;
  eventStartTime?: string;
  eventEndDate?: string;
  eventEndTime?: string;
  isInSubscriptionMode?: boolean;
  isIndefiniteSubscription?: boolean;
  subscriptionDuration?: number;
  isUnlimitedTicketSupply: boolean;
  isFreeTicketPrice: boolean;
  ticketSupply?: number;
  ticketPrice?: string;
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
  ticketPrice: undefined,
  isUnlimitedTicketSupply: false,
  isFreeTicketPrice: false,
  eventManagers: [],
  eventMediaLinks: {},
  tabIndex: 0,
};

export const slice = createSlice({
  name: "eventForm",
  initialState,
  reducers: {
    setEvent: (state, action: PayloadAction<State>) => action.payload,
    resetEvent: () => initialState,
  },
});

export const { setEvent, resetEvent } = slice.actions;

export default slice.reducer;
