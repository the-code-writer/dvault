/* eslint-disable */
import React, { useEffect, useState } from "react";

import { ITransactionDetails } from ".";

import "./transaction-details.scss";
import { Content } from "antd/es/layout/layout";
import { Button, Col, Flex, Modal, Row, Skeleton, Space, Typography } from "antd";

import { AmountsIn } from "../send";

const TransactionDetailsExchange: React.FC<ITransactionDetails> = ({ children, ...props }): any | null => {

  const { transaction, isLoading } = props;

  const { Title, Text } = Typography;

  const [isSendingTransaction, setIsSendingTransaction] = useState(false);

  const [fundsUnlocked, setFundsUnlocked] = useState<boolean>(false);

  const sendButtonHandler = () => {

    if (isSendingTransaction) {

      setIsSendingTransaction(false);

      Modal.confirm({
        title: 'Confirm',
        content: 'Bla bla ...',
        onOk: () => console.log(111),
        onCancel: () => console.log(222),
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        ),
      });

    } else {

      setIsSendingTransaction(true);

      executeTransaction();

    }

  };

  const executeTransaction = () => {
    setIsSendingTransaction(true);
    setTimeout(() => {
      setIsSendingTransaction(false);
    }, 6000);
  };

  const onAmountsInHandler: any = (amount: number) => {

    console.log("onAmountsInHandler", amount);

  }

  useEffect(() => {

    setFundsUnlocked(false);

  }, [transaction]);

  return (
    <>
      <Content className="txn-list-card">
        <Space
          className="main"
          size={32}
          direction="vertical"
          style={{ width: "100%", padding: 0 }}
        >
          {!fundsUnlocked && (
            <>
              {/* Title */}
              <Row>
                <Col span={24}>
                  <Flex justify={"center"} align={"flex-start"} gap={0} vertical>
                    <Title className="txn-main-title " level={2}>
                      Enter exchange amount
                    </Title>
                    <Text className="txn-description">
                      Set access criteria to send and unlock funds privately
                    </Text>
                  </Flex>
                </Col>
              </Row>
            </>
          )}
          {/* AmountsIn */}
          <Row>
            <Col span={24}>
              {isLoading ? (
                <Skeleton.Button active={true} size={"large"} style={{ height: 56 }} shape={"default"} block={true} />
              ) : (
                <AmountsIn onAmountsIn={onAmountsInHandler} />
              )}
            </Col>
          </Row>
          {/* Send Transaction Button */}
          <Row>
            <Col span={24}>
              <Button
                size="large"
                className={`txn-receipient-send-button ${isSendingTransaction ? "error" : ""}`}
                loading={isSendingTransaction}
                block={true}
                onClick={sendButtonHandler}
              >
                {isSendingTransaction ? (<>Cancel</>) : (<>Send</>)}
              </Button>
            </Col>
          </Row>
        </Space>
      </Content>
    </>
  );
};

export { TransactionDetailsExchange };
