/* eslint-disable */
import { Layout, Affix, Menu, Flex } from "antd";
import "./header.scss";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { SolanaConnectionButton } from "../../../button";

const { Header } = Layout;

const MainHeader: React.FC = () => {
  const location = useLocation();
  const pageSegments = location.pathname.split("/").filter(Boolean);
  const [selectedKey, setSelectedKey] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const items = [
    {
      key: 0,
      label: (
        <Link className={pageSegments[0] === "send" ? "active" : ""} to="/send">
          Send
        </Link>
      ),
    },
    {
      key: 1,
      label: (
        <Link
          className={pageSegments[0] === "transactions" ? "active" : ""}
          to="/transactions"
        >
          Transactions
        </Link>
      ),
    },
  ];

  useEffect(() => {
    switch (pageSegments[0]) {
      case "send": {
        setSelectedKey(0);
        break;
      }
      case "transactions": {
        setSelectedKey(1);
        break;
      }
      default: {
        setSelectedKey(0);
        break;
      }
    }
  }, [pageSegments]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const contentTop = contentRef.current.offsetTop;
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        setIsSticky(scrollTop > contentTop);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Affix offsetTop={0}>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <Flex
            justify={"space-between"}
            align={"center"}
            style={{ width: "100%" }}
            vertical={false}
          >
            <Flex
              justify={"flex-end"}
              align={"center"}
              gap={10}
              style={{ width: "100%" }}
            >
              <img
                alt=""
                src="/logo.png"
                style={{ width: 32, margin: 8 }}
                className="demo-logo"
              />
              {/* Removed Menu from header */}
            </Flex>
            <SolanaConnectionButton />
          </Flex>
        </Header>
      </Affix>

      {/* Sticky tabs container */}
      <div
        ref={contentRef}
        className={`tabs-container ${isSticky ? "sticky" : ""}`}
        style={{
          position: isSticky ? "fixed" : "static",
          top: isSticky ? "64px" : "0", // 64px is default Ant Design header height
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
          boxShadow: isSticky ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[`${selectedKey}`]}
          items={items}
          style={{
            flex: 1,
            minWidth: 50,
            justifyContent: "center",
            borderBottom: "none",
          }}
        />
      </div>

      {/* Page content with some spacing when tabs are sticky */}
      <div style={{ paddingTop: isSticky ? "56px" : "0" }}>
        {/* Your page content goes here */}
      </div>
    </>
  );
};

export { MainHeader };
