/* eslint-disable */
import React, { useEffect } from "react";
import { Head, Body, PageRFCProps } from "../index";
import "./Page.scss";

const Page: React.FC<PageRFCProps> = ({ children, ...props }): any | null => {
  const {
    pageTitle,
    titleSeparator,
    pageDescription,
    pageKeywords,
    pageAuthor,
    pageType,
    pageThumbnail,
    pageBreadcrumbs,
    theme,
    themeColor,
    locales,
    language,
    languageDirection,
    charSet,
    favicons,
    styles,
    appClassNames,
    siteName,
    siteLocale,
    twitterCard,
    twitterUsername,
    twitterAuthor,
    hideHeaderAndFooter,
    showRightSidebar,
    showLeftSidebar,
    isPortal,
  } = props;

  useEffect(() => {
    //console.log("PAGE:", props);
  }, []);

  return (
    <>
      <React.Suspense fallback={<>...</>}>
        <Head
          theme={theme}
          pageTitle={pageTitle}
          titleSeparator={titleSeparator}
          pageDescription={pageDescription}
          pageKeywords={pageKeywords}
          pageAuthor={pageAuthor}
          pageType={pageType}
          pageThumbnail={pageThumbnail}
          pageBreadcrumbs={pageBreadcrumbs}
          themeColor={themeColor}
          locales={locales}
          language={language}
          languageDirection={languageDirection}
          charSet={charSet}
          favicons={favicons}
          styles={styles}
          siteName={siteName}
          siteLocale={siteLocale}
          twitterCard={twitterCard}
          twitterUsername={twitterUsername}
          twitterAuthor={twitterAuthor}
          appClassNames={appClassNames}
        />
        <Body
          theme={theme}
          hideHeaderAndFooter={hideHeaderAndFooter}
          showRightSidebar={showRightSidebar}
          showLeftSidebar={showLeftSidebar}
          isPortal={isPortal}
        >
          {children}
        </Body>
      </React.Suspense>
    </>
  );
};

export { Page };
