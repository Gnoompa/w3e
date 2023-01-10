import "@rainbow-me/rainbowkit/styles.css";

import normalizeCss from "../node_modules/normalize.css/normalize.css";
import resetCss from "../styles/reset.css";
import globalCss from "../styles/index.css";
import theme from "../styles/theme";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
// import { StyledEngineProvider } from "@mui/material/styles";
import { store } from "../app/store";
import { Provider } from "react-redux";
import process from "process";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import * as chain from "@wagmi/core/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import isMobile from "is-mobile";
import { defaultChainId } from "helpers/contract";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { LensProvider } from "@memester-xyz/lens-use/dist/context/LensContext";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

function MyApp({ Component, pageProps }: AppProps) {
  const { chains, provider } = configureChains(
    [defaultChainId == chain.polygon.id ? chain.polygon : chain.polygonMumbai],
    [alchemyProvider({ apiKey: process.env.alchemyId })]
  );

  // const connectors = () => {
  //   return [
  //     new InjectedConnector({
  //       chains,
  //       options: { shimDisconnect: true },
  //     }),
  //     !isMobile() &&
  //       new MetaMaskConnector({
  //         chains,
  //       }),
  //     new WalletConnectConnector({
  //       chains,
  //       options: {
  //         qrcode: false,
  //       },
  //     }),
  //   ];
  // };
  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });

  const client = createClient(
    getDefaultClient({
      autoConnect: true,
      appName: "web3events",
      connectors,
      // alchemyId: process.env.alchemyId,
      chains,
      // chains:
      //   defaultChainId == chain.polygon.id
      //     ? [chain.polygon, chain.polygonMumbai]
      //     : [chain.polygonMumbai, chain.polygon],
    })
  );

  // const APIURL = "https://api.lens.dev/";
  const APIURL = "https://api-sandbox-mumbai.lens.dev";

  const apolloClient = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });

  return (
    <>
      <Head>
        <title>Web3Events</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/mobile/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/mobile/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/mobile/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/mobile/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/mobile/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/mobile/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/mobile/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/mobile/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/mobile/apple-icon-180x180.png"
        />
        <link rel="manifest" href="/mobile/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/mobile/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff"></meta>
        <meta
          content="Web3Events is a platform for ticket management in web3 world. Create, distribute and verify tickets in an intuitive interface."
          name="description"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          content="width=device-width, initial-scale=1, maximum-scale=5"
          name="viewport"
        />
        // icons
        <link
          rel="shortcut icon"
          type="image/x-icon"
          sizes="32x32"
          href="/favicon.ico"
        />
        <link rel="apple-touch-icon" sizes="256x256" href="/favicon.ico" />
        <link rel="icon" sizes="any" type="image/svg+xml" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/mobile/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/mobile/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/mobile/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/mobile/favicon-16x16.png"
        />
        <link rel="shortlink" href="https://web3Events.ai/" />
        <link rel="canonical" href="https://web3Events.ai/" />
        // Static speedup
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://static.web3events.ai" />
        <link rel="preconnect" href="https://static.web3events.ai" />
        // Google
        <meta name="google" content="notranslate" />
        <meta
          property="og:title"
          content="Ticketing Platform for Web3 Community - Web3Events"
        />
        <meta
          property="og:description"
          content="Web3Events is a platform for ticket management in web3 world. Create, distribute and verify tickets in an intuitive interface."
        />
        <meta
          property="og:image:alt"
          content="New building block for the people of the world."
          data-rh="true"
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://web3events.ai" />
        <meta property="og:site_name" content="Web3Events" data-rh="true" />
        <meta property="og:image:type" content="image/png" data-rh="true" />
        <meta property="og:image" content="/og-cover.png" data-rh="true" />
        // OpenGraph
        <meta
          property="og:title"
          content="Ticketing Platform for Web3 Community - Web3Events"
        />
        <meta
          property="og:description"
          content="Web3Events is a platform for ticket management in web3 world. Create, distribute and verify tickets in an intuitive interface."
        />
        <meta
          property="og:image:alt"
          content="New building block for the people of the world."
          data-rh="true"
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://web3events.ai" />
        <meta property="og:site_name" content="Web3Events" data-rh="true" />
        <meta property="og:image:type" content="image/png" data-rh="true" />
        <meta property="og:image" content="/og-cover.png" data-rh="true" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        // Twitter
        <meta
          property="twitter:title"
          content="Web3Events – Create &amp; Receive NFT Tickets"
          data-rh="true"
        />
        <meta
          property="twitter:description"
          content="Web3Events is an all in one place to create, distribute and verify tickets for your event in a convenient way. Start building web3 community today. 🎫"
          data-rh="true"
        />
        <meta
          property="twitter:image:alt"
          content="New building block for the people of the world."
          data-rh="true"
        />
        <meta
          property="twitter:card"
          content="summary_large_image"
          data-rh="true"
        />
        <meta property="twitter:site" content="@Web3Events_ai" data-rh="true" />
        <meta
          property="twitter:creator"
          content="@petr_kuznetsof"
          data-rh="true"
        />
        <meta
          property="twitter:image"
          content="https://web3events.ai/og-cover.png"
          data-rh="true"
        />
        <meta property="twitter:image:width" content="400" />
        <meta property="twitter:image:height" content="400" />
        {/* <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta> */}
        <meta name="theme-color" content="black" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-470YTNYWWK"
        />
        <script async src="https://widget.frill.co/v2/widget.js"></script>
        <style>{`
          ${resetCss}
          ${normalizeCss}
          ${globalCss}
      `}</style>
      </Head>
      <Script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());

          gtag('config', 'G-470YTNYWWK');`,
        }}
      ></Script>
      <Script
        type="application/ld+json"
        data-rh="true"
        dangerouslySetInnerHTML={{
          __html: `{
              "@context": "http://schema.org",
              "@type": "Organization",
              "name": "Web3Events",
              "url" : "https://app.web3events.ai",
              "logo": {
                "@type": "ImageObject",
                "url": "https://web3events.ai/og-cover.png"
              }
            }`,
        }}
      ></Script>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `[{ "@context" : "Schema.org - Schema.org", "@type" : "WebSite", "name" : "Web3Events", "alternateName" : "W3 Events", "url" : "Web3Events – Create & Receive NFT Tickets", "sameAs": [ "Web3Events_ai", "https://www.linkedin.com/company/web3events", "Web3Events", "https://www.instagram.com/vveb3events", "Web3Events - Crunchbase Company Profile & Funding" ], "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "Web3Events – Create & Receive NFT Tickets}" }, "query-input": "required name=search-term" } }, { "@context": "Schema.org - Schema.org", "@type": "Organization", "name": "Web3Events", "url" : "Web3Events – Create & Receive NFT Tickets", "logo": "https://web3events.ai/logo/logomd.png" "logo": { "@type": "ImageObject", "url": "https://web3events.ai/og-cover.png" } }]`,
        }}
      ></Script>
      <Script
        type="application/ld+json"
        data-rh="true"
        dangerouslySetInnerHTML={{
          __html: `{
              "@context": "http://schema.org",
              "@type": "WebSite",
              "name": "Web3Events",
              "url" : "https://web3events.ai",
              "sameAs": [
                "https://twitter.com/Web3Events_ai",
                "https://www.linkedin.com/company/web3events/",
                "https://github.com/web3events",
                "https://www.instagram.com/vveb3events/",
                "https://www.crunchbase.com/organization/web3events"
              ],
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://web3events.ai/#event?id={search_term}",
                "query-input": "required name=search_term"
              }
            }`,
        }}
      ></Script>
      <Provider store={store}>
        {/* <StyledEngineProvider injectFirst> */}
        <ChakraProvider theme={theme}>
          <ColorModeProvider>
            <WagmiConfig client={client}>
              <ApolloProvider client={apolloClient}>
                <LensProvider lensHubAddress="0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5">
                {/* <ConnectKitProvider> */}
                <RainbowKitProvider chains={chains}>
                  <Component {...pageProps} />
                </RainbowKitProvider>
                {/* </ConnectKitProvider> */}
                </LensProvider>
              </ApolloProvider>
            </WagmiConfig>
          </ColorModeProvider>
        </ChakraProvider>
        {/* </StyledEngineProvider> */}
      </Provider>
    </>
  );
}

export default MyApp;
