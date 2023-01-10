import { context, contextInitialValue } from "./context";
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Badge,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  useTheme,
  useColorMode,
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
import FrillEmbeddedWidget from "./ui/frillEmbedWidget";
import {
  ChatIcon,
  QuestionIcon,
  QuestionOutlineIcon,
  StarIcon,
} from "@chakra-ui/icons";
import { mode } from "@chakra-ui/theme-tools";

const App: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const appState = appInitialState;
  const appPersistedVersion = useAppSelector((state) => state.appPersisted.ver);
  const persistorStore = persistor;
  const {
    isOpen: isOpenFrillWidgetModal,
    onOpen: onOpenFrillWidgetModal,
    onClose: onCloseFrillWidgetModal,
  } = useDisclosure();

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

    appPersistedVersion != appState.ver &&
      (persistorStore.purge(),
      localStorage.removeItem("lensAccessToken"),
      localStorage.removeItem("lensRefreshToken"),
      localStorage.removeItem("cyberConnectAccessToken"));
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
                <Image src="/logo/nylogo.png" w={"3rem"}></Image>
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
          <Flex
            flexGrow={1}
            flexBasis={0}
            justifyContent={"flex-end"}
            align={"center"}
            gap={"1rem"}
          >
            <Menu>
              <MenuButton>
                <IconButton
                  aria-label="news and feature request"
                  variant={"unstyled"}
                  icon={<QuestionIcon />}
                ></IconButton>
              </MenuButton>
              <MenuList bg={"bg"}>
                <MenuItem onClick={onOpenFrillWidgetModal}>
                  <Flex align={"center"} gap=".5rem">
                    <StarIcon color="warn" />
                    <Text fontSize={"md"} fontWeight="medium">
                      What's New?
                    </Text>
                  </Flex>
                </MenuItem>
                <MenuItem>
                  <Link
                    href="https://roadmap.web3events.ai/b/j0x38r0q/feature-ideas"
                    target={"_blank"}
                  >
                    <Flex align={"center"} gap=".5rem">
                      <ChatIcon color={"text"} />
                      <Text fontSize={"md"} color={"text"} fontWeight="medium">
                        Request Features
                      </Text>
                    </Flex>
                  </Link>
                </MenuItem>
              </MenuList>
            </Menu>
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
      <Modal isOpen={isOpenFrillWidgetModal} onClose={onCloseFrillWidgetModal}>
        <ModalOverlay />
        <ModalContent h="35rem" maxH={"calc(100vh - 7rem)"} overflow={"hidden"}>
          <FrillEmbeddedWidget />
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default App;
