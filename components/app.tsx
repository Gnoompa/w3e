import { context, contextInitialValue } from "./context";
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Badge,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ConnectWallet from "./connectWallet";
import { getNativeCurrencyToUsdPrice } from "helpers/contract";
import { useAppDispatch, useAppSelector } from "helpers/hooks";
import { setNativeCurrencyToUsdPrice } from "features/app/appSlice";
import MenuBreakpointValue from "./menu";
import useMediaPlaceholderGenerator from "helpers/hooks/mediaPlaceholderGenerator";
import { initialState as appInitialState } from "features/app/appPersistedSlice";
import persistStore from "redux-persist/es/persistStore";
import { persistConfig, persistor } from "app/store";
import Footer from "./footer";

const App: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const appState = appInitialState;
  const appPersistedVersion = useAppSelector((state) => state.appPersisted.ver);
  const persistorStore = persistor;

  const { CanvasContainer: MediaPlaceholderGeneratorCanvasContainer } =
    useMediaPlaceholderGenerator();

  const {
    data: nativeCurrencyToUsdPrice,
    refetch: refetchNativeCurrencyToUsdPrice,
  } = getNativeCurrencyToUsdPrice();
  const refetchNativeCurrencyToUsdPriceInterval = 10000;

  useEffect(() => {
    setInterval(
      refetchNativeCurrencyToUsdPrice,
      refetchNativeCurrencyToUsdPriceInterval
    );

    appPersistedVersion != appState.ver && persistorStore.purge();
  }, []);

  useEffect(() => {
    nativeCurrencyToUsdPrice?.[0] &&
      dispatch(setNativeCurrencyToUsdPrice(nativeCurrencyToUsdPrice[0].answer));
  }, [nativeCurrencyToUsdPrice]);

  return (
    <Flex direction={"column"} align={"center"} minH={"calc(100vh)"}>
      <Container
        variant={"mainNav"}
        position={"fixed"}
        top={0}
        height={["4rem", "5rem"]}
      >
        <Flex
          align={"center"}
          justifyContent={"space-between"}
          margin={"0 auto"}
          w="100%"
          h="100%"
          maxW="1440px"
          px={"2rem"}
        >
          <Flex
            justify={"flex-start"}
            flexGrow={1}
            flexBasis={0}
            justifySelf={"flex-start"}
            display={["none", "none", "initial"]}
          >
            <Link href="/" float={"left"}>
              <Flex align={"center"} gap={".75rem"}>
                <Image src="/logo/logomd.png" w={"3rem"}></Image>
                <Heading as={"h1"} fontSize={"1.5rem"} lineHeight="1em">
                  Web3 <br></br> Events
                </Heading>
                <Badge variant={"solid"} ml="1rem">
                  alpha
                </Badge>
              </Flex>
            </Link>
          </Flex>
          <MenuBreakpointValue />
          <Flex flexGrow={1} flexBasis={0} justifyContent={"flex-end"}>
            <ConnectWallet />
          </Flex>
        </Flex>
      </Container>
      <Flex pt={"7.5rem"} minH={["inherit", "inherit", "inherit", "100vh"]}>
        <context.Provider value={contextInitialValue}>
          {props.children}
        </context.Provider>
      </Flex>
      <Footer />
      <MediaPlaceholderGeneratorCanvasContainer />
    </Flex>
  );
};

export default App;
