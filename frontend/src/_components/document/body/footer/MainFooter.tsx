/* eslint-disable */
import { Layout } from "antd";

import "./footer.scss";

const { Footer } = Layout;

type FooterProps = {
  theme?: string;
  children?: React.ReactNode;
};

const MainFooter: React.FC<FooterProps> = ({
  children,
  ...props
}): any | null => {
  const { theme } = props;

  return (
    <>
      <Footer style={{ textAlign: "center" }} className={theme || "light"}>
        Handshake ©{new Date().getFullYear()}. All Rights Reserved
      </Footer>
    </>
  );
};

export { MainFooter };
