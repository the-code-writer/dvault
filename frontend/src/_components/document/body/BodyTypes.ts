/* eslint-disable */
interface IBody {
  loggedIn: boolean;
}

type BodyRFCProps = {
  theme?: string;
  hideHeaderAndFooter?: boolean;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  isPortal?: boolean;
  children?: React.ReactNode;
};

export type { IBody, BodyRFCProps };
