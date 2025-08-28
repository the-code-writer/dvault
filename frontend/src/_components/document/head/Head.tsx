/* eslint-disable */
import React, { useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { HeadRFCProps, IFavicon, IStyle } from ".";
import { snippets } from "../../../_helpers";

const locationHostURL = snippets.location.getLocationHostURL();

const Head: React.FC<HeadRFCProps> = ({ children, ...props }): any | null => {
  const {
    pageTitle,
    titleSeparator,
    pageDescription,
    pageKeywords,
    pageAuthor,
    pageType,
    pageThumbnail,
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
  } = props;

  const generateLocales: any = (locales: any): any => {
    const localesArr: Array<any> = locales.split(",");

    return localesArr;
  };

  const generateFavicons: any = (sizes: any): any => {
    const sizesArr: Array<any> = [];

    const sizesList: Array<any> = sizes.split(",");

    sizesList.map((size: any) => {
      sizesArr.push({
        rel: "apple-touch-icon",
        sizes: `${size}x${size}`,
        href: `apple-touch-icon-${size}x${size}.png`,
      });
    });

    return sizesArr;
  };

  const generateStyles: any = (files: any): any => {
    const filesArr: Array<any> = [];

    const filesList: Array<any> = files.split(",");

    filesList.map((file: any) => {
      filesArr.push({
        rel: "stylesheet",
        type: "text/css",
        href: `${file}`,
      });
    });

    return filesArr;
  };

  // Title
  const _title: string = pageTitle || snippets.constants.DEFAULT_TITLE;

  // Meta
  const _direction: string =
    languageDirection || snippets.constants.DEFAULT_DIRECTION;

  const _seperator: string =
    titleSeparator || snippets.constants.DEFAULT_SEPERATOR;

  const _description: string =
    pageDescription || snippets.constants.DEFAULT_DESCRIPTION;

  const _keywords: string = pageKeywords || snippets.constants.DEFAULT_KEYWORDS;

  const _author: string = pageAuthor || snippets.constants.DEFAULT_AUTHOR;

  const _themeColor: string = themeColor || snippets.constants.THEME_COLOR;

  //SEO

  const _name: string = siteName || snippets.constants.SITE_NAME;

  const _locale: string = siteLocale || snippets.constants.DEFAULT_LOCALE;

  const _type: string = pageType || snippets.constants.DEFAULT_TYPE;

  const _thumbnail: string =
    pageThumbnail || snippets.constants.DEFAULT_THUMBNAIL;

  const _twitter_username: string =
    twitterUsername || snippets.constants.TWITTER_USERNAME;

  const _twitter_author: string =
    twitterAuthor || snippets.constants.TWITTER_AUTHOR;

  const _twitter_card: string = twitterCard || snippets.constants.DEFAULT_CARD;

  // Locales
  const _locales: Array<IFavicon> =
    locales || generateLocales(snippets.constants.LOCALES);

  // Favicons
  const _favicons: Array<IFavicon> =
    favicons || generateFavicons(snippets.constants.FAVICONS);

  //Styles
  const _styles: Array<IStyle> =
    styles || generateStyles(snippets.constants.STYLES);

  useEffect(() => {
    //console.log(_direction, charSet);
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          {/* html attributes */}
          <html lang={language} />

          {/* Title */}
          <title>
            {_title || snippets.constants.SITE_NAME} {_seperator} Handshake
          </title>

          {/* Meta */}
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
          />
          <meta name="description" content={_description} />
          <meta name="keywords" content={_keywords} />
          <meta name="author" content={_author} />
          <meta
            name="theme-color"
            content={_themeColor}
            media="(prefers-color-scheme: dark)"
          />
          <meta
            name="theme-color"
            content={_themeColor}
            media="(prefers-color-scheme: light)"
          />

          {/* SEO */}
          <meta property="og:locale" content={_locale} />
          <meta property="og:site_name" content={_name} />
          <meta property="og:title" content={_title} />
          <meta property="og:description" content={_description} />
          <meta property="og:image" content={_thumbnail} />
          <meta property="og:type" content={_type} />
          <meta property="twitter:site" content={_twitter_username} />
          <meta property="twitter:creator" content={_twitter_author} />
          <meta property="twitter:title" content={_title} />
          <meta property="twitter:description" content={_description} />
          <meta property="twitter:image" content={_thumbnail} />
          <meta property="twitter:card" content={_twitter_card} />

          {/* base element */}
          <base target="_blank" href={`${locationHostURL}/`} />

          {/* Locales */}
          <link rel="canonical" href={`${locationHostURL}/`} />

          {_locales?.map((locale: any, localeIndex: number) => (
            <link
              key={localeIndex}
              rel="alternate"
              href={`${locationHostURL}/${locale}`}
              lang={locale}
            />
          ))}

          {/* Favicons */}
          {_favicons?.map((favicon: IFavicon, faviconIndex: number) => (
            <link
              key={faviconIndex}
              rel={favicon.rel}
              type={favicon.type}
              sizes={favicon.sizes}
              href={`/assets/images/favicons/${favicon.href}`}
            />
          ))}

          {/* <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/manifest.json">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff"> */}

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
            rel="stylesheet"
          />

          {/* Styles */}
          {_styles?.map((link: IStyle, linkIndex: number) => (
            <link
              key={linkIndex}
              rel={link.rel}
              type={link.type}
              href={`/assets/styles/${link.href}`}
            />
          ))}

          {/* inline script elements */}
          <script type="application/ld+json">
            {`
          {
              "@context": "http://schema.org"
          }
        `}
          </script>

          {/* noscript elements */}
          <noscript>
            {`
            <link rel="stylesheet" type="text/css" href="/assets/styles/no-scripts.css" />
          `}
          </noscript>

          {/* Body */}
          <body className={appClassNames?.join(" ")} />
        </Helmet>
      </HelmetProvider>
    </>
  );
};

export { Head };
