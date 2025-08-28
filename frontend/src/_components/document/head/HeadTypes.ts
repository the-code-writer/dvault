/* eslint-disable */
interface TitleRFCProps {
  pageTitle: string;
  titleSeparator?: string;
  languageDirection?: string;
  children?: React.ReactNode;
}

interface MetaRFCProps {
  pageDescription?: string;
  pageKeywords?: string;
  pageAuthor?: string;
  themeColor?: string;
  children?: React.ReactNode;
}

type IStyle = {
  rel: string;
  href?: string;
  type?: string;
  as?: string;
  children?: React.ReactNode;
};

interface StyleRFCProps {
  links?: Array<IStyle>;
  children?: React.ReactNode;
}

type IFavicon = {
  rel: string;
  href?: string;
  type?: string;
  sizes?: string;
  children?: React.ReactNode;
};

interface FaviconRFCProps {
  links?: Array<IFavicon>;
  children?: React.ReactNode;
}

interface HeadRFCProps {
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
  children?: React.ReactNode;
}

export type {
  TitleRFCProps,
  MetaRFCProps,
  IStyle,
  StyleRFCProps,
  IFavicon,
  FaviconRFCProps,
  HeadRFCProps,
};
