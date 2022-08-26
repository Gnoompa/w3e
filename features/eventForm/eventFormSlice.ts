import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Location } from "../../components/ui/locationPicker";
import { Timespan } from "../../components/ui/timespanPicker";

export interface State {
  eventTitle: string;
  eventDescription?: string;
  eventLocation?: Location;
  eventTimespan?: Timespan;
  isInSubscriptionMode?: boolean;
  isIndefiniteSubscription?: boolean;
  subscriptionDuration?: number;
  isUnlimitedTicketSupply?: boolean;
  isFreeTicketPrice?: boolean;
  ticketSupply?: number;
  ticketPrice?: number;
  beneficiary: string;
}

const initialState: State = {
  eventTitle: "",
  beneficiary: "",
  ticketPrice: undefined,
  isFreeTicketPrice: false,
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
