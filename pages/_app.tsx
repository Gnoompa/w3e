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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-470YTNYWWK"
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());

          gtag('config', 'G-470YTNYWWK');`,
          }}
        ></Script>
        <style>{`
          ${resetCss}
          ${normalizeCss}
          ${globalCss}
      `}</style>
      </Head>
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
