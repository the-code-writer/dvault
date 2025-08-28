/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Head, PageRFCProps } from "../index";
import "./PortalStandalone.scss";
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import {
  MenuProps,
  Space,
  Row,
  Col,
  Layout,
  Menu,
  Button,
  Breadcrumb,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header, Footer } from "antd/es/layout/layout";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const PortalStandalone: React.FC<PageRFCProps> = ({
  children,
  ...props
}): any | null => {
  const {
    pageTitle,
    titleSeparator,
    pageDescription,
    pageKeywords,
    pageAuthor,
    pageType,
    pageThumbnail,
    pageBreadcrumbs,
    theme,
    themeColor,
    locales,
    language,
    languageDirection,
    charSet,
    favicons,
    styles,
    appClassNames,
    siteName,
    siteLocale,
    twitterCard,
    twitterUsername,
    twitterAuthor
  } = props;

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    //console.log("PAGE:", props);
  }, []);

  return (
    <>
      <React.Suspense fallback={<>...</>}>
        <Head
          theme={theme}
          pageTitle={pageTitle}
          titleSeparator={titleSeparator}
          pageDescription={pageDescription}
          pageKeywords={pageKeywords}
          pageAuthor={pageAuthor}
          pageType={pageType}
          pageThumbnail={pageThumbnail}
          pageBreadcrumbs={pageBreadcrumbs}
          themeColor={themeColor}
          locales={locales}
          language={language}
          languageDirection={languageDirection}
          charSet={charSet}
          favicons={favicons}
          styles={styles}
          siteName={siteName}
          siteLocale={siteLocale}
          twitterCard={twitterCard}
          twitterUsername={twitterUsername}
          twitterAuthor={twitterAuthor}
          appClassNames={appClassNames}
        />
        <Space
          className="main"
          direction="vertical"
          style={{ padding: 0, width: "100%" }}
        >
          <Row>
            <Col span={24}>
              <Content
                style={{
                  padding: 0,
                  margin: 0,
                  minHeight: 500,
                  background: "transparent",
                }}
              >
                {/*         */}

                <Layout style={{ minHeight: "100vh" }}>
                  <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                  >
                    <div className="demo-logo-vertical" />
                    <Menu
                      theme="dark"
                      defaultSelectedKeys={["1"]}
                      mode="inline"
                      items={items}
                    />
                  </Sider>
                  <Layout>
                    <Header style={{ padding: 0, background: "#ffffff" }}>
                      <Button
                        type="text"
                        icon={
                          collapsed ? (
                            <MenuUnfoldOutlined />
                          ) : (
                            <MenuFoldOutlined />
                          )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                          fontSize: "16px",
                          width: 64,
                          height: 64,
                        }}
                      />
                    </Header>
                    <Content style={{ margin: "0 16px" }}>
                      <Breadcrumb style={{ margin: "16px 0" }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                      </Breadcrumb>
                      {children}
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                      Ant Design ©2023 Created by Ant UED
                    </Footer>
                  </Layout>
                </Layout>

                {/*         */}
              </Content>
            </Col>
          </Row>
        </Space>
      </React.Suspense>
    </>
  );
};

export { PortalStandalone };
