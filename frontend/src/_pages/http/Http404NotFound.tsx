/* eslint-disable */
import React from "react";

import { Col, Row, Card } from "antd";

import { PageRFCProps } from "../../_types";

import "./http.scss";

const Http404NotFound: React.FC<PageRFCProps> = (): any | null => {
  return (
    <>
      <Row className="w-100 my-10">
        <Col flex="auto" />
        <Col
          className="w-100 max-w-400"
          xs={23}
          sm={16}
          md={12}
          lg={10}
          xl={8}
          xxl={6}
        >
          <Card># 404 Not Found</Card>
        </Col>
        <Col flex="auto" />
      </Row>
    </>
  );
};

export { Http404NotFound };
