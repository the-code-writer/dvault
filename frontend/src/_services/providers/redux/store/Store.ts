/* eslint-disable */
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { walletInitialState, walletReducer } from "../modules";

export const store = configureStore({
  reducer: {
    auth: walletReducer,
  },
  preloadedState: {
    auth: walletInitialState,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
