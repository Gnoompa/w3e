import React, { useEffect, useRef, useState } from "react";
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
  Link,
  Text,
  useBreakpointValue,
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
  getEventTicketTierLeftSupply,
  getEventTicketTierLeftSupplyLabel,
} from "@components/helpers/events";
import { motion } from "framer-motion";

export const EmbedWidget = () => {
  const router = useRouter();
  const provider = useProvider();
  const toast = useToast();

  const SwipeIcon = useBreakpointValue({
    base: () => (
      <motion.img
        animate={{ rotate: [0, 15, 0, -15, 0] }}
        transition={{
          repeat: Infinity,
          type: "spring",
          duration: 1,
        }}
        style={{ width: "3rem", margin: "0 auto" }}
        src="/icons/swipe.svg"
      />
    ),
    md: () => <></>,
  });

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

  const {
    eventTicketTiers,
    eventTicketTiersMetadata,
    isLoadingEventTicketTiers,
    connectedWalletEventTicketBoughtEvents,
    buyEventTicket,
    isSuccessBuyEventTicketWrite,
    isErrorBuyEventTicketWrite,
    isErrorPrepareBuyEventTicketWrite,
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

  const [hasBoughtTicket, setHasBoughtTicket] = useState(false);

  const scrollableRef = useRef();

  useEffect(() => {
    setInterval(
      refetchNativeCurrencyToUsdPrice,
      refetchNativeCurrencyToUsdPriceInterval
    );

    setTimeout(() => {
      scrollableRef.current &&
        (scrollableRef.current.removeEventListener("wheel", scrollableHandler, {
          passive: false,
        }),
        scrollableRef.current.addEventListener("wheel", scrollableHandler, {
          passive: false,
        }));
    });
  }, []);

  const scrollableHandler = (e) => {
    scrollableRef.current.scrollLeft -= e.deltaY - e.deltaX;
    e.preventDefault();
  };

  useEffect(() => {
    isSuccessBuyEventTicketWrite && setHasBoughtTicket(true);
  }, [isSuccessBuyEventTicketWrite]);

  useEffect(() => {
    isWalletConnected &&
      eventTicketTierToBuy !== undefined &&
      onOpenCheckoutModal();
  }, [isWalletConnected]);

  useEffect(() => {
    isSuccessBuyEventTicketWrite && setHasBoughtTicket(true);

    (isErrorBuyEventTicketWrite || isErrorPrepareBuyEventTicketWrite) &&
      (setEventTicketTierToBuy(undefined),
      toast({
        title:
          "Couldn't buy a ticket: either insufficient funds or ticket recipient already has a ticket",
        status: "error",
        isClosable: true,
      }),
      console.error(buyEventTicketWriteError));
  }, [
    isSuccessBuyEventTicketWrite,
    isErrorBuyEventTicketWrite,
    isErrorPrepareBuyEventTicketWrite,
  ]);

  const onBuyEventTicketButtonClick = (ticketTierIndex: number) => {
    setEventTicketTierToBuy(ticketTierIndex);

    mbConnectWallet() || onOpenCheckoutModal();
  };

  const getEventTicketTierById = (ticketTierId: number | string) =>
    event.ticketTypes.filter(
      (ticketTier) => ticketTier.tier == ticketTierId
    )[0];

  const mbConnectWallet = () =>
    isWalletConnected ? false : (setOpenWalletConnectModal(true), true);

  return (
    <Flex bg="accentPrimary" py="2rem" flexDir={"column"} gap="2rem">
      <Global
        styles={css`
          body {
            background: var(--chakra-colors-accentPrimary) !important;
          }
        `}
      />
      <Container
        as={Flex}
        variant={"scrollableOverlap"}
        justifyContent={[
          "initial",
          "initial",
          event?.ticketTypes?.length <= 2 ? "center" : "initial",
        ]}
        gap={"1.5rem"}
        px={["1rem", "2rem"]}
        maxW={"100%"}
        ref={scrollableRef}
      >
        {event?.ticketTypes &&
          [...event.ticketTypes]
            .sort((a, b) =>
              a.metadata?.__ticketTierOrder > b.metadata?.__ticketTierOrder
                ? 1
                : -1
            )
            .map((ticketTier, ticketTierIndex) => (
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
                    ticketParams: ticketTier.params,
                  }),
                  benefits: ticketTier.metadata.__ticketTierBenefits,
                }}
                isAbleToBuy={
                  getEventTicketTierLeftSupply({
                    ticketParams: ticketTier.params,
                    ticketsSoldAmount: ticketTier.sold,
                    ticketSupply: ticketTier.supply,
                  }) > 0
                }
                nativeCurrencyToUsdPrice={nativeCurrencyToUsdPrice?.[0]?.answer}
                isBuyingTicket={isBuyingEventTicket}
                onBuyButtonClick={() =>
                  onBuyEventTicketButtonClick(+ticketTier.tier)
                }
              />
            ))}
      </Container>
      {event && (
        <Flex flexDir={"column"} gap="1rem">
          <SwipeIcon />
          <Flex justifyContent={"space-between"} px={["1rem", "2rem"]}>
            <Flex gap=".5rem" alignItems={"center"}>
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
              <Text color="bg" fontWeight={"semibold"}>
                {event &&
                  getEventParticipantsAmountLabel(
                    event!.ticketTypes.map((ticketType) => ({
                      ticketsSoldAmount: ticketType.sold,
                    }))
                  )}
              </Text>
            </Flex>
            <Link href={"https://web3events.ai"} target="_blank">
              <Flex align={"center"} gap=".75rem">
                <Image src="/logo/logomd.png" w={"2rem"}></Image>
                <Flex flexDir={"column"} lineHeight={"1rem"}>
                  <Text color={"bg"} fontWeight="bold">
                    Web3
                  </Text>
                  <Text color={"bg"} fontWeight="bold">
                    Events
                  </Text>
                </Flex>
              </Flex>
            </Link>
          </Flex>
        </Flex>
      )}

      {eventTicketTierToBuy !== undefined && (
        <CheckoutModal
          event={{
            id: routerQuery.eventId,
            name: event.name,
            location: event.locationName,
            startDate: event.startDate,
            endDate: event.endDate,
            image: getIPFSUri(event.image),
          }}
          ticketTier={{
            name: getEventTicketTierById(eventTicketTierToBuy).name,
            price: getEventTicketTierById(eventTicketTierToBuy).price,
          }}
          isOpen={isCheckoutModalOpen}
          onClose={() => (
            setHasBoughtTicket(false),
            setEventTicketTierToBuy(undefined),
            onCloseCheckoutModal()
          )}
          isCompletingPurchase={isBuyingEventTicket}
          isPurchaseCompleted={!!hasBoughtTicket}
          hasTicket={!!connectedWalletEventTicketBoughtEvents?.[0]?.length}
          onCompletePurchaseButtonClick={(_for) =>
            buyEventTicket(eventTicketTierToBuy!, _for)
          }
        />
      )}
    </Flex>
  );
};

export default EmbedWidget;
