/* eslint-disable */
type TokenSelectorT = {
  foo: boolean;
};

interface ITokenSelector {
  selectMaxAmount: any | boolean | number;
  onTokenSelected:any;
  inline?: boolean;
  size: string;
  onSelectPill?: any;
  TokenSelector?: Array<TokenSelectorT>;
  children?: React.ReactNode;
}

interface ITokenSelectorPill {
  address: string;
  name: string;
  icon: string;
  symbol: string;
  verified?: boolean;
  onSelectPill?: any;
  children?: React.ReactNode;
}

interface ITokenSelectorListView {
  onSelectToken?: any;
  searchCriteria: string;
  children?: React.ReactNode;
}

interface IToken {
  tokenName: string;
  tokenSymbol: string;
  tokenIcon: string;
  tokenAddress: string;
  tokenType: string;
  isTokenVerified?: boolean;
}

export type {
  TokenSelectorT,
  ITokenSelector,
  ITokenSelectorPill,
  ITokenSelectorListView,
  IToken,
};
