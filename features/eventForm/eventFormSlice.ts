import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
  isUnlimitedTicketSupply?: boolean;
  isFreeTicketPrice?: boolean;
  ticketSupply?: number;
  ticketPrice?: string;
  beneficiary: string;
  eventManagers?: (string | undefined)[];
  tabIndex: number;
}

export const initialState: State = {
  eventTitle: "",
  beneficiary: "",
  eventShortDescription: "",
  eventLongDescription: "",
  ticketPrice: undefined,
  isFreeTicketPrice: false,
  eventManagers: [],
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
