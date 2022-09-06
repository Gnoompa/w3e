import { context, contextInitialValue } from "./context";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpoint,
  Portal,
  useBreakpointValue,
  forwardRef,
  Badge,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Routes } from "helpers/routes";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import TwitterIcon from "../public/icons/twitter";
import LensterIcon from "../public/icons/lenster";
import TelegramIcon from "../public/icons/tg";
import ConnectWallet from "./connectWallet";

const App: React.FC = (props) => {
  const MenuBreakpointValue = () =>
    useBreakpointValue(
      {
        base: (
          <Menu>
            <MenuButton
              as={IconButton}
              bg={"transparent"}
              aria-label="Menu"
              fontSize={"3xl"}
              icon={<HamburgerIcon />}
            />
            <MenuList>
              <MenuItem>
                <NextLink href={Routes.EventForm} passHref>
                  <Link>Events</Link>
                </NextLink>
              </MenuItem>
              <MenuItem>
                <Flex align={"center"} gap=".5rem">
                  <Link>Subscriptions</Link>
                  <Badge variant={"solid"} color={"warn"} bg={"accentPrimary"}>
                    soon
                  </Badge>
                </Flex>
              </MenuItem>
              <MenuItem>
                <Flex align={"center"} gap=".5rem">
                  <Link>Explore events</Link>
                  <Badge variant={"solid"} color={"warn"} bg={"accentPrimary"}>
                    soon
                  </Badge>
                </Flex>
              </MenuItem>
              <MenuItem>
                <NextLink href={Routes.FAQ} passHref>
                  <Link>FAQ</Link>
                </NextLink>
              </MenuItem>
            </MenuList>
          </Menu>
        ),
        lg: (
          <Flex gap={9}>
            <Menu>
              <MenuButton>
                <Flex align={"center"} gap={".5rem"} fontWeight="medium">
                  Products
                  <ChevronDownIcon />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <NextLink href={Routes.EventForm} passHref>
                    <Link>Events</Link>
                  </NextLink>
                </MenuItem>
                <MenuItem>
                  <Flex align={"center"} gap=".5rem">
                    <Link>Subscriptions</Link>
                    <Badge
                      variant={"solid"}
                      color={"warn"}
                      bg={"accentPrimary"}
                    >
                      soon
                    </Badge>
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
            <Flex align={"center"} gap=".5rem">
              <Link>Explore events</Link>
              <Badge variant={"solid"} color={"warn"} bg={"accentPrimary"}>
                soon
              </Badge>
            </Flex>
            <Link href={Routes.FAQ}>
              <NextLink href={Routes.FAQ} passHref>
                <Link>FAQ</Link>
              </NextLink>
            </Link>
          </Flex>
        ),
      },
      { ssr: false }
    );

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
              <Flex align={"center"} gap={".5rem"}>
                <Heading as={"h1"}>Web3Events</Heading>
                <Badge variant={"solid"} color={"contrastPrimary"} bg={"bg"}>
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
      <Container mt="2rem" bg="accentPrimary" h={"10rem"} p="3rem 5rem">
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
