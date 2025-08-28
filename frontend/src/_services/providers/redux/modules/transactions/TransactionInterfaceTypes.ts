/* eslint-disable */
export interface IToken {
  tokenName: string;
  tokenSymbol: string;
  tokenIcon: string;
  tokenAddress: string;
  tokenType: string;
  isTokenVerified?: boolean;
}

export interface ITransactionFees {
  transactionFee: number;
  privacyFee?: number;
  accountRent?: number;
}

export interface ITransactionSender {
  amountsIn: number;
  tokenIn: IToken;
  senderAddress: string;
}

export interface ITransactionReceiver {
  amountsOut: number;
  tokenOut: IToken;
  receiverAddress: string;
  expectedAmountValue: number;
  expectedAmountToken: IToken;
}

export interface ITransactionUnlockCriteria {
  title: string;
  description: string;
  fundsLocked: boolean;
  fundsLockedAt: string;
  unlocksAt: string;
  expiresAt: string;
  isCancellable: boolean;
}

export interface ITransactionTimestamps {
  unlocksAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  exchangedAt: string;
  transactedAt: string;
  fundsLockedAt: string;
}

export interface ITransactionExchange {
  exchangeAmount: number;
}

export enum ITransactionStatus {
  UNLOCKS_DEFINED = "UNLOCKS",
  EXPIRES_DEFINED = "EXPIRES",
  EXPECTED_FUNDS_FULLFILLED = "EXPECTED_FUNDS",
  WALLET_ADDRESS_DEFINED = "WALLET_ADDRESS",
  FUNDS_UNLOCKED = "FUNDS_UNLOCKED",
}

export interface ITransactionBlockchain {
  transactionStatus: ITransactionStatus;
  transactionHash: `0x${string}`;
  transactionMeta: string;
}

export interface ITransactionPayload {
  sender: ITransactionSender;
  receiver: ITransactionReceiver;
  exchange: ITransactionExchange;
  unlockCriteria: ITransactionUnlockCriteria;
  totalFeesPaid: ITransactionFees;
  timestamps: ITransactionTimestamps;
  blockchain: ITransactionBlockchain;
}

export interface ITransaction extends ITransactionPayload {
  walletHash: string;
  transactionID: number;
  transactionSignature: string;
  transactionCompleted: string;
}

export interface ITransactionsArray {
  [index: number]: ITransaction;
}

export interface ITransactions {
  userWallet: string;
  transactions: ITransactionsArray;
}
