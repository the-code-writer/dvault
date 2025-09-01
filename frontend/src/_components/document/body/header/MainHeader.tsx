import React, { useState, useEffect } from "react";
import { Layout, Affix, Menu, Flex, Drawer, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { SolanaConnectionButton } from "../../../button";
import {
  MenuOutlined,
  DashboardOutlined,
  CreditCardOutlined,
  DownloadOutlined,
  SendOutlined,
  SwapOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import "./header.scss";
import logoLong from "../../../../assets/logo-long.png";
const { Header } = Layout;

const MainHeader = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("0");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Map pathnames to menu keys
  const pathToKeyMap = {
    "/dashboard": "0",
    "/deposit": "1",
    "/withdraw": "2",
    "/send": "3",
    "/swap": "4",
    "/transactions": "5",
  };

  // Update selected key based on current path
  useEffect(() => {
    const pathname = location.pathname;

    // Find the matching key
    for (const [path, key] of Object.entries(pathToKeyMap)) {
      if (pathname === path || pathname.startsWith(path + "/")) {
        setSelectedKey(key);
        return;
      }
    }

    // Default to dashboard if no match
    setSelectedKey("0");
  }, [location.pathname]);

  const menuItems = [
    {
      key: "0",
      label: <Link to="/dashboard">Dashboard</Link>,
      //icon: <DashboardOutlined />,
    },
    {
      key: "1",
      label: <Link to="/deposit">Deposit</Link>,
      //icon: <CreditCardOutlined />,
    },
    {
      key: "2",
      label: <Link to="/withdraw">Withdraw</Link>,
      //icon: <DownloadOutlined />,
    },
    {
      key: "3",
      label: <Link to="/send">Send</Link>,
      //icon: <SendOutlined />,
    },
    {
      key: "4",
      label: <Link to="/swap">Swap</Link>,
      //icon: <SwapOutlined />,
    },
    {
      key: "5",
      label: <Link to="/transactions">Transactions</Link>,
      //icon: <HistoryOutlined />,
    },
  ];

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <Affix offsetTop={0}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: "0 24px",
          height: "64px",
        }}
      >
        {/* Logo on the left */}
        <div className="logo-wrapper">
          <img alt="Logo" src={logoLong} />
        </div>

        {/* Centered menu - hidden on small screens */}
        {windowWidth > 1160 && (
          <div
            style={{
              flex: "1 1 auto",
              display: "flex",
              justifyContent: "center",
              margin: "0 24px",
            }}
          >
            <Menu
              theme="light"
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={menuItems}
              style={{
                border: "none",
                background: "transparent",
                flex: "0 1 auto",
              }}
            />
          </div>
        )}

        {/* Connect button on the right */}
        <div style={{ flex: "0 0 auto", marginLeft: "auto" }}>
          <SolanaConnectionButton />
        </div>

        {/* Mobile menu button - only visible on small screens */}
        {windowWidth <= 1160 && (
          <div style={{ marginLeft: "16px" }}>
            <Button type="text" icon={<MenuOutlined />} onClick={showDrawer} />
          </div>
        )}

        {/* Mobile drawer menu */}
        <Drawer
          title="Navigation"
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            mode="vertical"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ border: "none" }}
          />
        </Drawer>
      </Header>
    </Affix>
  );
};

export { MainHeader };
