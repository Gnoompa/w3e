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
import eventPersistedFormReducer from "../features/eventForm/eventPersistedFormSlice";
import eventFormReducer from "../features/eventForm/eventFormSlice";
import eventPreviewReducer from "../features/eventForm/eventPreviewSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["eventPersistedForm"],
};

const reducer = combineReducers({
  eventPersistedForm: eventPersistedFormReducer,
  eventForm: eventFormReducer,
  eventPreview: eventPreviewReducer,
});

export const store = configureStore({
  reducer: persistReducer<ReturnType<typeof reducer>>(persistConfig, reducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
