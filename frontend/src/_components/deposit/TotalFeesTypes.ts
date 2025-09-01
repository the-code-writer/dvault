/* eslint-disable */
type TotalFeesT = {
  foo: boolean;
};

interface ITotalFees {
  onTotalFees: any;
  amountsInValue: number;
  withdrawalLimit?: number; monthlyLimit?: number; availableMonthly?: number; 
  children?: React.ReactNode;
}

export type { TotalFeesT, ITotalFees };
