import React, { useEffect } from "react";
import "./Body.scss";
import { BodyRFCProps, MainHeader, MainFooter } from ".";
/* eslint-disable */
import {isMobile} from 'react-device-detect';
import { App, FloatButton, Layout } from "antd";

const Body: React.FC<BodyRFCProps> = ({ children, ...props }): any | null => {
  const {
    theme,
    hideHeaderAndFooter,
    showLeftSidebar,
    showRightSidebar,
    isPortal,
  } = props;

  // Todo: Render layout depending on Portal or Frontend

  useEffect(() => {
    //console.log("BODY:", isPortal);
  }, [isPortal]);

  return (
    <>
      <App
        message={{ maxCount: 3 }}
        notification={{ placement: "bottomLeft" }}
        className={`${theme} ${isMobile?"mobile":"desktop"}`}
      >
        <Layout>
          {!hideHeaderAndFooter && <MainHeader />}
          <Layout>
            {showLeftSidebar && <>{/* Todo:- If has left side bar */}</>}
            {children}
            {showRightSidebar && <>{/* Todo:- If has right side bar */}</>}
          </Layout>
          {!hideHeaderAndFooter && <MainFooter />}
        </Layout>
        <FloatButton.BackTop />
      </App>
    </>
  );
};

export { Body };
