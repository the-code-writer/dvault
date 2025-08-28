/* eslint-disable */
type IPage = {
  showLogo?: boolean;
  children?: React.ReactNode;
};

type PageRFCProps = {
  pageTitle?: string;
  pageDescription?: string;
  pageKeywords?: Array<string>;
  pageBreadcrumbs?: Array<any>;
  pageAuthor?: string;
  pageThumbnail?: string;
  theme?: string;
  children?: React.ReactNode;
};

export type { IPage, PageRFCProps };
