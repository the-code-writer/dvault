/* eslint-disable */
import React, { useEffect } from "react";
import { Head, Body, PageRFCProps } from "../index";
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { MenuProps, Breadcrumb, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

import "./PortalEmbedded.scss";

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

const PortalEmbedded: React.FC<PageRFCProps> = ({
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
    twitterAuthor,
    hideHeaderAndFooter,
    showRightSidebar,
    showLeftSidebar,
    isPortal,
  } = props;

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
        <Body
          theme={theme}
          hideHeaderAndFooter={hideHeaderAndFooter}
          showRightSidebar={showRightSidebar}
          showLeftSidebar={showLeftSidebar}
          isPortal={isPortal}
        >
          <Content className="portal-embedded">
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Layout className="layout-wrapper">
              <Sider className="bg-white" width={200}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={["1"]}
                  defaultOpenKeys={["sub1"]}
                  style={{ height: "100%" }}
                  items={items}
                />
              </Sider>
              <Content className="content-wrapper">{children}</Content>
            </Layout>
          </Content>
        </Body>
      </React.Suspense>
    </>
  );
};

export { PortalEmbedded };
