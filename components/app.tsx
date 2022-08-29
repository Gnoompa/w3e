import { context, contextInitialValue } from "./context";
import { ConnectKitButton } from "connectkit";
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
  useBreakpoint,
  useBreakpointValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Routes } from "helpers/routes";
import { HamburgerIcon } from "@chakra-ui/icons";

const App: React.FC = (props) => {
  const ResponsiveMenu = () =>
    useBreakpointValue({
      sm: (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Menu"
            fontSize={"3xl"}
            icon={<HamburgerIcon />}
          />
          <MenuList>
            <MenuItem>
              <NextLink href={Routes.EventForm} passHref>
                <Link>Create event</Link>
              </NextLink>
            </MenuItem>
            <MenuItem>
              <NextLink href={Routes.EventExplorer} passHref>
                <Link>Explore events</Link>
              </NextLink>
            </MenuItem>
            <MenuItem>
              <NextLink href={Routes.FAQ} passHref>
                <Link>FAQ</Link>
              </NextLink>
            </MenuItem>
          </MenuList>
        </Menu>
      ),
      md: (
        <Flex gap={10}>
          <NextLink href={Routes.EventForm} passHref>
            <Link>Create event</Link>
          </NextLink>
          <Link href={Routes.EventExplorer}>Explore events</Link>
          <Link href={Routes.FAQ}>FAQ</Link>
        </Flex>
      ),
    });

  return (
    <Flex direction={"column"} align={"center"} pb={"2rem"}>
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
              <Heading>Web3Events</Heading>
            </Link>
          </Flex>
          <ResponsiveMenu />
          <Flex flexGrow={1} flexBasis={0} justifyContent={"flex-end"}>
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress, ensName }) => {
                return (
                  <Button
                    variant={"walletConnect"}
                    flex={1}
                    justifySelf={"flex-end"}
                    onClick={show}
                  >
                    {isConnected
                      ? ensName ?? truncatedAddress
                      : "Connect Wallet"}
                  </Button>
                );
              }}
            </ConnectKitButton.Custom>
          </Flex>
        </Flex>
      </Container>
      <Flex pt={"7.5rem"}>
        <context.Provider value={contextInitialValue}>
          {props.children}
        </context.Provider>
      </Flex>
    </Flex>
  );
};

export default App;
