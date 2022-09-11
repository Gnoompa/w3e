import normalizeCss from "../node_modules/normalize.css/normalize.css";
import resetCss from "../styles/reset.css";
import globalCss from "../styles/index.css";
import theme from "../styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
// import { StyledEngineProvider } from "@mui/material/styles";
import { store } from "../app/store";
import { Provider } from "react-redux";
import process from "process";
import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { defaultChainId } from "helpers/contract";

function MyApp({ Component, pageProps }: AppProps) {
  const client = createClient(
    getDefaultClient({
      appName: "web3events",
      alchemyId: process.env.alchemyId,
      chains:
        defaultChainId == chain.polygon.id
          ? [chain.polygon, chain.polygonMumbai]
          : [chain.polygonMumbai, chain.polygon],
    })
  );

  return (
    <>
      <Head>
        <title>web3events</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" sizes="57x57" href="/mobile/apple-icon-57x57.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="/mobile/apple-icon-60x60.png"/>
        <link rel="apple-touch-icon" sizes="72x72" href="/mobile/apple-icon-72x72.png"/>
        <link rel="apple-touch-icon" sizes="76x76" href="/mobile/apple-icon-76x76.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/mobile/apple-icon-114x114.png"/>
        <link rel="apple-touch-icon" sizes="120x120" href="/mobile/apple-icon-120x120.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/mobile/apple-icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="152x152" href="/mobile/apple-icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/mobile/apple-icon-180x180.png"/>
        <link rel="icon" type="image/png" sizes="192x192"  href="/mobile/android-icon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/mobile/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="96x96" href="/mobile/favicon-96x96.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/mobile/favicon-16x16.png"/>
        <link rel="manifest" href="/mobile/manifest.json"/>
        <meta name="msapplication-TileColor" content="#ffffff"/>
        <meta name="msapplication-TileImage" content="/mobile/ms-icon-144x144.png"/>
        <meta name="theme-color" content="#ffffff"></meta>

        <script async src="https://www.googletagmanager.com/gtag/js?id=G-470YTNYWWK"/>
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
      <Provider store={store}>
        {/* <StyledEngineProvider injectFirst> */}
        <ChakraProvider theme={theme}>
          <WagmiConfig client={client}>
            <ConnectKitProvider
              options={{ walletConnectName: "Zerion & Wallet Connect" }}
            >
              <Component {...pageProps} />
            </ConnectKitProvider>
          </WagmiConfig>
        </ChakraProvider>
        {/* </StyledEngineProvider> */}
      </Provider>
    </>
  );
}

export default MyApp;
