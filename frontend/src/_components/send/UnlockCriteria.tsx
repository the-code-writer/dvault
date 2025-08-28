/* eslint-disable */
import React, { useEffect, useState } from "react";

import { IUnlockCriteria } from ".";

import "./unlock-criteria.scss";
import { Content } from "antd/es/layout/layout";
import {
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { BiCalendar } from "react-icons/bi";

import {
  Flex,
  Button,
  Input,
  Typography,
  Form,
  Tag,
  Row,
  Col,
  Radio,
  Space,
  DatePicker,
} from "antd";
import { TokenSelector } from "../tokens";
import TextArea from "antd/es/input/TextArea";

type RequiredMark = boolean | "optional" | "customize";

const customizeRequiredMark = (
  label: React.ReactNode,
  { required }: { required: boolean }
) => (
  <>
    {required ? (
      <Tag color="error">Required</Tag>
    ) : (
      <Tag color="warning">optional</Tag>
    )}
    {label}
  </>
);

const UnlockCriteria: React.FC<IUnlockCriteria> = ({
  children,
  ...props
}): any | null => {

  const { onUnlockCriteriaFormData } = props;

  const { Text } = Typography;

  const [collapsed, setCollapsed] = useState(true);

  const [form] = Form.useForm();

  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>("optional");

  const onRequiredTypeChange = ({
    requiredMarkValue,
  }: {
    requiredMarkValue: RequiredMark;
  }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  const [selectedToken, setSelectedToken] = useState({});

  const onTokenSelectedHandler: any = (token: any) => {
    setSelectedToken(token);
  };

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [unlocksOn, setUnlocksOn] = useState<string>("");
  const [expiresOn, setExpiresOn] = useState<string>("");
  const [expectedAmount, setExpectedAmount] = useState<number>(0);
  const [cancellable, setCancellable] = useState<string>("");
  
  const onGetFieldsValue: any = () => {

    const _payload:any = {
      title, description, unlocksOn,expiresOn,  expectedAmount, cancellable, selectedToken
    }

    onUnlockCriteriaFormData(_payload);

  };

  const parseDateFromPicker: any = (dateString:string, callBackFunction:any) => {

    callBackFunction(dateString);

  };

  useEffect(() => {

    onGetFieldsValue();

  }, [title, description, unlocksOn,expiresOn,  expectedAmount, cancellable, selectedToken]);

  return (
    <>
      <Content className="txn-unlock-criteria-wrapper">
        <Flex
          className="txn-unlock-criteria-container-fluid"
          justify={"space-between"}
          align={"center"}
          style={{ width: "100%" }}
          onClick={() => {
              setCollapsed(!collapsed);
            }}
        >
          <Text className="txn-unlock-criteria-label">
            Set Unlock Funds Criteria
          </Text>
          <Button
            type="text"
            className="txn-unlock-criteria-btn-wrapper"
            
          >
            {collapsed ? <PlusOutlined /> : <MinusOutlined />}
          </Button>
        </Flex>

        {/* Form */}

        {!collapsed && (
          <Content style={{ marginTop: 32 }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{ requiredMarkValue: requiredMark }}
              onValuesChange={onRequiredTypeChange}
              requiredMark={
                requiredMark === "customize"
                  ? customizeRequiredMark
                  : requiredMark
              }
              onFieldsChange={(_, allFields) => {
                onGetFieldsValue([_, allFields]);
              }}
            >

              <Space
                className="main"
                size={20}
                direction="vertical"
                style={{ width: "100%", padding: 0, marginTop: 0 }}
              >
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Title"
                      required
                      className="txn-unlock-criteria-form-label"
                    >
                      <Input
                        className="txn-unlock-criteria-form-input"
                        size="large"
                        placeholder="E.g. Payment for March"
                        value={title}
                        onChange={(e)=>{setTitle(e.target.value)}}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Description"
                      required
                      className="txn-unlock-criteria-form-label"
                    >
                      <TextArea
                        className="txn-unlock-criteria-form-input"
                        size="large"
                        placeholder="Enter details..."
                        value={description}
                        onChange={(e)=>{setDescription(e.target.value)}}
                      ></TextArea>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      label="Unlocks on"
                      required
                      tooltip="This is a required field"
                      className="txn-unlock-criteria-form-label"
                    >
                      <DatePicker suffixIcon={<BiCalendar />} className="txn-unlock-criteria-form-input" onChange={(_,f)=>parseDateFromPicker(f,setUnlocksOn)} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      label="Expires on"
                      required
                      tooltip="This is a required field"
                      className="txn-unlock-criteria-form-label"
                    >
                      <DatePicker suffixIcon={<BiCalendar />} className="txn-unlock-criteria-form-input" onChange={(_,f)=>parseDateFromPicker(f,setExpiresOn)} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Expected amount"
                      required
                      tooltip="This is a required field"
                      className="txn-unlock-criteria-form-label"
                    >
                      <Input
                        className="txn-unlock-criteria-form-input"
                        size="large"
                        placeholder="0.00"
                        value={expectedAmount} type="number"
                        onChange={(e)=>{setExpectedAmount(Number(e.target.value))}}
                      />
                      <TokenSelector selectMaxAmount={false} onTokenSelected={onTokenSelectedHandler} size="small" inline />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label="Choose if the trade can be cancelled"
                      required
                      tooltip="This is a required field"
                      className="txn-unlock-criteria-form-label"
                    >
                      <Radio.Group 
                        defaultValue={false} 
                        buttonStyle="solid"
                        value={cancellable}
                        onChange={(e)=>{setCancellable(e.target.value)}}
                        >
                        <Radio.Button value={true}>Yes</Radio.Button>
                        <Radio.Button value={false}>No</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
                </Row>

              </Space>
            </Form>
          </Content>
        )}
      </Content>
    </>
  );
};

export { UnlockCriteria };
