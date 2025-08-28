/* eslint-disable */
type TransactionDetailsT = {
  foo: boolean;
};

interface ITransactionDetails {
  itemLabel?: string;
  itemValue?: string;
  itemURL?: string;
  isLoading?: boolean;
  transactionSummary?: any;
  transactionStatus?: any;
  transaction?: any;
  children?: React.ReactNode;
}

export type { TransactionDetailsT, ITransactionDetails };
