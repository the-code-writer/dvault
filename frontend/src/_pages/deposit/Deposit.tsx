import React, { useEffect, useState } from "react";
import { Button, Col, Flex, Layout, Row, Space, Typography } from "antd";
import { Page } from "../../_components/document";
import {
  AmountsIn,
  RecipientWalletAddress,
  TotalFees,
  UnlockCriteria,
} from "../../_components/deposit";

import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import {
  ITransactionObject,
  ITransactionStatusEnums,
} from "../../_components/transactions";
import { BiSolidCog } from "react-icons/bi";
import { useOTCTradesSolanaData } from "../../_services/providers/data/context/OTCTradesSolanaDataContext";

import "./deposit.scss";
import { AxiosAPI, MD5 } from "../../_helpers";
import { Fade } from "react-awesome-reveal";
import TextArea from "antd/es/input/TextArea";

const { Content } = Layout;

const Deposit: React.FC = () => {
  const { Title, Text } = Typography;

  const [pageTitle, setPageTitle] = useState<string>("");
  const [pageDescription, setPageDescription] = useState<string>("");
  const [pageKeywords, setPageKeywords] = useState<any>("");
  const [pageBreadcrumbs, setPageBreadcrumbs] = useState<any>("");
  const [pageAuthor, setPageAuthor] = useState<string>("");
  const [pageThumbnail, setPageThumbnail] = useState<string>("");
  const [pageTheme, setPageTheme] = useState<string>("");

  useEffect(() => {
    setPageTitle("Send Money Privately");
    setPageDescription("Send money privately");
    setPageKeywords(["Solana", "privacy", "anonymous", "transactions", "zk"]);
    setPageBreadcrumbs("");
    setPageAuthor("@CrowdForm");
    setPageThumbnail("");
    setPageTheme("");
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [privateBalance, setPrivateBalance] = useState("0.00");

  const wallet = useWallet();

  const { walletHash, walletAddress, OTCTradesSolanaFunctions }: any =
    useOTCTradesSolanaData();

  const getWalletBalance: any = async () => {
    const SOLANA_HOST = clusterApiUrl("testnet");
    const connection = new anchor.web3.Connection(SOLANA_HOST);

    let lamportBalance;
    if (wallet?.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey);
      lamportBalance = balance / LAMPORTS_PER_SOL;
      setPrivateBalance(`${lamportBalance}`);
    }
  };

  useEffect(() => {
    console.log("walletAddress, walletHash", [walletAddress, walletHash]);
  }, [walletAddress, walletHash]);

  useEffect(() => {
    getWalletBalance();

    return () => {
      setPrivateBalance("0.00");
    };
  }, []);

  const [amountsInValue, setAmountsOutValue] = useState<any>(0);

  const [totalFeesValue, setTotalFeesValue] = useState<any>({});

  const [unlockCriteriaFormData, setUnlockCriteriaFormData] = useState<any>(0);

  const [recipientAddress, setRecipientAddress] = useState<string>("");

  const onAmountsInHandler: any = (amount: number) => {
    //console.log("onAmountsInHandler", amount);

    setAmountsOutValue(amount);
  };

  const onTotalFeesHandler: any = (fees: any) => {
    //console.log("onTotalFeesHandler", fees);

    setTotalFeesValue(fees);
  };

  const onUnlockCriteriaFormDataHandler: any = (payload: any) => {
    //console.log("onUnlockCriteriaFormData", payload, unlockCriteriaFormData);

    setUnlockCriteriaFormData(payload);
  };

  const onRecipientWalletAddressHandler: any = (address: string) => {
    //console.log("onRecipientWalletAddressHandler", address, recipientAddress);

    setRecipientAddress(address);
  };

  const generateATransactionPayload = () => {
    const _payload: ITransactionObject = {
      sender: {
        amountsOut: amountsInValue.selectedAmount,
        tokenIn: {
          tokenSymbol: amountsInValue.selectedToken.tokenSymbol,
          tokenAddress: amountsInValue.selectedToken.tokenAddress,
        },
        senderAddress: String(walletAddress),
      },
      receiver: {
        amountsIn: unlockCriteriaFormData.expectedAmount,
        tokenIn: {
          tokenSymbol: unlockCriteriaFormData.selectedToken.tokenSymbol,
          tokenAddress: unlockCriteriaFormData.selectedToken.tokenAddress,
        },
        receiverAddress: recipientAddress,
        expectedAmountValue: unlockCriteriaFormData.expectedAmount,
        expectedAmountToken: {
          tokenSymbol: unlockCriteriaFormData.selectedToken.tokenSymbol,
          tokenAddress: unlockCriteriaFormData.selectedToken.tokenAddress,
        },
      },
      exchange: {
        exchangeAmount: 0,
      },
      unlockCriteria: {
        title: unlockCriteriaFormData.title,
        description: unlockCriteriaFormData.description,
        isCancellable: unlockCriteriaFormData.cancellable,
        fundsLocked: false,
      },
      totalFeesPaid: {
        transactionFee: totalFeesValue.transactionFee,
        privacyFee: totalFeesValue.privacyFee,
        accountRent: totalFeesValue.accountRentalFee,
      },
      timestamps: {
        unlocksAt: unlockCriteriaFormData.unlocksAt,
        expiresAt: unlockCriteriaFormData.expiresAt,
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: 0,
        exchangedAt: 0,
        transactedAt: 0,
        fundsLockedAt: 0,
        fundsUnlockedAt: 0,
      },
      blockchain: {
        transactionStatus: {
          unlocks: {
            state: ITransactionStatusEnums.PENDING,
            label: "",
            value: "",
          },
          expires: {
            state: ITransactionStatusEnums.PENDING,
            label: "",
            value: "",
          },
          expectedFunds: {
            state: ITransactionStatusEnums.PENDING,
            label: "",
            value: "",
          },
          walletAddress: {
            state: ITransactionStatusEnums.PENDING,
            label: "",
            value: "",
          },
          fundsLocked: {
            state: ITransactionStatusEnums.PENDING,
            label: "",
            value: "",
          },
        },
        vaultID: "VAULT_ID",
        userID: "USER_ID",
        transactionID: "TRANSACTION_ID",
        authorityID: "ACCOUNT_ID",
        programID: "PROGRAM_ID",
        transactionType: "TOPUP|WITHDRAW|CLAIM|STATEMENT",
        transactionHash: "TRANSACTION_HASH",
        transactionCompleted: false,
      },
    };

    return _payload;
  };

  const executeTransaction = (
    transactionID: string,
    payload: ITransactionObject
  ) => {
    setIsLoading(true);
    localStorage.setItem("last_txn_id_success", "1");
    setTimeout(() => {
      setIsLoading(false);
      console.warn("TXN::", transactionID, payload);
    }, 1000);
  };

  const saveTransaction = () => {
    setIsLoading(true);
    const payload: ITransactionObject = generateATransactionPayload();
    localStorage.setItem("last_txn_data", JSON.stringify(payload));
    localStorage.setItem("last_txn_id_success", "0");
    localStorage.setItem("last_txn_id", "0");
    AxiosAPI.saveTransaction(payload)
      .then((result: any) => {
        setIsLoading(false);
        const transactionID: string = result.data;
        localStorage.setItem("last_txn_id", transactionID);
        executeTransaction(transactionID, payload);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("SAVE_TRANSACTION_ERROR", error);
      });
  };

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
      <Content className="txn-main-card" style={{ width: "100%" }}>
        <Space
          className="main"
          size={32}
          direction="vertical"
          style={{ width: "100%", padding: 0 }}
        >
          {/* Header */}
          <Fade delay={1 * 125}>
            <Row>
              <Col span={24}>
                <Flex justify={"space-between"} align={"center"}>
                  <img
                    alt=""
                    src="/logo.png"
                    style={{ width: 24, margin: 0 }}
                    className="demo-logo"
                  />
                  <Flex justify={"flex-end"} align={"center"} gap={10}>
                    <span className="txn-private-balance">
                      Private Balance: {privateBalance}
                    </span>
                    <Button
                      type="primary"
                      shape="circle"
                      size="small"
                      style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                      icon={<BiSolidCog />}
                      onClick={() => {
                        setIsSettingsModalOpen(!isSettingsModalOpen);
                      }}
                    />
                  </Flex>
                </Flex>
              </Col>
            </Row>
          </Fade>
          {/* Title */}
          <Fade delay={2 * 125}>
            <Row>
              <Col span={24}>
                <Flex justify={"center"} align={"flex-start"} gap={0} vertical>
                  <Title className="txn-main-title " level={2}>
                    Deposit Funds
                  </Title>
                  <Text className="txn-description">
                    Set access criteria to send and unlock funds privately
                  </Text>
                </Flex>
              </Col>
            </Row>
          </Fade>
          {/* AmountsIn */}
          <Fade delay={3 * 125}>
            <Row>
              <Col span={24}>
                <AmountsIn onAmountsIn={onAmountsInHandler} />
              </Col>
            </Row>
          </Fade>
          {/* Recipient Wallet Address */}
          <Fade delay={2 * 125}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <TextArea rows={8}
                  className="txn-unlock-criteria-form-input"
                  size="large"
                  placeholder="Enter details..."
                  value={""}
                  onChange={(e) => { }}
                ></TextArea>
              </Col>
            </Row>
          </Fade>
          {/* Send Transaction Button */}
          <Fade delay={7 * 125}>
            <Row>
              <Col span={24}>
                <Button
                  size="large"
                  className="txn-receipient-send-button"
                  loading={isLoading}
                  disabled={isLoading}
                  block
                  onClick={() => {
                    saveTransaction();
                  }}
                >
                  Deposit Funds
                </Button>
              </Col>
            </Row>
          </Fade>
        </Space>
      </Content>
    </Page>
  );
};

export { Deposit };
