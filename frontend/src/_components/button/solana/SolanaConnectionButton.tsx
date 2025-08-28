import React, { useMemo, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  Empty,
  Flex,
  Layout,
  MenuProps,
  Modal,
  Row,
  Space,
  notification,
} from "antd";
import {isMobile} from 'react-device-detect';
import {
  ApiOutlined,
  CaretDownOutlined
} from "@ant-design/icons";
import { BiNoEntry, BiSolidWalletAlt } from "react-icons/bi";
import { ISolanaConnectionButton } from ".";
import "./solana-connect-button.scss";
import { snippets } from "../../../_helpers";
import { useOTCTradesSolanaData } from "../../../_services/providers";
const { Content } = Layout;

const SolanaConnectionButton: React.FC<ISolanaConnectionButton> = ({
  children,
  ...props
}): any | null => {

  const { } = props;

  const { select, wallets, publicKey, disconnect }: any = useOTCTradesSolanaData();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  
  notification.config({
    placement: 'bottomRight',
    bottom: 24,
    maxCount: 1,
    duration: 5,
    rtl: true,
  });

  const [items, setItems] = useState<MenuProps["items"]>([
    {
      label: (
        <>
          <span className="">CONNECTED</span>
          <h5 className="">0x000...0000</h5>
        </>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <>
          <ApiOutlined /> Disconnect
        </>
      ),
      key: "1",
    },
  ]);

  const [connectedWallet, setConnectedWallet] = useState("");

  const selectHandler: any = (walletName: string) => {
    setModalIsOpen(false);

    select(walletName);

    setConnectedWallet(walletName);
  };

  const disconnectHandler: any = () => {
    setModalIsOpen(false);

    disconnect();
  };

  useMemo(() => {
    if (publicKey) {
      api.info({
        message: `${connectedWallet} wallet connected`,
        description: (
          <>{snippets.strings.shortenAddress(publicKey.toBase58())}</>
        ),
        placement: "bottomRight",
      });

      setItems([
        {
          label: (
            <>
              <span className="connected-wallet-title">CONNECTED</span>
              <span className="connected-wallet-address">
                {snippets.strings.shortenAddress(publicKey.toBase58())}
              </span>
            </>
          ),
          key: "0",
        },
        {
          type: "divider",
        },
        {
          label: (
            <>
              <span onClick={disconnectHandler}>
              <BiNoEntry className="btn-disconnect-server" /> Disconnect
              </span>
            </>
          ),
          key: "1",
        },
      ]);
    }
  }, [publicKey]);

  return (
    <>
      {contextHolder}
      {!publicKey ? (
        <Button
          type="text"
          size="large"
          className="btn-connect-wallet"
          onClick={() => {
            setModalIsOpen(!modalIsOpen);
          }}
          style={{
            fontWeight: 600
          }}
        >
          <BiSolidWalletAlt /> Connect {!isMobile && (<> Wallet</>)}
        </Button>
      ) : (
        <Dropdown menu={{ items }}>

          <Space className="connected-wallet-address-public-key">
            {snippets.strings.shortenAddress(publicKey.toBase58())}
            <CaretDownOutlined />
          </Space>

        </Dropdown>
      )}

      <Modal
        title="Connect a wallet to Handshake"
        className="txn-select-token-modal"
        centered
        open={modalIsOpen}
        onOk={() => setModalIsOpen(false)}
        onCancel={() => setModalIsOpen(false)}
        width={560}
        footer={<></>}
      >
        <Content style={{ width: "100%" }}>
          <Space
            className="main"
            size={8}
            direction="vertical"
            style={{ width: "100%", padding: 0, marginTop: 24 }}
          >
            {wallets.filter((wallet: any) => wallet.readyState === "Installed")
              .length > 0 ? (
              <>
                {wallets
                  .filter((wallet: any) => wallet.readyState === "Installed")
                  .map((wallet: any) => (
                    <Row key={wallet.adapter.icon}>
                      <Col span={24}>
                        <Content
                          className="btn-connect-wrapper"
                          onClick={() => selectHandler(wallet.adapter.name)}
                        >
                          <Flex justify={"space-between"} align={"center"}>
                            <Flex
                              justify={"flex-end"}
                              align={"center"}
                              gap={16}
                            >
                              <img
                                alt=""
                                src={wallet.adapter.icon}
                                style={{ width: 32, margin: 0 }}
                                className="btn-connect-icon"
                              />
                              <span className="btn-connect-wallet">
                                {wallet.adapter.name}
                              </span>
                            </Flex>
                            <span className="btn-connect-detected">
                              Detected
                            </span>
                          </Flex>
                        </Content>
                      </Col>
                    </Row>
                  ))}
              </>
            ) : (

              <Empty
                image="/wallet.svg"
                imageStyle={{ height: 300 }}
                description={
                  <h3>
                    No wallet found. Please download a supported Solana wallet
                  </h3>
                }
              >

              </Empty>
            )}
          </Space>
        </Content>
      </Modal>
    </>
  );
};

export { SolanaConnectionButton };
