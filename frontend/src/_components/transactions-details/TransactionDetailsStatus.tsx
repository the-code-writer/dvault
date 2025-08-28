/* eslint-disable */
import React, { useEffect, useState } from "react";

import { ITransactionDetails } from ".";

import "./transaction-details.scss";
import { Content } from "antd/es/layout/layout";
import { Col, Flex, Row, Skeleton, Space, Typography } from "antd";

import { TransactionDetailsStatusListItem } from "./TransactionDetailsStatusListItem";

const defaultStatuses: any = {
  unlocks: {
    state: "PENDING",
    label: "",
    value: "",
  },
  expires: {
    state: "PENDING",
    label: "",
    value: "",
  },
  expectedFunds: {
    state: "PENDING",
    label: "",
    value: "",
  },
  walletAddress: {
    state: "PENDING",
    label: "",
    value: "",
  },
  fundsLocked: {
    state: "PENDING",
    label: "",
    value: true,
  },
}

const TransactionDetailsStatus: React.FC<ITransactionDetails> = ({ children, ...props }): any | null => {

  const { transaction, isLoading } = props;

  const { Title, Text } = Typography;

  const [transactionStatus, setTransactionStatus] = useState(defaultStatuses);

  useEffect(() => {

    const _status = {
      unlocks: {
        state: "SUCCESS",
        label: "Unlocks on 12/12/204",
        value: "",
      },
      expires: {
        state: "SUCCESS",
        label: "Expires on 12/12/204",
        value: "",
      },
      expectedFunds: {
        state: "ERROR",
        label: "Expected Funds",
        value: "353.53 USDT",
      },
      walletAddress: {
        state: "PENDING",
        label: "Wallet Address",
        value: "Auufjw ... efbvhef",
      },
      fundsLocked: {
        state: "PENDING",
        label: "Funds Unlocked!",
        value: true,
      },
    }

    setTransactionStatus(_status);

  }, [transaction])

  return (
    <>
      <Content className="txn-list-card">
        <Space
          className="main"
          size={48}
          direction="vertical"
          style={{ width: "100%", padding: 0 }}
        >
          {/* Title */}
          <Row>
            <Col span={24}>
              <Flex justify={"center"} align={"flex-start"} gap={0} vertical>
                <Title className="txn-main-title " level={2}>
                  Transaction Status
                </Title>
                <Text className="txn-description">
                  Check the status of the transaction criteria or cancel the transaction.
                </Text>
              </Flex>
            </Col>
          </Row>
          {/* AmountsIn */}
          <Row>
            <Col span={24}>
              <Space
                className="w100"
                size={12}
                direction="vertical"
                style={{ width: "100%", padding: 0 }}
              >
                {isLoading ? (
                  <>
                    <Skeleton.Button active={true} size={"large"} style={{ height: 84 }} shape={"default"} block={true} />
                    <Skeleton.Button active={true} size={"large"} style={{ height: 84 }} shape={"default"} block={true} />
                    <Skeleton.Button active={true} size={"large"} style={{ height: 84 }} shape={"default"} block={true} />
                    <Skeleton.Button active={true} size={"large"} style={{ height: 84 }} shape={"default"} block={true} />
                    <Skeleton.Button active={true} size={"large"} style={{ height: 84 }} shape={"default"} block={true} />
                  </>
                ) : (
                  <>
                    <TransactionDetailsStatusListItem transactionStatus={transactionStatus.unlocks} />
                    <TransactionDetailsStatusListItem transactionStatus={transactionStatus.expires} />
                    <TransactionDetailsStatusListItem transactionStatus={transactionStatus.expectedFunds} />
                    <TransactionDetailsStatusListItem transactionStatus={transactionStatus.walletAddress} />
                    <TransactionDetailsStatusListItem transactionStatus={transactionStatus.fundsLocked} />
                  </>
                )}
              </Space>
            </Col>
          </Row>
        </Space>
      </Content>
    </>
  );
};

export { TransactionDetailsStatus };
