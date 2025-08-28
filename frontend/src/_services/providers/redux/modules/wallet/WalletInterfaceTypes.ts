/* eslint-disable */
export interface IWallet {
  walletAddress: `0x${string}`;
  walletBalance: number;
  walletChainID: number | string;
  walletChainName: string;
  walletIsConnected: boolean;
}

export interface IWalletState extends IWallet {
  walletIsLoading: boolean;
  errors: any;
}

export enum IWalletActionType {
  GET_WALLET = "GET_WALLET",
  GET_WALLET_BALANCE = "GET_WALLET_BALANCE",
  GET_TOKEN_BALANCE = "GET_TOKEN_BALANCE",
  CONNECT_WALLET = "CONNECT_WALLET",
  DISCONNECT_WALLET = "DISCONNECT_WALLET",
  CREATE_WALLET = "CREATE_WALLET",
  SIGN_MESSAGE = "SIGN_MESSAGE",
}
