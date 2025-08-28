/* eslint-disable */
import React, { useMemo, useState } from "react";

import { ITransaction } from ".";

import "./transaction.scss";
import { Content } from "antd/es/layout/layout";
import { Button, Flex, Space, Typography } from "antd";
import { CaretRightOutlined, ExportOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const Transaction: React.FC<ITransaction> = ({ children, ...props }): any | null => {

  const { transaction } = props;

  const { Text } = Typography;

  const navigate = useNavigate();

  const [solscan, setSolscan] = useState("https://ererergergrgerg;")

  const [transactionId, setTransactionId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionFundsLocked, setTransactionFundsLocked] = useState(true);
  const [transactionTitle, setTransactionTitle] = useState("");
  const [transactionAmountsIn, setTransactionAmountsIn] = useState("");
  const [transactionAmountsOut, setTransactionAmountsOut] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  useMemo(() => {

    // Todo: extract values from the transaction object

    console.log(transaction);

    setSolscan("https://ererergergrgerg;");

    setTransactionId("my-id");
    setTransactionDate("11 Apr 2024, 07:23");
    setTransactionFundsLocked(true);
    setTransactionTitle("Created Trade with Aju382...cUs481");
    setTransactionAmountsIn("2 SOL");
    setTransactionAmountsOut("~$854.53");
    setTransactionHash("xLhgfcjbU2...Kisb78676fV");

  }, [transaction]);

  return (
    <>
      <Content className="txn-list-card">

        <Space
          className="w100"
          size={12}
          direction="vertical"
        >

          <Flex justify={"space-between"} align={"center"}>
            <Text className="txn-list-card-date">{transactionDate}</Text>
            <Text className="txn-list-card-status">Funds {transactionFundsLocked ? "locked" : "Unlocked"}</Text>
          </Flex>

          <Flex justify={"space-between"} align={"flex-start"}>
            <Text className="txn-list-card-title">{transactionTitle}</Text>
            <Text className="txn-list-card-sol">{transactionAmountsIn}</Text>
          </Flex>

          <Flex justify={"space-between"} align={"flex-start"}>
            <Text className="txn-list-card-hash"><Link to={solscan} >{transactionHash} <ExportOutlined /></Link></Text>
            <Text className="txn-list-card-amount">{transactionAmountsOut}</Text>
          </Flex>

          <Button size="large" className="txn-list-card-btn" type="text" onClick={() => { navigate(`/transactions/${transactionId}`, { state: transaction }); }}>
            View unlock criteria <CaretRightOutlined size={12} />
          </Button>

        </Space>

      </Content>
    </>
  );
};

export { Transaction };
