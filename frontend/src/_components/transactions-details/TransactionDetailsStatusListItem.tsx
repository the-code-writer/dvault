/* eslint-disable */
import React, { useMemo, useState } from "react";

import { ITransactionDetails } from ".";

import "./transaction-details.scss";

import { Flex, Typography } from "antd";

import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";

const TransactionDetailsStatusListItem: React.FC<ITransactionDetails> = ({ children, ...props }): any | null => {

    const { transactionStatus } = props;

    const { Text } = Typography;

    const [txnState, setTxnState] = useState("");

    const [txnStatusLabel, setTxnStatusLabel] = useState("");

    const [txnStatusValue, setTxnStatusValue] = useState("");

    useMemo(() => {

        setTxnState(transactionStatus.state);

        setTxnStatusLabel(transactionStatus.label);

        setTxnStatusValue(transactionStatus.value);

    }, [transactionStatus])

    return (
        <>
            <div className={`txn-details-status-list-item ${String(txnState).toLowerCase()}`} >
                <Flex justify={"space-between"} align={"center"}>
                    <Flex
                        justify={"flex-end"}
                        align={"center"}
                        gap={16}
                    >
                        {txnState === "PENDING" && (
                            <Text className="txn-details-status-icon pending">
                                <SyncOutlined size={32} />
                            </Text>
                        )}
                        {txnState === "SUCCESS" && (
                            <Text className="txn-details-status-icon success">
                                <CheckCircleOutlined size={32} />
                            </Text>
                        )}
                        {txnState === "ERROR" && (
                            <Text className="txn-details-status-icon error">
                                <CloseCircleOutlined size={32} />
                            </Text>
                        )}
                        <Text className={`txn-details-status-label ${String(txnState).toLowerCase()}`}>
                            {txnStatusLabel}
                        </Text>
                    </Flex>
                    <Text className={`txn-details-status-value ${String(txnState).toLowerCase()}`}>
                        {txnStatusValue}
                    </Text>
                </Flex>
            </div>
        </>
    );
};

export { TransactionDetailsStatusListItem };
