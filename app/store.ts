import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import appReducer from "../features/app/appSlice";
import appPersistedReducer from "../features/app/appPersistedSlice";
import eventPersistedFormReducer from "../features/eventForm/eventPersistedFormSlice";
import eventFormReducer from "../features/eventForm/eventFormSlice";
import eventPreviewReducer from "../features/eventForm/eventPreviewSlice";
import { api as eventsApi } from "../helpers/eventsApi";

export const persistConfig = {
  key: "root",
  storage,
  whitelist: ["appPersisted", "eventPersistedForm"],
};

const reducer = combineReducers({
  app: appReducer,
  appPersisted: appPersistedReducer,
  eventPersistedForm: eventPersistedFormReducer,
  eventForm: eventFormReducer,
  eventPreview: eventPreviewReducer,
  [eventsApi.reducerPath]: eventsApi.reducer,
});

export const store = configureStore({
  reducer: persistReducer<ReturnType<typeof reducer>>(persistConfig, reducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(eventsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
