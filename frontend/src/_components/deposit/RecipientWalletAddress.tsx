/* eslint-disable */
import React, { useEffect, useState } from "react";

import { IRecipientWalletAddress } from ".";

import "./recipient-wallet-address.scss";
import { Content } from "antd/es/layout/layout";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Flex, Input, Typography } from "antd";

const RecipientWalletAddress: React.FC<IRecipientWalletAddress> = ({
  children,
  ...props
}): any | null => {
  
  const { onRecipientWalletAddress } = props;

  const { Text } = Typography;

  const [address, setAddress] = useState<string>();

  useEffect(() => {

    onRecipientWalletAddress(address);

  }, [address]);

  return (
    <>
      <Flex
        justify={"center"}
        align={"flex-start"}
        style={{ width: "100%" }}
        gap={5}
        vertical
      >
        <Text className="txn-unlock-criteria-label">
          Recipient Wallet Address <QuestionCircleOutlined />
        </Text>
        <Content className="txn-inputs-wrapper">
          <Input
            placeholder="E.g. 3N1mDfFxJhFmCxsA9J2PcmF6QVM2pMS7t8h"
            className="txt-input-recipient-address"
            variant="borderless"
            style={{ marginTop: 4 }}
            value={address}
            onChange={(e)=>{ setAddress(e.target.value);}}
          />
        </Content>
      </Flex>
    </>
  );
};

export { RecipientWalletAddress };
