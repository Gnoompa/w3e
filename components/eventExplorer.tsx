import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useContext,
  ReactElement,
} from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { useRouterQuery } from "helpers/hooks";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import { Portal } from "react-portal";
import { useRouter } from "next/router";
import { formatWalletAddress } from "helpers/hooks";
import { BigNumber, ethers } from "ethers";
import EventTicket from "./eventTicket";

const EventExplorer: React.FC = () => {
  enum Stage {
    LoadingEvent,
    EventLoaded,
    VerifyingParticipants,
  }

  const router = useRouter();
  const routerQuery = useRouterQuery(router);
  const [events, setEvents] = useState([1, 2, 3, 4]);

  useEffect(() => {
    // fetchEvents()
  }, []);

  const fetchEvents = async (eventTokenId: number) => {};

  return (
    <Flex
      w={["355px", "355px", "730px", "1105px"]}
      maxW={"calc(100vw - 2rem)"}
      sx={{
        flexDirection: "column",
        margin: "2rem auto",
      }}
    >
      <Heading fontWeight={"extrabold"} fontSize={["2rem", "2rem", "3rem"]} color={["textContrast", "text"]}>
        Event Explorer
      </Heading>
      <Flex mt="2rem" gap={"1.5rem"} flexWrap={"wrap"}>
        {events.map((event) => (
          <EventTicket
            ticketData={{
              image:
                "https://bafybeifqylhbj3ixirvr5yy2agrtyffpapz4axtsmitvbui6ccqmer3vuy.ipfs.nftstorage.link/Group%2073.png",
            }}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default EventExplorer;
