/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Col, Layout, Row, Space, Typography } from "antd";
import { Page } from "../../_components/document";
import Fade from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import "./transactions.scss";
import { Transaction } from "../../_components/transactions";

const { Content } = Layout;

const { Title } = Typography;

const customAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 100px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;


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
              key={transactionIndex}
              className="w100"
              size={12}
              direction="vertical"
            >
              <Title level={5}>{transaction.date}</Title>
              <Space className="w100" size={32} direction="vertical">
                {transaction.list.map(
                  (transaction: any, transactionIndex: number) => (
                    <Fade
                      key={transactionIndex}
                      keyframes={customAnimation}
                      delay={transactionIndex*500}
                    >
                      <Row>
                        <Col span={24}>
                          <Transaction transaction={transaction} />
                        </Col>
                      </Row>
                    </Fade>
                  )
                )}
              </Space>
            </Space>
          ))}
        </Space>
      </Content>
    </Page>
  );
};

export { Transactions };
