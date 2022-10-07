import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useContext,
  ReactElement,
} from "react";
import { Flex, Heading, Spinner } from "@chakra-ui/react";
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
import { useGetEventExplorerEventsQuery } from "../helpers/eventsApi";
import {
  getEventTicketNativeCurrencyPriceLabel,
  getEventTicketPriceRangeLabel,
} from "./helpers/events";

const EventExplorer: React.FC = () => {
  const router = useRouter();

  const {
    data: explorerEvents,
    isLoading: isLoadingExplorerEvents,
    isSuccess: isSuccessExplorerEvents,
  } = useGetEventExplorerEventsQuery();

  const getEventTicketData = (
    eventData: object
  ): EventTicketComponentPropsType["ticketData"] => ({
    title: eventData.name,
    image: getIPFSUri(eventData.image),
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
      <Heading
        fontWeight={"extrabold"}
        fontSize={["2rem", "2rem", "3rem"]}
        color={["textContrast", "text"]}
      >
        Event Explorer
      </Heading>
      <Flex mt="2rem" gap={"1.5rem"} flexWrap={"wrap"}>
        {isLoadingExplorerEvents && (
          <Spinner w={"10"} h="10" margin={"5rem auto"} />
        )}
        {isSuccessExplorerEvents &&
          explorerEvents?.map((event) => (
            <EventTicket
              eventDatesLabel={getEventDatesLabel(event)}
              eventLocationLabel={event.locationName}
              ticketData={getEventTicketData(event)}
              onBuyButtonClick={() => goToEventPage(event.externalId)}
            />
          ))}
      </Flex>
    </Flex>
  );
};

export default EventExplorer;
