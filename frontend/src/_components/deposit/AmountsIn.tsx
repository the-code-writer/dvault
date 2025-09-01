/* eslint-disable */
import React, { useEffect, useState } from "react";

import { IAmountsIn } from ".";

import "./amounts-in.scss";
import { Content } from "antd/es/layout/layout";
import { Flex, Button, Input } from "antd";
import { TokenSelector } from "../tokens";

const AmountsIn: React.FC<IAmountsIn> = ({
  children,
  ...props
}): any | null => {

  const { onAmountsIn } = props;

  const [selectedToken, setSelectedToken] = useState({});

  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const onTokenSelectedHandler:any = (token:any) => {

    setSelectedToken(token);
    
  };

  const selectMaxAmountHandler:any = () => {

    // Todo: Select max amount
    
  };

  useEffect(() => {

    onAmountsIn({selectedToken, selectedAmount});

  }, [selectedToken, selectedAmount]);

  return (
    <>
      <Content className="txn-inputs-wrapper">
        <Flex
          justify={"space-between"}
          align={"center"}
          style={{ width: "100%" }}
        >
          <Input
            placeholder="0.0"
            className="txt-input-amount-in"
            variant="borderless"
            onChange={(e: any) => { setSelectedAmount(Number(e.target.value))}}
          />
          <Flex justify={"flex-end"} align={"center"} gap={0}>
            <TokenSelector selectMaxAmount={selectMaxAmountHandler} onTokenSelected={onTokenSelectedHandler} size="medium" inline />
          </Flex>
        </Flex>
      </Content>
    </>
  );
};

export { AmountsIn };
