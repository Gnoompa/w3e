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
import TwitterIcon from "../public/icons/twitter";
import TelegramIcon from "../public/icons/tg";
import LensterIcon from "../public/icons/lenster";
import ConnectWallet from "./connectWallet";
import { getNativeCurrencyToUsdPrice } from "helpers/contract";
import { useAppDispatch } from "helpers/hooks";
import { setNativeCurrencyToUsdPrice } from "features/app/appSlice";
import MenuBreakpointValue from "./menu";

const App: React.FC = (props) => {
  const dispatch = useAppDispatch();

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
  }, []);

  useEffect(() => {
    nativeCurrencyToUsdPrice &&
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
      <Container mt="2rem" bg="accentPrimary" p="3rem 5rem">
        <Flex
          flexDir={["column", "row"]}
          align="center"
          gap={"2rem"}
          justify={"space-between"}
        >
          <Heading fontSize={"xx-large"} color={"textContrast"}>
            Web3Events
          </Heading>
          <Flex gap={"1rem"}>
            <Link href={"https://twitter.com/Web3Eventsai"} target={"_blank"}>
              <IconButton
                variant={"icon"}
                aria-label={"twitter"}
                icon={<TwitterIcon />}
              />
            </Link>
            <Link
              href={"https://lenster.xyz/u/web3events.lens"}
              target={"_blank"}
            >
              <IconButton
                variant={"icon"}
                aria-label={"lenster"}
                icon={<LensterIcon width="1.5rem" />}
              />
            </Link>
            <Link href={"https://t.me/web3events_eng"} target={"_blank"}>
              <IconButton
                variant={"icon"}
                aria-label={"telegram"}
                icon={<TelegramIcon width="1.5rem" />}
              />
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

export default App;
