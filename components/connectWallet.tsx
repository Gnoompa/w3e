import Identicon from "react-identicons";
import { ConnectKitButton } from "connectkit";
import {
  Box,
  Button,
  Container,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { Routes } from "helpers/routes";
import { SettingsIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default () => (
  // <ConnectButton />
  <ConnectButton.Custom>
    {({ account, openConnectModal, openAccountModal }) => {
      return account ? (
        <Menu>
          <MenuButton>
            <Flex gap={"1rem"} align="center">
              <Text
                color="textContrastSecondary"
                fontSize={"sm"}
                fontWeight={"medium"}
              >
                {account?.displayName}
              </Text>
              <Box
                borderRadius={"lg"}
                overflow="hidden"
                border="2px solid"
                borderColor={"contrastPrimary"}
              >
                <Identicon string={account?.address} size="30"></Identicon>
              </Box>
            </Flex>
          </MenuButton>
          <MenuList p={".5rem"} bg={"bg"}>
            <MenuItem>
              <NextLink href={Routes.Dashboard} passHref>
                <Link color={"text"}>Dashboard</Link>
              </NextLink>
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={account ? openAccountModal : openConnectModal}>
              <Flex align={"center"} justify={"space-between"} flex={1}>
                <Text fontSize={"sm"} color="textContrastSecondary">
                  Connected wallet
                </Text>
                <SettingsIcon color="textContrastSecondary" />
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button
          variant={"walletConnect"}
          flex={1}
          maxW={"fit-content"}
          justifySelf={"flex-end"}
          onClick={account ? openAccountModal : openConnectModal}
        >
          Connect Wallet
        </Button>
      );
    }}
  </ConnectButton.Custom>
);
