/* eslint-disable */
import React, { useMemo, useState } from "react";

import { ITransactionDetails } from ".";

import "./transaction-details.scss";
import { Content } from "antd/es/layout/layout";
import { Flex, Skeleton, Space, Typography } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { TransactionDetailsSummaryListItem } from "./TransactionDetailsSummaryListItem";
import { snippets } from "../../_helpers";

const defaultTransactionSummary: any = {
  sender: "",
  receiver: "",
  txnHash: "",
  date: "",
  fundsLocked: false,
  title: "",
  description: "",
  amountsIn: {
    token: {
      symbol: "",
      amount: 0,
      address: "",
      icon: "",
    }
  },
  amountsOut: {
    token: {
      symbol: "",
      amount: 0,
      address: "",
      icon: "",
    }
  },
}

const TransactionDetailsSummary: React.FC<ITransactionDetails> = ({ children, ...props }): any | null => {

  const { transaction, isLoading } = props;

  const { Text } = Typography;

  const [transactionSummary, setTransactionSummary] = useState(defaultTransactionSummary)

  useMemo(() => {
    //
    console.log(transaction);

    setTransactionSummary({
      sender: "34534...345345",
      receiver: "232542...232352",
      txnHash: "52323523...2523525235",
      date: "11 Apr 2024, 07:23",
      fundsLocked: false,
      title: "Exchange SOL for USDT",
      description: "An agreement to exchange 2 SOL for 347.25 USDT as per our chat",
      amountsIn: {
        token: {
          symbol: "SOL",
          amount: 2,
          address: "",
          icon: "",
        }
      },
      amountsOut: {
        token: {
          symbol: "USDT",
          amount: 347.25,
          address: "",
          icon: "",
        }
      },
    });

  }, [transaction]);

  const solScan: any = (address: string) => {
    return snippets.strings.shortenAddress(address);
  }

  const solAmount: any = (token: any) => {
    return snippets.token.getAmount(token);
  }

  return (
    <>
      <Content className="txn-list-card">
        <Space
          className="w100"
          size={12}
          direction="vertical"
        >
          <Flex justify={"space-between"} align={"center"}>
            {isLoading ? (
              <>
                <Skeleton.Button active={true} size={"large"} style={{ height: 28 }} shape={"default"} block={true} />
              </>
            ) : (
              <>
                <Text className="txn-list-card-date">{transactionSummary.date}</Text>
                <Text className={`txn-list-card-status ${transactionSummary.fundsLocked ? "locked" : "unlocked"}`}>{transactionSummary.fundsLocked ? <><LockOutlined /> Funds locked</> : <><UnlockOutlined /> Funds unlocked</>}</Text>
              </>
            )}
          </Flex>
          <Flex justify={"space-between"} align={"flex-start"}>
            {isLoading ? (
              <>
                <Skeleton.Button active={true} size={"large"} style={{ height: 48 }} shape={"default"} block={true} />
              </>
            ) : (
              <>
                <Text className="txn-list-card-title">{transactionSummary.title}</Text>
                <Text className="txn-list-card-sol amounts-right">{solAmount(transactionSummary.amountsIn.token)}</Text>
              </>
            )}
          </Flex>
          <Flex justify={"space-between"} align={"flex-start"}>
            {isLoading ? (
              <>
                <Skeleton.Button active={true} size={"large"} style={{ height: 32 }} shape={"default"} block={true} />
              </>
            ) : (
              <>
                <Text className="txn-list-card-hash">{transactionSummary.description}</Text>
                <Text className="txn-list-card-amount amounts-right">{solAmount(transactionSummary.amountsOut.token)}</Text>
              </>
            )}
          </Flex>
          <Space
            className="w100"
            size={8}
            direction="vertical"
            style={{ width: "100%", padding: 0 }}
          >
            {isLoading ? (
              <>
                <Skeleton.Button active={true} size={"large"} style={{ height: 58 }} shape={"default"} block={true} />
                <Skeleton.Button active={true} size={"large"} style={{ height: 58 }} shape={"default"} block={true} />
                <Skeleton.Button active={true} size={"large"} style={{ height: 58 }} shape={"default"} block={true} />
              </>
            ) : (
              <>
                <TransactionDetailsSummaryListItem itemLabel={"Sender Address"} itemValue={transactionSummary.sender} itemURL={""} />
                <TransactionDetailsSummaryListItem itemLabel={"Receiver Address"} itemValue={transactionSummary.receiver} itemURL={""} />
                <TransactionDetailsSummaryListItem itemLabel={"Transaction Hash"} itemValue={transactionSummary.txnHash} itemURL={solScan(transactionSummary.txnHash)} />
              </>
            )}
          </Space>
        </Space>
      </Content>
    </>
  );
};

export { TransactionDetailsSummary };
