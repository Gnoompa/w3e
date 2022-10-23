import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount, useProvider } from "wagmi";
import { useModal } from "connectkit";
import {
  defaultChainId,
  getNativeCurrencyToUsdPrice,
  useMainContractEvents,
} from "helpers/contract";
import { BigNumber, ethers } from "ethers";
import {
  Container,
  Flex,
  Image,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import EventTicket from "../components/ui/eventTicketCard";
import { getIPFSUri, useRouterQuery } from "helpers/hooks";
import useTicketManager from "helpers/ticketManager";
import CheckoutModal from "../components/checkoutModal";
import { useGetEventQuery, useGetEventsQuery } from "helpers/eventsApi";
import { css, Global } from "@emotion/react";
import {
  getEventParticipantsAmountLabel,
  getEventTicketTierLeftSupplyLabel,
} from "@components/helpers/events";

export const EmbedWidget = () => {
  const router = useRouter();
  const provider = useProvider();
  const toast = useToast();

  const routerQuery = useRouterQuery(router);
  const {
    address: connectedWalletAddress,
    isConnected: isWalletConnected,
    isConnecting: isWalletConnecting,
  } = useAccount();
  const { setOpen: setOpenWalletConnectModal } = useModal();

  const {
    data: event,
    isLoading: isLoadingEvent,
    isSuccess: isSuccessLoadingEvent,
    isFetching: isFetchingEvent,
    refetch: refetchEvent,
  } = useGetEventQuery(routerQuery.eventId);

  console.log(router)

  const {
    eventTicketTiers,
    eventTicketTiersMetadata,
    isLoadingEventTicketTiers,
    connectedWalletEventTicketBoughtEvents,
    buyEventTicket,
    isSuccessBuyEventTicketWrite,
    isErrorBuyEventTicketWrite,
    buyEventTicketWriteError,
    isBuyingEventTicket,
  } = useTicketManager({ eventTokenId: routerQuery.eventId });
  const [eventTicketTierToBuy, setEventTicketTierToBuy] = useState<number>();
  const {
    isOpen: isCheckoutModalOpen,
    onOpen: onOpenCheckoutModal,
    onClose: onCloseCheckoutModal,
  } = useDisclosure();
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
    isWalletConnected &&
      eventTicketTierToBuy !== undefined &&
      onOpenCheckoutModal();
  }, [isWalletConnected]);

  useEffect(() => {
    isSuccessBuyEventTicketWrite &&
      (setEventTicketTierToBuy(undefined),
      onCloseCheckoutModal(),
      toast({
        title: "A ticket has been bought",
        status: "success",
        isClosable: true,
      })),
      isErrorBuyEventTicketWrite &&
        (setEventTicketTierToBuy(undefined),
        toast({
          title: "Couldn't buy a ticket",
          status: "error",
          isClosable: true,
        }),
        console.error(buyEventTicketWriteError));
  }, [isSuccessBuyEventTicketWrite]);

  const onBuyEventTicketButtonClick = (ticketTierIndex: number) => {
    setEventTicketTierToBuy(ticketTierIndex);

    mbConnectWallet() || onOpenCheckoutModal();
  };

  const mbConnectWallet = () =>
    isWalletConnected ? false : (setOpenWalletConnectModal(true), true);

  return (
    <Flex bg="accentPrimary" py="2rem" flexDir={"column"} gap="1rem">
      <Global
        styles={css`
          body {
            background: var(--chakra-colors-accentPrimary) !important;
          }
        `}
      />
      <Flex
        gap=".5rem"
        alignItems={"center"}
        alignSelf={"flex-end"}
        px={"2rem"}
      >
        <Flex>
          <Image
            src="/graphics/graphics1.png"
            w="2rem"
            h="2rem"
            borderRadius={"18px"}
            border="3px solid var(--chakra-colors-accentPrimaryContrast)"
          />
          <Image
            src="/graphics/graphics3.png"
            w="2rem"
            h="2rem"
            ml="-1rem"
            borderRadius={"18px"}
            border="3px solid var(--chakra-colors-accentPrimaryContrast)"
          />
          <Image
            src="/graphics/graphics4.png"
            w="2rem"
            h="2rem"
            ml="-1rem"
            borderRadius={"18px"}
            border="3px solid var(--chakra-colors-accentPrimaryContrast)"
          />
        </Flex>
        <Text color="bg" fontWeight={"medium"}>
          {event &&
            getEventParticipantsAmountLabel(
              event!.ticketTypes.map((ticketType) => ({
                ticketsSoldAmount: ticketType.sold,
              }))
            )}
        </Text>
      </Flex>
      <Container
        as={Flex}
        variant={"scrollableOverlap"}
        gap={"1.5rem"}
        style={{
          maxWidth: "100%",
          paddingRight: "2rem",
          paddingLeft: "2rem",
        }}
      >
        {event?.ticketTypes.map((ticketTier, ticketTierIndex) => (
          <EventTicket
            ticketData={{
              title: ticketTier.name,
              desc: ticketTier.description,
              image: getIPFSUri(ticketTier.image),
              imagePlaceholder: ticketTier.imagePlaceholder,
              price: ticketTier.price,
              isFree: !+ticketTier.price,
              supplyLabel: getEventTicketTierLeftSupplyLabel({
                ticketSupply: ticketTier.supply,
                ticketsSoldAmount: ticketTier.sold,
              }),
            }}
            isAbleToBuy={!!+ticketTier.sold}
            nativeCurrencyToUsdPrice={nativeCurrencyToUsdPrice?.[0]?.answer}
            isBuyingTicket={isBuyingEventTicket}
            onBuyButtonClick={() =>
              onBuyEventTicketButtonClick(ticketTierIndex)
            }
          />
        ))}
      </Container>
      {eventTicketTierToBuy !== undefined && (
        <CheckoutModal
          event={{
            name: event.name,
            location: event.locationName,
            startDate: event.startDate,
            endDate: event.endDate,
            image: getIPFSUri(event.image),
          }}
          ticketTier={{
            name: event.ticketTypes[eventTicketTierToBuy].name,
            price: ethers.utils.formatEther(
              event.ticketTypes[eventTicketTierToBuy].price
            ),
          }}
          isOpen={isCheckoutModalOpen}
          onClose={onCloseCheckoutModal}
          isCompletingPurchase={isBuyingEventTicket}
          onCompletePurchaseButtonClick={() =>
            buyEventTicket(eventTicketTierToBuy!)
          }
        />
      )}
    </Flex>
  );
};

export default EmbedWidget;
