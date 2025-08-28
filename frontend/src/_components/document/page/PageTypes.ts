/* eslint-disable */
interface IPage {
  showLogo?: boolean;
  children?: React.ReactNode;
}

type PageRFCProps = {
  theme?: string;
  pageTitle: string;
  titleSeparator?: string;
  languageDirection?: string;
  pageDescription?: string;
  pageKeywords?: string;
  pageAuthor?: string;
  pageType?: string;
  pageThumbnail?: string;
  pageBreadcrumbs?: string;
  themeColor?: string;
  language?: string;
  locales?: string;
  charSet?: string;
  favicons?: string;
  styles?: string;
  siteName?: string;
  siteLocale?: string;
  twitterCard?: string;
  twitterUsername?: string;
  twitterAuthor?: string;
  appClassNames?: Array<string>;
  hideHeaderAndFooter?: boolean;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  isPortal?: boolean;
  children?: React.ReactNode;
};

export type { IPage, PageRFCProps };
