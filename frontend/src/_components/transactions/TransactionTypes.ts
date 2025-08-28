/* eslint-disable */
export interface IToken {
  tokenSymbol: string;
  tokenAddress: string;
}

export interface ITransactionFees {
  transactionFee: number;
  privacyFee: number;
  accountRent: number
}

export interface ITransactionSender {
  amountsOut: number;
  tokenIn: IToken;
  senderAddress: string
}

export interface ITransactionReceiver {
  amountsIn: number;
  tokenIn: IToken;
  receiverAddress: string
  expectedAmountValue: number;
  expectedAmountToken: IToken;
}

export interface ITransactionUnlockCriteria {
  title: string;
  description: string;
  fundsLocked: boolean;
  isCancellable: boolean;
}

export interface ITransactionTimestamps {
  unlocksAt: number;
  expiresAt: number;
  createdAt: number;
  updatedAt: number;
  exchangedAt: number;
  transactedAt: number;
  fundsLockedAt: number;
  fundsUnlockedAt: number;
}

export interface ITransactionExchange {
  exchangeAmount: number;
}

export enum ITransactionStatusEnums {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR"
}

export interface ITransactionStatus {
  state: ITransactionStatusEnums;
  label: string;
  value: string | number | boolean;
}

export interface ITransactionStatuses {
  unlocks: ITransactionStatus;
  expires: ITransactionStatus;
  expectedFunds: ITransactionStatus;
  walletAddress: ITransactionStatus;
  fundsLocked: ITransactionStatus;
}

export interface ITransactionBlockchain {
  transactionStatus: ITransactionStatuses;
  vaultID: string;
  userID: string;
  programID: string;
  authorityID: string;
  transactionID: string;
  transactionType: string;
  transactionHash: string;
  transactionCompleted: boolean;
}

export interface ITransactionObject {
  sender: ITransactionSender;
  receiver: ITransactionReceiver;
  exchange: ITransactionExchange;
  unlockCriteria: ITransactionUnlockCriteria;
  totalFeesPaid: ITransactionFees;
  timestamps: ITransactionTimestamps;
  blockchain: ITransactionBlockchain;
}

export interface ITransactionsArray {
  [index: number]: ITransaction;
}

export interface ITransactions {
  transactions: ITransactionsArray
}


export interface ITransaction {
  transaction?: any;
  children?: React.ReactNode;
}
