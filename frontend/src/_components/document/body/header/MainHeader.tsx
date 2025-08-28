/* eslint-disable */
import { Layout, Affix, Menu, Flex } from "antd";
import "./header.scss";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { SolanaConnectionButton } from "../../../button";

const { Header } = Layout;

const MainHeader: React.FC = () => {

  const location = useLocation();

  const pageSegments: string[] = location.pathname.split('/').filter(Boolean);

  const [selectedKey, setSelectedKey] = useState(0);

  const items = [
    {
      key: 0,
      label: (
        <Link className={pageSegments[0]==="send"?"active":""} to="/send">
          {""}Send{""}
        </Link>
      ),
    },
    {
      key: 1,
      label: (
        <Link className={pageSegments[0]==="transactions"?"active":""} to="/transactions">
          {""}Transactions{""}
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

    return () => {
      setSelectedKey(0);
    };
    
  }, [pageSegments]);

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
              <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={[`${selectedKey}`]}
                items={items}
                style={{ flex: 1, minWidth: 50 }}
              />
            </Flex>
            <SolanaConnectionButton />
          </Flex>
        </Header>
      </Affix>
    </>
  );
};

export { MainHeader };
