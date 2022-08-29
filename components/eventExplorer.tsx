import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useContext,
  ReactElement,
} from "react";
import {
  Flex,
} from "@chakra-ui/react"
import { NavigateBack } from "@components/indexx";
import { useRouterQuery } from "helpers/hooks";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import { Portal } from "react-portal";
import { useRouter } from "next/router";
import { formatWalletAddress } from "helpers/hooks";
import { BigNumber, ethers } from "ethers";

const EventExplorer: React.FC = () => {
  enum Stage {
    LoadingEvent,
    EventLoaded,
    VerifyingParticipants,
  }

  const router = useRouter();
  const context = useContext(AppContext);
  const { web3APIProvider } = useContext(AppContext);
  const routerQuery = useRouterQuery(router);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // fetchEvents()
  }, []);

  const fetchEvents = async (eventTokenId: number) => {};

  return (
    <Flex
      sx={{
        flexDirection: "column",
        width: "22rem",
        margin: "31rem auto",
        transform: "translateY(-50%)",
      }}
    >
      explorer
    </Flex>
  );
};

export default EventExplorer;
