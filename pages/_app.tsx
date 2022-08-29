import normalizeCss from "../node_modules/normalize.css/normalize.css";
import resetCss from "../styles/reset.css";
import globalCss from "../styles/index.css";
import theme from "../styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
// import { StyledEngineProvider } from "@mui/material/styles";
import { store } from "../app/store";
import { Provider } from "react-redux";
import process from "process";
import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

function MyApp({ Component, pageProps }: AppProps) {
  const client = createClient(
    getDefaultClient({
      appName: "web3events",
      alchemyId: process.env.alchemyId,
      chains: [chain.polygonMumbai, chain.polygon],
    })
  );

  return (
    <>
      <Head>
        <title>web3events</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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
            <ConnectKitProvider>
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
