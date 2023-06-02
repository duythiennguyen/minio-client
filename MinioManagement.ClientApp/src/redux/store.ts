import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createOidcMiddleware from "redux-oidc";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userManager from "src/commons/helpers/userManager";
import rootReducer from "./reducer";
import { useDispatch } from "react-redux";
////////////////////////////////setting redux /////////////////////////////////////////
const oidcMiddleware = createOidcMiddleware(userManager);
const persistConfig = {
  key: "web-sso",
  storage,
  //whitelist: ['auth'],
  blacklist: ["auth","departments","users"], // ẩn không show tại Local Storage
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).prepend(oidcMiddleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types

////////////////////////////////end setting redux /////////////////////////////////////////