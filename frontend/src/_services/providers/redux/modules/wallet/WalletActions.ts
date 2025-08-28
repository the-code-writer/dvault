/* eslint-disable */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IWallet } from ".";

export const connectWallet = createAsyncThunk<IWallet>(
  "wallet/connectWallet",
  async (params: any, thunkAPI) => {
    let errorCode: number = 0;
    let errorMessage: string = "";
    try {
      console.log(params);
      return new Promise((resolve, reject) => {
        let data = null;
        if (data) {
          resolve(data); // Resolve the Promise if data is fetched successfully
        } else {
          errorCode = 510;
          errorMessage = "Error: Unable to fetch data";
          return reject({ errorCode, errorMessage, errorPayload: null });
        }
      });
    } catch (error: any) {
      errorCode = error.code;
      errorMessage = error.message;
      return thunkAPI.rejectWithValue({
        errorCode,
        errorMessage,
        errorPayload: error,
      });
    }
  }
);

export const getWalletBalance = createAsyncThunk<IWallet>(
  "wallet.getBalance",
  async (params: any, thunkAPI) => {
    try {
      console.log(params);
      return new Promise((resolve, reject) => {
        let data = null;
        if (data) {
          resolve(data); // Resolve the Promise if data is fetched successfully
        } else {
          let errorMessage = "Error: Unable to fetch data";
          return reject({ errorMessage, errorPayload: null });
        }
      });
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      return thunkAPI.rejectWithValue({ errorCode, errorMessage });
    }
  }
);

export const disconnectWallet = createAsyncThunk<string, boolean>(
  "wallet.disconnectWallet",
  async (clearCache: boolean, thunkAPI) => {
    console.log(clearCache);
    try {
      return new Promise((resolve, reject) => {
        let data = null;
        if (data) {
          resolve(data); // Resolve the Promise if data is fetched successfully
        } else {
          let errorMessage = "Error: Unable to fetch data";
          return reject({ errorMessage, errorPayload: null });
        }
      });
    } catch (error: any) {
      // Handle Errors here...
      return thunkAPI.rejectWithValue(false);
    }
  }
);
