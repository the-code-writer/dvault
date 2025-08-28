/* eslint-disable */
import React, { useEffect, useState } from "react";

import { ITotalFees } from ".";

import "./total-fees.scss";
import { Content } from "antd/es/layout/layout";
import {
  CaretDownOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import {
  Flex,
  Button,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const transactionFeePercentage: number = 0.1/100;
const privacyFeePercentage: number = 0.5/100;
const accountRentalFeePercentage: number = 0.025/100;

const TotalFees: React.FC<ITotalFees> = ({
  children,
  ...props
}): any | null => {

  const { amountsInValue, onTotalFees } = props;

  const { Text } = Typography;

  const [collapsed, setCollapsed] = useState(true);

  const [transactionFee, setTransactionFee] = useState<number>(0);

  const [privacyFee, setPrivacyFee] = useState<number>(0);

  const [accountRentalFee, setAccountRentalFee] = useState<number>(0);

  const [totalFees, setTotalFees] = useState<number>(0);

  useEffect(() => {

    const _transactionFee:number = (transactionFeePercentage * amountsInValue);
    const _privacyFee:number = (privacyFeePercentage * amountsInValue);
    const _accountRentalFee:number = (accountRentalFeePercentage * amountsInValue);

    //console.log(["amountsInValue, _transactionFee, _privacyFee, _accountRentalFee", amountsInValue, _transactionFee, _privacyFee, _accountRentalFee]);

    setTransactionFee(_transactionFee);
    setPrivacyFee(_privacyFee);
    setAccountRentalFee(_accountRentalFee);

    return () => {

      setTransactionFee(0);
      setPrivacyFee(0);
      setAccountRentalFee(0);

    }

  }, [amountsInValue]);

  useEffect(() => {

    const _totalFees:number = Number(transactionFee) + Number(privacyFee) + Number(accountRentalFee);

    setTotalFees(_totalFees);

    //console.log(["TOTAL FEES", _totalFees, transactionFee, privacyFee, accountRentalFee]);

    onTotalFees({
      amountsInValue, transactionFee, privacyFee, accountRentalFee
    })

    return () => {

      setTotalFees(0);

    }

  }, [transactionFee, privacyFee, accountRentalFee]);

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
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            <Text className="txn-total-fees-label">Total Fees</Text>
            <Text className="txn-total-fees-label">
              ~{Number(totalFees).toFixed(3)} SOL{" "}
              <Button
                type="text"
                className="txn-total-fees-btn-wrapper"
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
              >
                {collapsed ? <CaretDownOutlined /> : <CaretUpOutlined />}
              </Button>
            </Text>
          </Flex>

          {!collapsed && (
            <>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Flex
                    justify={"space-between"}
                    align={"center"}
                    style={{ width: "100%" }}
                  >
                    <Text className="txn-total-fees-values">
                      Transaction Fee <QuestionCircleOutlined />
                    </Text>
                    <Text className="txn-total-fees-values">{Number(transactionFee).toFixed(3)} SOL</Text>
                  </Flex>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Flex
                    justify={"space-between"}
                    align={"center"}
                    style={{ width: "100%" }}
                  >
                    <Text className="txn-total-fees-values">
                      Privacy Fee <QuestionCircleOutlined />
                    </Text>
                    <Text className="txn-total-fees-values">{Number(privacyFee).toFixed(3)} SOL</Text>
                  </Flex>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Flex
                    justify={"space-between"}
                    align={"center"}
                    style={{ width: "100%" }}
                  >
                    <Text className="txn-total-fees-values">
                      Account Rent <QuestionCircleOutlined />
                    </Text>
                    <Text className="txn-total-fees-values">{Number(accountRentalFee).toFixed(3)} SOL</Text>
                  </Flex>
                </Col>
              </Row>
            </>
          )}
        </Space>
      </Content>
    </>
  );
};

export { TotalFees };
