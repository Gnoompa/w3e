import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useContext,
  ReactElement,
} from "react";
import {
  Box,
  Flex,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { defaultDateFormat, getIPFSUri, useRouterQuery } from "helpers/hooks";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import { Portal } from "react-portal";
import { useRouter } from "next/router";
import { formatWalletAddress } from "helpers/hooks";
import date from "date-and-time";
import { BigNumber, ethers } from "ethers";
import EventTicket, {
  PropsType as EventTicketComponentPropsType,
} from "./ui/eventTicketCard";
import {
  useGetEventExplorerEventsQuery,
  useLazyGetEventExplorerEventsQuery,
} from "../helpers/eventsApi";
import {
  getEventTicketNativeCurrencyPriceLabel,
  getEventTicketPriceRangeLabel,
} from "./helpers/events";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { fadeTopSlideAnimation } from "styles/theme";

const EventExplorer: React.FC = () => {
  const router = useRouter();

  const [mainTabIndex, setMainTabIndex] = useState<number>(0);

  const {
    data: explorerEvents,
    isLoading: isLoadingExplorerEvents,
    isSuccess: isSuccessExplorerEvents,
    isFetching: isFetchingExplorerEvents,
    refetch: refetchExplorerEvents,
  } = useGetEventExplorerEventsQuery(mainTabIndex ? "" : "verified");

  useEffect(() => {
    refetchExplorerEvents();
  }, [mainTabIndex]);

  const getEventTicketData = (
    eventData: object
  ): EventTicketComponentPropsType["ticketData"] => ({
    title: eventData.name,
    image: getIPFSUri(eventData.image),
    imagePlaceholder: eventData.imagePlaceholder,
    desc: eventData.shortDescription,
    priceLabel: getEventTicketPriceRangeLabel(
      eventData.ticketTypes.map((ticketTier) => ({
        price: +ethers.utils.formatEther(ticketTier.price),
        isFree: !+ticketTier.price,
      }))
    ),
    nativeCurrencyPriceLabel: getEventTicketNativeCurrencyPriceLabel(
      eventData.ticketTypes.map((ticketTier) => ({
        price: +ethers.utils.formatEther(ticketTier.price),
        isFree: !+ticketTier.price,
      }))
    ),
  });

  const getEventDatesLabel = (event: {}) =>
    [event.startDate, event.endDate]
      .filter(Boolean)
      .map((eventDate) => date.format(new Date(eventDate), defaultDateFormat))
      .join(" - ");

  const goToEventPage = (eventTokenId: string) =>
    router.push(`/#event?id=${eventTokenId}`);

  return (
    <Flex
      w={["355px", "355px", "730px", "1105px"]}
      maxW={"calc(100vw - 2rem)"}
      sx={{
        flexDirection: "column",
        margin: "2rem auto",
      }}
    >
      <Flex justifyContent={"space-between"}>
        <Heading
          fontWeight={"extrabold"}
          fontSize={["2rem", "2rem", "3rem"]}
          color={["textContrast", "text"]}
        >
          Event Explorer
        </Heading>
        <Tabs onChange={setMainTabIndex} variant="switch" zIndex={1}>
          <TabList pos={"relative"}>
            <Tab w={"50%"} gap="1rem">
              <Flex>Verified</Flex>
              <CheckCircleIcon color="success" zIndex={"auto"} />
            </Tab>
            <Tab w={"50%"}>All</Tab>
            <Box
              as={motion.div}
              className="switchTabIndicator"
              ml={mainTabIndex ? "-.25rem" : ".25rem"}
              width="calc(50%)"
              animate={{ left: `${(mainTabIndex / 2) * 100}%` }}
            ></Box>
          </TabList>
        </Tabs>
      </Flex>
      <Flex mt="2rem" gap={"1.5rem"} flexWrap={"wrap"}>
        {isFetchingExplorerEvents && (
          <Spinner w={"10"} h="10" margin={"5rem auto"} />
        )}
        {!isFetchingExplorerEvents &&
          isSuccessExplorerEvents &&
          (explorerEvents.length ? (
            [...explorerEvents]
              ?.sort((a, b) => (+a.id > +b.id ? 1 : -1))
              .map((event, index) => (
                <EventTicket
                  eventDatesLabel={getEventDatesLabel(event)}
                  eventLocationLabel={event.locationName}
                  ticketData={getEventTicketData(event)}
                  onBuyButtonClick={() => goToEventPage(event.externalId)}
                />
              ))
          ) : (
            <Text fontSize={"xl"} margin="5rem auto">
              There are no events yet to explore 🤔
            </Text>
          ))}
      </Flex>
    </Flex>
  );
};

export default EventExplorer;
