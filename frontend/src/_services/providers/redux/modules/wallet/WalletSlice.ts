/* eslint-disable */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  connectWallet,
  disconnectWallet,
  getWalletBalance,
  IWalletState,
} from ".";

const initialState: IWalletState = {
  walletAddress: "0x0",
  walletBalance: 0,
  walletChainID: "",
  walletChainName: "",
  walletIsConnected: false,
  walletIsLoading: false,
  errors: null,
};

export const walletInitialState: IWalletState = initialState;

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder

      // connectWallet
      .addCase(connectWallet.pending, (state: any) => {
        state.walletAddress = "0x0";
        state.walletBalance = 0;
        state.walletChainID = "";
        state.walletChainName = "";
        state.walletIsConnected = false;
        state.walletIsLoading = true;
        state.errors = null;
      })
      .addCase(
        connectWallet.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.walletAddress = action.payload.address;
          state.walletBalance = action.payload.balance;
          state.walletChainID = action.payload.chainID.toString;
          state.walletChainName = action.payload.chainName;
          state.walletIsConnected = true;
          state.walletIsLoading = false;
          state.errors = null;
        }
      )
      .addCase(
        connectWallet.rejected,
        (state: any, action: PayloadAction<any>) => {
          state.walletAddress = "0x0";
          state.walletBalance = 0;
          state.walletChainID = "";
          state.walletChainName = "";
          state.walletIsConnected = false;
          state.walletIsLoading = false;
          state.errors = action.payload.errorMessage;
          console.log(
            "# WalletActions::connectWallet.Rejected",
            action.payload.errorMessage
          );
        }
      )

      // getWalletBalance
      .addCase(getWalletBalance.pending, (state: any) => {
        state.walletBalance = 0;
        state.walletIsLoading = true;
        state.errors = null;
      })
      .addCase(
        getWalletBalance.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.walletAddress = action.payload.address;
          state.walletBalance = action.payload.balance;
          state.walletIsLoading = false;
          state.errors = null;
        }
      )
      .addCase(
        getWalletBalance.rejected,
        (state: any, action: PayloadAction<any>) => {
          state.walletBalance = 0;
          state.walletIsLoading = false;
          state.errors = action.payload.errorMessage;
          console.log(
            "# WalletActions::getWalletBalance.Rejected",
            action.payload.errorMessage
          );
        }
      )

      // disconnectWallet
      .addCase(disconnectWallet.pending, (state: any) => {
        state.walletAddress = "0x0";
        state.walletBalance = 0;
        state.walletChainID = "";
        state.walletChainName = "";
        state.walletIsConnected = false;
        state.walletIsLoading = true;
        state.errors = null;
      })
      .addCase(
        disconnectWallet.fulfilled,
        (state: any, action: PayloadAction<any>) => {
          state.walletAddress = action.payload.address  ;
          state.walletBalance = 0;
          state.walletChainID = "";
          state.walletChainName = "";
          state.walletIsConnected = false;
          state.walletIsLoading = false;
          state.errors = null;
        }
      )
      .addCase(
        disconnectWallet.rejected,
        (state: any, action: PayloadAction<any>) => {
          state.walletAddress = "0x0";
          state.walletBalance = 0;
          state.walletChainID = "";
          state.walletChainName = "";
          state.walletIsConnected = false;
          state.walletIsLoading = false;
          state.errors = action.payload.errorMessage;
          console.log(
            "# WalletActions::disconnectWallet.Rejected",
            action.payload.errorMessage
          );
        }
      );
  },
});

//export const { connectWallet, getWalletBalance, disconnectWallet } = walletSlice.actions;

export const walletReducer = walletSlice.reducer;
