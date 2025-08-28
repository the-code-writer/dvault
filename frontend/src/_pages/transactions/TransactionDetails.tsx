/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Col, Layout, Row, Space } from "antd";
import { Page } from "../../_components/document";
import { useLocation, useNavigate } from "react-router-dom";
import "./transactions.scss";

import { TransactionDetailsSummary, TransactionDetailsExchange, TransactionDetailsStatus } from "../../_components/transactions-details";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Content } = Layout;

const TransactionDetails: React.FC = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const transaction = location.state;

  const [pageTitle, setPageTitle] = useState<string>("");
  const [pageDescription, setPageDescription] = useState<string>("");
  const [pageKeywords, setPageKeywords] = useState<any>("");
  const [pageBreadcrumbs, setPageBreadcrumbs] = useState<any>("");
  const [pageAuthor, setPageAuthor] = useState<string>("");
  const [pageThumbnail, setPageThumbnail] = useState<string>("");
  const [pageTheme, setPageTheme] = useState<string>("");

  useEffect(() => {
    setPageTitle("Transactions  Details ");
    setPageDescription("My Transactions");
    setPageKeywords(["Solana", "privacy", "anonymous", "transactions", "zk"]);
    setPageBreadcrumbs("");
    setPageAuthor("@CrowdForm");
    setPageThumbnail("");
    setPageTheme("");
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {

    console.log("TXN", transaction);

    setTimeout(() => {
      setIsLoading(false);
    }, 5000)


  }, [transaction]);

  return (
    <Page
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      pageKeywords={pageKeywords}
      pageBreadcrumbs={pageBreadcrumbs}
      pageAuthor={pageAuthor}
      pageThumbnail={pageThumbnail}
      theme={pageTheme}
      hideHeaderAndFooter={false}
    >
      <Content className="txn-details-wrapper">
        <Space
          className="w100"
          size={24}
          direction="vertical"
        >
          <Button type="text" onClick={() => { navigate("/transactions"); }}><ArrowLeftOutlined /> Back to Transactions</Button>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} >
              <Space
                className="w100"
                size={32}
                direction="vertical"
                style={{ marginBottom: 32 }}
              >
                <TransactionDetailsSummary transaction={transaction} isLoading={isLoading} />
                <TransactionDetailsExchange transaction={transaction} isLoading={isLoading} />
              </Space>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} >
              <Space
                className="w100"
                size={32}
                direction="vertical"
                style={{ marginBottom: 32 }}
              >
                <TransactionDetailsStatus transaction={transaction} isLoading={isLoading} />
              </Space>
            </Col>
          </Row>
        </Space>
      </Content>
    </Page>
  );
};

export { TransactionDetails };
