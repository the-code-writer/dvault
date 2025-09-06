import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Tabs, 
  Card, 
  Button, 
  Table, 
  Statistic, 
  Row, 
  Col, 
  InputNumber,
  Form,
  Drawer,
  Descriptions,
  Space,
  Typography,
  message,
  Divider,
  Tag,
  Modal,
  Input,
  Flex
} from 'antd';
import { 
  WalletOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  HistoryOutlined,
  SettingOutlined,
  LogoutOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { ActionButtonList } from './components/ActionButtonList';
import { SmartContractActionButtonList } from './components/SmartContractActionButtonList';
import { InfoList } from './components/InfoList';
import { useAppKitAccount } from '@reown/appkit/react';
import vault from "./assets/vault.png"

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// Define types
interface Transaction {
  key: string;
  type: 'deposit' | 'withdrawal' | 'emergency';
  amount: number;
  date: string;
  status: string;
  hash: string;
}

interface AccountInfo {
  address: string;
  balance: string;
  ethValue: number;
  availableWithdraw: number;
  withdrawalLimit: number;
  monthlyWithdrawals: number;
}

const VaultDashboard: React.FC = () => {

  const [transactionHash, setTransactionHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [signedMsg, setSignedMsg] = useState("");
  const [balance, setBalance] = useState("");

  const receiveHash = (hash: `0x${string}`) => {
    setTransactionHash(hash); // Update the state with the transaction hash
  };

  const receiveSignedMsg = (signedMsg: string) => {
    setSignedMsg(signedMsg); // Update the state with the transaction hash
  };

  const receivebalance = (balance: string) => {
    setBalance(balance);
  };
  const { address, caipAddress, isConnected, status, embeddedWalletInfo } = useAppKitAccount(); 

  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>({});
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [emergencyPassword, setEmergencyPassword] = useState<string>('');
  const [emergencyAmount, setEmergencyAmount] = useState<number>(0);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);

  // Mock data
  const mockAccountInfo: AccountInfo = {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    balance: '4520.75',
    ethValue: 1.42,
    availableWithdraw: 1000,
    withdrawalLimit: 1000,
    monthlyWithdrawals: 1
  };

  const mockTransactions: Transaction[] = [
    {
      key: '1',
      type: 'deposit',
      amount: 2500,
      date: '2023-10-15 14:32:22',
      status: 'completed',
      hash: '0x4e3a3754410177e6937ef'
    },
    {
      key: '2',
      type: 'withdrawal',
      amount: 500,
      date: '2023-10-18 09:15:47',
      status: 'completed',
      hash: '0x5b2a4654410177e6937ef'
    },
    {
      key: '3',
      type: 'emergency',
      amount: 1000,
      date: '2023-09-05 16:45:12',
      status: 'completed',
      hash: '0x6c3b8754410177e6937ef'
    }
  ];

  useEffect(() => {
    // Check if MetaMask is installed
    setIsMetamaskInstalled(typeof window.ethereum !== 'undefined');
    
    // Check if wallet is already isConnected
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      //setisConnected(true);
      setAccountInfo({
        ...mockAccountInfo,
        address: savedAddress
      });
      setTransactions(mockTransactions);
    }
  }, []);

  const connectWallet = async () => {
    if (!isMetamaskInstalled) {
      Modal.info({
        title: 'MetaMask Not Installed',
        content: 'Please install MetaMask to connect your wallet.',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const address = '0x' + Math.random().toString(16).substr(2, 40);
      localStorage.setItem('walletAddress', address);
      //setisConnected(true);
      
      setAccountInfo({
        ...mockAccountInfo,
        address: address
      });
      setTransactions(mockTransactions);
      
      message.success('Wallet isConnected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      message.error('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('walletAddress');
    //setisConnected(false);
    setAccountInfo(null);
    setShowDrawer(false);
    message.info('Wallet disisConnected');
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      message.error('Please enter a valid amount');
      return;
    }
    
    if (withdrawAmount > (accountInfo?.availableWithdraw || 0)) {
      message.error('Amount exceeds available withdrawal limit');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success(`Withdrawal of ${withdrawAmount} USDT processed successfully`);
      setWithdrawAmount(0);
      
      // Update account info
      if (accountInfo) {
        setAccountInfo({
          ...accountInfo,
          balance: (parseFloat(accountInfo.balance) - withdrawAmount).toFixed(2),
          availableWithdraw: accountInfo.availableWithdraw - withdrawAmount,
          monthlyWithdrawals: accountInfo.monthlyWithdrawals + 1
        });
        
        // Add to transaction history
        const newTransaction: Transaction = {
          key: (transactions.length + 1).toString(),
          type: 'withdrawal',
          amount: withdrawAmount,
          date: new Date().toLocaleString(),
          status: 'completed',
          hash: '0x' + Math.random().toString(16).substr(2, 40)
        };
        setTransactions([newTransaction, ...transactions]);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      message.error('Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
      message.error('Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success(`Deposit of ${depositAmount} USDT processed successfully`);
      setDepositAmount(0);
      
      // Update account info
      if (accountInfo) {
        setAccountInfo({
          ...accountInfo,
          balance: (parseFloat(accountInfo.balance) + depositAmount).toFixed(2)
        });
        
        // Add to transaction history
        const newTransaction: Transaction = {
          key: (transactions.length + 1).toString(),
          type: 'deposit',
          amount: depositAmount,
          date: new Date().toLocaleString(),
          status: 'completed',
          hash: '0x' + Math.random().toString(16).substr(2, 40)
        };
        setTransactions([newTransaction, ...transactions]);
      }
    } catch (error) {
      console.error('Deposit error:', error);
      message.error('Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyWithdraw = async () => {
    if (!emergencyAmount || emergencyAmount <= 0) {
      message.error('Please enter a valid amount');
      return;
    }
    
    if (!emergencyPassword) {
      message.error('Please enter the emergency password');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success(`Emergency withdrawal of ${emergencyAmount} USDT processed successfully`);
      setEmergencyAmount(0);
      setEmergencyPassword('');
      
      // Update account info
      if (accountInfo) {
        setAccountInfo({
          ...accountInfo,
          balance: (parseFloat(accountInfo.balance) - emergencyAmount).toFixed(2)
        });
        
        // Add to transaction history
        const newTransaction: Transaction = {
          key: (transactions.length + 1).toString(),
          type: 'emergency',
          amount: emergencyAmount,
          date: new Date().toLocaleString(),
          status: 'completed',
          hash: '0x' + Math.random().toString(16).substr(2, 40)
        };
        setTransactions([newTransaction, ...transactions]);
      }
    } catch (error) {
      console.error('Emergency withdrawal error:', error);
      message.error('Emergency withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const transactionColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'deposit' ? 'green' : type === 'withdrawal' ? 'blue' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Amount (USDT)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => amount.toLocaleString()
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Transaction Hash',
      dataIndex: 'hash',
      key: 'hash',
      render: (hash: string) => (
        <Text copyable={{ text: hash }} ellipsis={{ tooltip: hash }} style={{ width: 120, display: 'block' }}>
          {hash.substring(0, 10)}...{hash.substring(hash.length - 4)}
        </Text>
      )
    }
  ];

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>

      {isConnected && (
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "0 24px",
        }}
      >
        <Space>
          <Button
            type="text"
            icon={
              <WalletOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            }
            onClick={() => setShowDrawer(true)}
          />

          <Title level={3} style={{ margin: 0 }}></Title>
        </Space>

        <Space>
          <appkit-button />
        </Space>
      </Header>
      )}
      
      <Content style={{ padding: "24px" }}>
        {isConnected && accountInfo ? (
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Tabs defaultActiveKey="1" type="card">
              <TabPane
                tab={
                  <span>
                    <ArrowUpOutlined />
                    Withdraw
                  </span>
                }
                key="1"
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Card title="Regular Withdrawal" style={{ height: "100%" }}>
                      <Form layout="vertical">
                        <Form.Item label="Amount to Withdraw (USDT)" required>
                          <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            max={accountInfo.availableWithdraw}
                            value={withdrawAmount}
                            onChange={(value) => setWithdrawAmount(value || 0)}
                            placeholder="Enter amount"
                            size="large"
                          />
                        </Form.Item>

                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Text type="secondary">
                            Available to withdraw:{" "}
                            <Text strong>
                              {accountInfo.availableWithdraw} USDT
                            </Text>
                          </Text>
                          <Text type="secondary">
                            Monthly withdrawals:{" "}
                            <Text strong>
                              {accountInfo.monthlyWithdrawals}/3
                            </Text>
                          </Text>

                          <Button
                            type="primary"
                            onClick={handleWithdraw}
                            loading={loading}
                            disabled={
                              !withdrawAmount ||
                              withdrawAmount > accountInfo.availableWithdraw
                            }
                            icon={<ArrowUpOutlined />}
                            size="large"
                            style={{
                              width: "100%",
                              marginTop: 16,
                              height: "45px",
                            }}
                          >
                            Withdraw
                          </Button>
                        </Space>
                      </Form>
                    </Card>
                  </Col>

                  <Col xs={24} md={12}>
                    <Card
                      title="Emergency Withdrawal"
                      style={{ height: "100%" }}
                    >
                      <Form layout="vertical">
                        <Form.Item label="Amount to Withdraw (USDT)" required>
                          <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            value={emergencyAmount}
                            onChange={(value) => setEmergencyAmount(value || 0)}
                            placeholder="Enter amount"
                            size="large"
                          />
                        </Form.Item>

                        <Form.Item label="Emergency Password" required>
                          <Input.Password
                            value={emergencyPassword}
                            onChange={(e) =>
                              setEmergencyPassword(e.target.value)
                            }
                            placeholder="Enter password from trusted partner"
                            size="large"
                          />
                        </Form.Item>

                        <Button
                          type="primary"
                          danger
                          onClick={handleEmergencyWithdraw}
                          loading={loading}
                          disabled={!emergencyAmount || !emergencyPassword}
                          icon={<ArrowUpOutlined />}
                          size="large"
                          style={{ width: "100%", height: "45px" }}
                        >
                          Emergency Withdraw
                        </Button>

                        <Divider />

                        <div
                          style={{
                            background: "#fff2e8",
                            padding: "12px",
                            borderRadius: "6px",
                          }}
                        >
                          <InfoCircleOutlined
                            style={{ color: "#fa8c16", marginRight: "8px" }}
                          />
                          <Text type="warning">
                            Emergency withdrawals require a password from your
                            trusted partner and have a 30-day cooldown period.
                          </Text>
                        </div>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <ArrowDownOutlined />
                    Deposit
                  </span>
                }
                key="2"
              >
                <Row justify="center">
                  <Col xs={24} md={12} lg={8}>
                    <Card title="Deposit Funds">
                      <Form layout="vertical">
                        <Form.Item label="Amount to Deposit (USDT)" required>
                          <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            value={depositAmount}
                            onChange={(value) => setDepositAmount(value || 0)}
                            placeholder="Enter amount"
                            size="large"
                          />
                        </Form.Item>

                        <Button
                          type="primary"
                          onClick={handleDeposit}
                          loading={loading}
                          disabled={!depositAmount}
                          icon={<ArrowDownOutlined />}
                          size="large"
                          style={{ width: "100%", height: "45px" }}
                        >
                          Deposit
                        </Button>

                        <Divider />

                        <div style={{ textAlign: "center" }}>
                          <Text>
                            Current Balance:{" "}
                            <Text strong style={{ fontSize: "18px" }}>
                              {accountInfo.balance} USDT
                            </Text>
                          </Text>
                        </div>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <HistoryOutlined />
                    Transactions
                  </span>
                }
                key="3"
              >
                <Card title="Transaction History">
                  <Table
                    className="digits"
                    columns={transactionColumns}
                    dataSource={transactions}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: true }}
                  />
                </Card>
              </TabPane>

              <TabPane tab="Account Summary" key="4">
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        className="digits"
                        title="Total Balance"
                        value={accountInfo.balance}
                        precision={2}
                        valueStyle={{ color: "#3f8600" }}
                        suffix="USDT"
                      />
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        className="digits"
                        title="Available to Withdraw"
                        value={accountInfo.availableWithdraw}
                        valueStyle={{ color: "#1890ff" }}
                        suffix="USDT"
                      />
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        className="digits"
                        title="ETH Value"
                        value={accountInfo.ethValue}
                        precision={4}
                        valueStyle={{ color: "#722ed1" }}
                        prefix="Ξ"
                      />
                    </Card>
                  </Col>

                  <Col xs={24}>
                    <Card title="Withdrawal Limits">
                      <Descriptions bordered column={1}>
                        <Descriptions.Item label="Current Tier Limit">
                          <Text strong className="digits">
                            {accountInfo.withdrawalLimit} USDT
                          </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Monthly Withdrawals Used">
                          <Text strong className="digits">
                            {accountInfo.monthlyWithdrawals} / 3
                          </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Next Reset">
                          15th of next month
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        ) : (
          <Row justify="center" style={{ marginTop: "60px" }}>
            <Col xs={24} md={12} lg={8}>
                <Card style={{ textAlign: "center", borderRadius: "8px" }}>
                  <Flex vertical align='center' justify='center'>
                    
                    <img src={vault} style={{width: 185, padding: 5}}  />
                <Title level={3}>Connect Your Wallet</Title>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: "24px" }}
                >
                  Connect your wallet to manage your vault, make deposits and
                  withdrawals, and view your transaction history.
                </Text>
                <appkit-button /></Flex>
              </Card>
            </Col>
          </Row>
        )}
      </Content>

      <Drawer
        title="Account Details"
        placement="left"
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        width={400}
      >
        {accountInfo && (
          <>
            <ActionButtonList
              sendHash={receiveHash}
              sendSignMsg={receiveSignedMsg}
              sendBalance={receivebalance}
            />
            <SmartContractActionButtonList />
            <div className="advice">
              <p>
                This projectId only works on localhost. <br />
                Go to{" "}
                <a
                  href="https://cloud.reown.com"
                  target="_blank"
                  className="link-button"
                  rel="Reown Cloud"
                >
                  Reown Cloud
                </a>{" "}
                to get your own.
              </p>
            </div>
            <InfoList
              hash={transactionHash}
              signedMsg={signedMsg}
              balance={balance}
            />
          </>
        )}
      </Drawer>
    </Layout>
  );
};

export default VaultDashboard;