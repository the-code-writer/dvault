/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";

import { IToken, ITokenSelector } from ".";

import "./token-selector.scss";
import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Input, Modal, Row, Space, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { TokenSelectorPill } from "./TokenSelectorPill";
import { TokenSelectorListView } from "./TokenSelectorListView";

const TokenSelector: React.FC<ITokenSelector> = ({
  children,
  ...props
}): any | null => {

  const { size, inline, onTokenSelected, selectMaxAmount } = props;

  const { Text } = Typography;

  const [searchCriteria, setSearchCriteria] = useState("");

  const defaultToken = useMemo<IToken>(() => {
    return {
      tokenName: "SOL",
      tokenSymbol: "SOL",
      tokenIcon:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      tokenAddress: "SOL",
      tokenType: "SOL",
      isTokenVerified: true,
    };
  }, []);

  const [selectedToken, setSelectedToken] = useState<IToken>(defaultToken);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const onSelectTokenHandler: any = (token: any) => {
    const _selectedToken: IToken = {
      tokenName: token.name,
      tokenSymbol: token.symbol,
      tokenIcon: token.logoURI,
      tokenAddress: token.address,
      tokenType: "---",
      isTokenVerified: false,
    };
    console.log("onSelectTokenHandler", _selectedToken, token);
    if(_selectedToken.tokenName !== undefined){
      onTokenSelected(_selectedToken);
      setSelectedToken(_selectedToken);
      setModalIsOpen(false);
    }
    
  };

  const onSelectTokenFromPillHandler: any = (_selectedToken: any) => {
    // const _selectedToken:IToken = {
    //   tokenName: token.name,
    //   tokenSymbol: token.symbol,
    //   tokenIcon: token.logoURI,
    //   tokenAddress: token.address,
    //   tokenType: "SOL",
    //   isTokenVerified: false,
    // };
    console.log("onSelectTokenFromPillHandler", _selectedToken);
    if(_selectedToken.tokenName !== undefined){
      onTokenSelected(_selectedToken);
      setSelectedToken(_selectedToken);
      setModalIsOpen(false);
    }
  };

  useEffect(() => {
    setSelectedToken(defaultToken);
  }, [defaultToken]);

  return (
    <><Space className={`token-selector-btn-wrapper-container ${size} ${inline ? "inline" : ""}`}>
      <Flex justify={"center"} align={"center"} gap={3}>
        {selectMaxAmount && (
          <Button
            type="text"
            className="txt-input-amount-in-max"
            onClick={selectMaxAmount}
          >
            MAX
          </Button>
        )}
        <Button
          type="text"
          className={`token-selector-btn-wrapper`}
          onClick={() => {
            setModalIsOpen(true);
          }}
        >
          <Flex justify={"center"} align={"center"} gap={3}>
            <img
              alt=""
              src={selectedToken.tokenIcon}
              style={{ width: 18, margin: size === "small" ? 12 : 14, marginRight: 0, marginLeft: 8, borderRadius: 18 }}
              className="token-selector-icon"
            />
            <Text className="token-selector-label">
              {selectedToken.tokenSymbol}
            </Text>
            <CaretDownOutlined />
          </Flex>
        </Button>
      </Flex>
    </Space>

      <Modal
        title="Select a token"
        className="txn-select-token-modal"
        centered
        open={modalIsOpen}
        onCancel={() => setModalIsOpen(false)} 
        width={560}
        footer={<></>}
      >
        <p className="txn-select-token-description">
          Choose a token or search for a token’s symbol or address
        </p>

        <Content style={{ width: "100%" }}>
          <Space
            className="main"
            size={18}
            direction="vertical"
            style={{ width: "100%", padding: 0, marginTop: 0 }}
          >
            {/* Header */}
            <Row>
              <Col span={24}>
                <Input
                  size="large" type="number"
                  placeholder="Search by token name or address"
                  prefix={<SearchOutlined size={32} />}
                  className="txn-select-token-search"
                  onChange={(e) => {
                    setSearchCriteria(e.target.value);
                  }}
                />
              </Col>
            </Row>
            {/* Header */}
            <Row>
              <Col span={24}>
                <Flex justify={"space-between"} align={"center"} gap={4}>
                  <TokenSelectorPill
                    onSelectPill={onSelectTokenFromPillHandler}
                    address="0x0"
                    icon="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                    symbol="SOL"
                    name="Solana"
                    verified
                  />
                  <TokenSelectorPill
                    onSelectPill={onSelectTokenFromPillHandler}
                    address="0x0"
                    icon="https://arweave.net/2J8mJ6N6GCg7BWTHtcPZMEZsF2iuTYBRI9jdtnHS77o"
                    symbol="NINJA"
                    name="NINJA"
                    verified
                  />
                  <TokenSelectorPill
                    onSelectPill={onSelectTokenFromPillHandler}
                    address="0x0"
                    icon="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg"
                    symbol="USDT"
                    name="USDT"
                    verified
                  />
                  <TokenSelectorPill
                    onSelectPill={onSelectTokenFromPillHandler}
                    address="0x0"
                    icon="https://raw.githubusercontent.com/wormhole-foundation/wormhole-token-list/main/assets/USDCbs_wh.png"
                    symbol="USDC"
                    name="USDC"
                    verified
                  />
                  <TokenSelectorPill
                    onSelectPill={onSelectTokenFromPillHandler}
                    address="0x0"
                    icon="https://bafkreicih432wsfhvoycuao5umoq3p6pu3xz2wdlcaccd3ji5xofuwijai.ipfs.nftstorage.link"
                    symbol="KIT"
                    name="KIT"
                    verified
                  />
                </Flex>
              </Col>
            </Row>
            {/* Header */}
            <Row>
              <Col span={24}>
                <TokenSelectorListView
                  searchCriteria={searchCriteria}
                  onSelectToken={onSelectTokenHandler}
                />
              </Col>
            </Row>
          </Space>
        </Content>
      </Modal>
    </>
  );
};

export { TokenSelector };
