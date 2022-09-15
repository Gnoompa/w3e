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
  subscriptionDuration: { [key: number]: number };
  eventTicketName: { [key: number]: string };
  eventTicketDescription: { [key: number]: string };
  isUnlimitedTicketSupply: { [key: number]: boolean };
  isFreeTicketPrice: { [key: number]: boolean };
  ticketSupply: { [key: number]: number | undefined };
  ticketPrice: { [key: number]: string | undefined };
  beneficiary: string;
  eventManagers: (string | undefined)[];
  eventMediaLinks: { [key in SocialMediaIds]?: string };
  tabIndex: number;
  addedTickets: number[];
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
  subscriptionDuration: {},
  eventManagers: [],
  eventMediaLinks: {},
  tabIndex: 0,
  addedTickets: [],
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
    setAddedTickets: (state, action: PayloadAction<State["addedTickets"]>) => {
      state.addedTickets = action.payload;
    },
  },
});

export const { setEvent, resetEvent, upsertEvent, setAddedTickets } =
  slice.actions;

export default slice.reducer;
