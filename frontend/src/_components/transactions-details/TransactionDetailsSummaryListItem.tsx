/* eslint-disable */
import React, { useMemo, useState } from "react";

import { ITransactionDetails } from ".";

import "./transaction-details.scss";
import { Flex, Typography } from "antd";

import { ExportOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const TransactionDetailsSummaryListItem: React.FC<ITransactionDetails> = ({ children, ...props }): any | null => {

    const { itemLabel, itemValue, itemURL } = props;

    const { Text } = Typography;

    const [txnSummaryLabel, setTxnSummaryLabel] = useState<string | undefined>("");

    const [txnSummaryValue, setTxnSummaryValue] = useState<string | undefined>("");

    const [txnSummaryItemURL, setTxnSummaryItemURL] = useState<string | undefined>("");

    useMemo(() => {

        setTxnSummaryLabel(itemLabel);

        setTxnSummaryValue(itemValue);

        setTxnSummaryItemURL(itemURL);

    }, [])

    return (
        <>
            <div className={`txn-details-summary-list-item`} >
                <Flex justify={"space-between"} align={"center"}>
                <Text className={`txn-details-summary-label`}>
                                {txnSummaryLabel}
                            </Text>
                            <Text className={`txn-details-summary-value`}>
                                {String(txnSummaryItemURL).length > 0 ? (
                                    <Link to={String(txnSummaryItemURL)}>
                                        {txnSummaryValue} <ExportOutlined />
                                    </Link>
                                ) : (
                                    <>
                                        {txnSummaryValue}
                                    </>
                                )}
                            </Text>
                </Flex>
            </div>
        </>
    );
};

export { TransactionDetailsSummaryListItem };
