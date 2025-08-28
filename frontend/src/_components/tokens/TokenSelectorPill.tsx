/* eslint-disable */
import React, { useState } from "react";

import { IToken, ITokenSelectorPill } from ".";

import "./token-selector.scss";
import { Button, Flex } from "antd";

const TokenSelectorPill: React.FC<ITokenSelectorPill> = ({
  children,
  ...props
}): any | null => {

  const { onSelectPill, name, icon, symbol, address, verified } = props;

  const [ token ] = useState<IToken>({
      tokenName: name,
      tokenSymbol: symbol,
      tokenIcon: icon,
      tokenAddress: address,
      tokenType: "SOL",
      isTokenVerified: verified,
  })

  return (
    <>
      <Button
        type="text"
        className="txn-select-token-pill"
        size="large"
        onClick={() => {
          onSelectPill(token);
        }}
      >
        <Flex justify={"space-between"} align={"center"}>
          <img
            alt={`${token.tokenName} (${token.tokenSymbol})`}
            src={token.tokenIcon}
            style={{ width: 24, marginRight: 8, borderRadius: 12 }}
            className="txn-select-token-pill-icon"
          />
          <span className="txn-select-token-pill-label">{token.tokenSymbol}</span>
        </Flex>
      </Button>
    </>
  );
};

export { TokenSelectorPill };
