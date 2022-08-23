import type { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
  useModal,
} from "connectkit";
import dynamic from "next/dynamic";
import {
  Flex,
  Box,
  Button,
  Heading,
  useColorMode,
  useThemeUI,
  Card,
  Text,
  Link,
  Label,
  Spinner,
} from "theme-ui";
import { useRouter } from "next/router";
import Router from "./router";

const App: NextPage = () => {
  return (
    <>
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, ensName }) => {
          return (
            <Button onClick={show}>
              {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
            </Button>
          );
        }}
      </ConnectKitButton.Custom>
      <Router />
    </>
  );
};

export default App;
