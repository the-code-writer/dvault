/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Col, Layout, Row, Space, Typography } from "antd";
import { Page } from "../../_components/document";

import "./transactions.scss";
import { Transaction } from "../../_components/transactions";

const { Content } = Layout;

const { Title } = Typography;

const Transactions: React.FC = () => {
  const [pageTitle, setPageTitle] = useState<string>("");
  const [pageDescription, setPageDescription] = useState<string>("");
  const [pageKeywords, setPageKeywords] = useState<any>("");
  const [pageBreadcrumbs, setPageBreadcrumbs] = useState<any>("");
  const [pageAuthor, setPageAuthor] = useState<string>("");
  const [pageThumbnail, setPageThumbnail] = useState<string>("");
  const [pageTheme, setPageTheme] = useState<string>("");

  useEffect(() => {
    setPageTitle("My Transactions");
    setPageDescription("My Transactions");
    setPageKeywords(["Solana", "privacy", "anonymous", "transactions", "zk"]);
    setPageBreadcrumbs("");
    setPageAuthor("@CrowdForm");
    setPageThumbnail("");
    setPageTheme("");
  }, []);

  const [transactions, setTransactions] = useState<any>([]);

  useEffect(() => {

    setTransactions([{ date: "Today", list: [1] }, { date: "Yesterday", list: [1, 2, 3] }, { date: "Last Month", list: [1, 2, 3] }, { date: "3 May 2017", list: [1, 2, 3] }]);

  }, []);

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
      <Content className="txn-list-wrapper">
        <Title level={2}>Transactions</Title>
        <Space
          className="main"
          size={32}
          direction="vertical"
          style={{ width: "100%", padding: 0 }}
        >
          {transactions.map((transaction: any, transactionIndex: number) => (
            <Space
              key={transactionIndex} className="w100"
              size={12}
              direction="vertical"
            >
              <Title level={5}>{transaction.date}</Title>
              <Space
                className="w100"
                size={32}
                direction="vertical"
              >
                {transaction.list.map((transaction: any, transactionIndex: number) => (
                  <Row key={transactionIndex}>
                    <Col span={24}>
                      <Transaction transaction={transaction} />
                    </Col>
                  </Row>
                ))}
              </Space>
            </Space>
          ))}
        </Space>
      </Content>
    </Page>
  );
};

export { Transactions };
