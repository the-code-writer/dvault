/* eslint-disable */
import React, { useEffect, useState } from "react";

import { ILimits } from ".";

import "./total-fees.scss";
import { Content } from "antd/es/layout/layout";
import {
  Flex,
  Typography,
  Space,
} from "antd";

const WithdrawalLimits: React.FC<ILimits> = ({
  children,
  ...props
}): any | null => {
  const { withdrawalLimit, monthlyLimit, availableMonthly } = props;

  const { Text } = Typography;

  const [availableToWithdraw, setAvailableToWithdraw] = useState<number>(0);

  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(0);

  useEffect(() => {
    console.log({ withdrawalLimit, monthlyLimit, availableMonthly });
    setAvailableToWithdraw(342);
    setMonthlyWithdrawal(53525);

    return () => {
      setAvailableToWithdraw(0);
      setMonthlyWithdrawal(0);
    };
  }, [withdrawalLimit, monthlyLimit, availableMonthly]);

  return (
    <>
      <Content className="txn-total-fees-wrapper">
        {/* Form */}

        <Space
          className="main"
          size={8}
          direction="vertical"
          style={{ width: "100%", padding: 0, marginTop: 0 }}
        >
          <Flex
            justify={"space-between"}
            align={"center"}
            style={{ width: "100%" }}
          >
            <Text className="txn-total-fees-label">Available to withdraw</Text>
            <Text className="txn-total-fees-label">
              ~{Number(availableToWithdraw).toFixed(3)} SOL{" "}
            </Text>
          </Flex>

          <Flex
            justify={"space-between"}
            align={"center"}
            style={{ width: "100%" }}
          >
            <Text className="txn-total-fees-label">Monthly withdrawals: </Text>
            <Text className="txn-total-fees-label">
              ~{Number(monthlyWithdrawal).toFixed(3)} SOL{" "}
            </Text>
          </Flex>
        </Space>
      </Content>
    </>
  );
};

export { WithdrawalLimits };
