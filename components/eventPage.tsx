import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useContext,
  ReactElement,
  RefObject,
} from "react";
import { Global, css } from "@emotion/react";
import pluralize from "pluralize";
import QRCode from "qrcode.react";
import { google as googleCalendarLink } from "calendar-link";
import {
  Flex,
  Box,
  Image,
  Button,
  Text,
  Container,
  Spinner,
  useTheme,
  Heading,
  IconButton,
  useClipboard,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Highlight,
  Icon,
  AlertIcon,
  Link,
  useBreakpointValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";
import {
  getIPFSUri,
  getMetadataAttribute,
  SocialMediaIds,
  useAppSelector,
  useRouterQuery,
} from "helpers/hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { BigNumber, BigNumberish, ethers } from "ethers";
import MainContractABI from "../abi/MainV2.sol/MainV2.json";
import {
  chain,
  useAccount,
  useContractRead,
  useContractReads,
  useProvider,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";
import {
  buyEventTicket,
  spendEventTickets,
  prepareSpendEventTicket,
  defaultChainId,
  getBalanceOfToken,
  getEventManagers,
  getEvents,
  getEventTickets,
  getEventTicketTiers,
  getNativeCurrencyToUsdPrice,
  getOwnerOfToken,
  getTokenMetadataUris,
  prepareBuyEventTicket,
  useMainContractEvents,
  useTokenMetadataFetch,
} from "helpers/contract";
import {
  ArrowForwardIcon,
  CalendarIcon,
  CheckIcon,
  ExternalLinkIcon,
  LinkIcon,
  SettingsIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { fadeRightSlideAnimation, fadeTopSlideAnimation } from "styles/theme";
import TwitterIcon from "../public/icons/twitter";
import FacebookIcon from "../public/icons/facebook";
import InstagramIcon from "../public/icons/insta";
import TelegramIcon from "../public/icons/tg";
import SiteIcon from "../public/icons/site";
import { useModal } from "connectkit";
import EventTicket from "./ui/eventTicketCard";
import {
  getEventParticipantsAmountLabel,
  getEventTicketPriceRangeLabel,
  getEventTicketTierLeftSupply,
  getEventTicketTierLeftSupplyLabel,
  getEventTicketTotalSupplyLabel,
} from "./helpers/events";
import EventManagerModal from "./eventManagerModal";
import CheckoutModal from "./checkoutModal";

const QrScanner = dynamic(() => import("./ui/qrScanner"), {
  ssr: false,
});

const EventPage = () => {
  enum Stage {
    LoadingEvent,
    EventLoaded,
    VerifyingParticipants,
  }

  const ERROR_TOAST_ID = "error_toast";
  const provider = useProvider();
  const router = useRouter();
  const routerQuery = useRouterQuery(router);
  const toast = useToast();
  const { setOpen: setOpenWalletConnectModal } = useModal();
  const [copiedValue, setCopiedValue] = useState<string>("");
  const { hasCopied, onCopy } = useClipboard(copiedValue);
  const {
    address: connectedWalletAddress,
    isConnected: isWalletConnected,
    isConnecting: isWalletConnecting,
  } = useAccount();
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.LoadingEvent);
  const [eventTokenId, setEventTokenId] = useState<string>();
  const [event, setEvent] = useState<Partial<OnchainEvent>>();
  const [scannedTickets, setScannedTickets] = useState<
    Array<{ ticketTokenId: string; ownerAddress: string }>
  >([]);
  const [isBuyingATicket, setIsBuyingATicket] = useState<number>();
  const [isVerifyingATicket, setIsVerifyingATicket] = useState(false);
  const [scannedTicketTicketTier, setScannedTicketTicketTier] =
    useState<number>();
  const [eventTicketStartingPrice, setEventTicketStartingPrice] =
    useState<BigNumberish>();
  const [eventTicketsTotalSupply, setEventTicketsTotalSupply] = useState<
    number | string
  >();
  const [eventTicketsMintedAmount, setEventTicketsMintedAmount] =
    useState<number>();
  const [eventTicketPriceLabel, setEventTicketPriceLabel] = useState<string>();
  const [
    eventTicketNativeCurrencyPriceLabel,
    setEventTicketNativeCurrencyPriceLabel,
  ] = useState<string>();
  const {
    isOpen: isTicketPreviewModalOpen,
    onOpen: onTicketPreviewModalOpen,
    onClose: onTicketPreviewModalClose,
  } = useDisclosure();
  const {
    isOpen: isEventPosterModalOpen,
    onOpen: onOpenEventPosterModalOpen,
    onClose: onCloseEventPosterModal,
  } = useDisclosure();
  const {
    isOpen: isEventTicketsModalOpen,
    onOpen: onOpenEventTicketsModalOpen,
    onClose: onCloseEventTicketsModalOpen,
  } = useDisclosure();
  const {
    isOpen: isEventManagerModalOpen,
    onOpen: onOpenEventManagerModal,
    onClose: onCloseEventManagerModal,
  } = useDisclosure();
  const {
    isOpen: isCheckoutModalOpen,
    onOpen: onOpenCheckoutModal,
    onClose: onCloseCheckoutModal,
  } = useDisclosure();
  const {
    isOpen: isTicketVerificationModalOpen,
    onOpen: onTicketVerificationModalOpen,
    onClose: onTicketVerificationModalClose,
  } = useDisclosure();
  const {
    isOpen: isSimpleAlertOpen,
    onOpen: onSimpleAlertOpen,
    onClose: onSimpleAlertClose,
  } = useDisclosure();

  const simpleAlertLeastDestructiveRef =
    useRef() as RefObject<HTMLButtonElement>;
  const [simpleAlertData, setSimpleAlertData] = useState<{
    title: string | JSX.Element;
    description: string | JSX.Element;
  }>();

  const [ticketPreviewQrData, setTicketPreviewQrData] = useState<string>();
  const ticketSigningMessage =
    "Prove that you own the ticket by signing. IT IS FREE.";
  const {
    data: ticketMessageSigningData,
    isError: isTicketMessageSigningError,
    isLoading: isLoadingTicketMessage,
    isSuccess: isTicketMessageSigningSuccess,
    signMessage: signTicketMessage,
    error: ticketMessageSigningError,
  } = useSignMessage({
    message: ticketSigningMessage,
  });

  const [ticketDataToBeSigned, setTicketDataToBeSigned] = useState<{
    tokenId: BigNumberish;
    tier: BigNumberish;
  }>();
  const [isTicketVerificationSuccessful, setIsTicketVerificationSuccessful] =
    useState<boolean>();
  const eventId = routerQuery.id;
  const { data: eventMetadataUri } = getTokenMetadataUris([
    {
      args: [[eventId]],
    },
  ]);
  const { data: eventMetadatas } = useTokenMetadataFetch({
    dids: eventMetadataUri?.[0],
  }) as { data: EventMetadata[] | undefined };
  const [eventMetadata, setEventMetadata] = useState<EventMetadata>();
  const [isEventPosterLoaded, setIsEventPosterLoaded] = useState(false);
  const { data: events } = getEvents([{ args: [[eventId]] }]);
  const { data: eventManagers } = getEventManagers([{ args: [eventId] }]);
  const [eventTicketsToRefetch, setEventTicketsToRefetch] =
    useState<{ ticketTokenId: BigNumberish }[]>();
  const { data: eventTickets, refetch: refetchEventTickets } = getEventTickets([
    {
      enabled: false,
      args: [eventTicketsToRefetch?.map(({ ticketTokenId }) => ticketTokenId)],
    },
  ]);
  const { data: eventTicketTiers, refetch: refetchEventTicketTiers } =
    getEventTicketTiers([{ args: eventId }]);

  const eventTicketTiersRef = useRef([]);
  const [verifyingTicket, setVerifyingTicket] = useState<{
    tokenId: BigNumberish;
    tier: BigNumberish;
  }>();
  const [verifiedTicketWalletAddress, setVerifiedTicketWalletAddress] =
    useState<string>();
  const {
    data: balanceOfVerifyingTicketData,
    refetch: refetchBalanceOfVerifyingTicket,
  } = getBalanceOfToken([
    {
      args: [verifiedTicketWalletAddress, verifyingTicket?.tokenId],
      enabled: false,
    },
  ]);
  const [
    buyEventTicketWriteConfigToPrepare,
    setBuyEventTicketWriteConfigToPrepare,
  ] = useState<{
    args: Parameters<typeof prepareBuyEventTicket>[0]["args"];
    overrides: Parameters<typeof prepareBuyEventTicket>[0]["overrides"];
  }>();
  // // todo handle write request errors
  const {
    config: preparedBuyEventTicketWriteConfig,
    refetch: refetchPreparedBuyEventTicketWriteConfig,
    isLoading: isLoadingPreparedBuyEventTicketWriteConfig,
    error: preparedBuyEventTicketWriteConfigError,
  } = prepareBuyEventTicket({
    ...buyEventTicketWriteConfigToPrepare,
    enabled: false,
  });
  // // todo handle transaction signing rejection
  const { data: buyEventTicketWriteResponse, write: buyEventTicketWrite } =
    buyEventTicket(preparedBuyEventTicketWriteConfig);
  const {
    isLoading: isLoadingBuyEventTicketWrite,
    data: buyEventTicketWriteData,
    isSuccess: isSuccessBuyEventTicketWrite,
    isError: isErrorBuyEventTicketWrite,
    error: buyEventTicketWriteError,
  } = useWaitForTransaction({
    hash: buyEventTicketWriteResponse?.hash,
    wait: buyEventTicketWriteResponse?.wait,
  });

  // SPEND EVENT TICKETS

  const [
    spendEventTicketWriteConfigToPrepare,
    setSpendEventTicketWriteConfigToPrepare,
  ] = useState<{
    args: Parameters<typeof prepareSpendEventTicket>[0]["args"];
  }>();
  // // todo handle write request errors
  const {
    config: preparedSpendEventTicketWriteConfig,
    refetch: refetchPreparedSpendEventTicketWriteConfig,
    isLoading: isLoadingPreparedSpendEventTicket,
    error: preparedSpendEventTicketWriteConfigError,
  } = prepareSpendEventTicket({
    ...spendEventTicketWriteConfigToPrepare,
    enabled: false,
  });
  // // todo handle transaction signing rejection
  const { data: spendEventTicketWriteResponse, write: spendEventTicketWrite } =
    spendEventTickets(preparedSpendEventTicketWriteConfig);
  const {
    isLoading: isLoadingSpendEventTicketWrite,
    data: spendEventTicketWriteData,
    isSuccess: isSuccessSpendEventTicketWrite,
    isError: isErrorSpendEventTicketWrite,
    error: spendEventTicketWriteError,
  } = useWaitForTransaction({
    hash: spendEventTicketWriteResponse?.hash,
    wait: spendEventTicketWriteResponse?.wait,
  });

  //! SPEND EVENT TICKETS

  const { data: eventTicketsCreatedEvents } = useMainContractEvents({
    eventName: "TicketsCreated",
    filters: {
      [defaultChainId]: [null, BigNumber.from(routerQuery.id).toHexString()],
    },
    provider,
  });
  const {
    data: eventTicketMetadataUri,
    refetch: refetchEventTicketMetadataUri,
  } = getTokenMetadataUris([
    {
      args: eventTicketsCreatedEvents
        ? [
            eventTicketsCreatedEvents[0].map(
              (event: Event) => event.args.tokenId
            ),
          ]
        : undefined,
      enabled: false,
    },
  ]);
  const { data: eventTicketMetadatas } = useTokenMetadataFetch({
    dids: eventTicketTiersRef.current,
  }) as { data: EventTicketMetadata[] | undefined };

  const {
    data: eventTicketBoughtEvents,
    refetch: refetchEventTicketBoughtEvents,
    isLoading: isLoadingEventTicketBoughtEvents,
  } = useMainContractEvents({
    eventName: "TicketBought",
    filters: {
      [defaultChainId]: [BigNumber.from(routerQuery.id).toHexString()],
    },
    provider,
  });
  const nativeCurrencyToUsdPrice = useAppSelector(
    (state) => state.app.nativeCurrencyToUsdPrice
  );
  const {
    data: connectedWalletOwnedTickets,
    refetch: refetchConnectedWalletOwnedTickets,
    isLoading: isLoadingConnectedWalletOwnedTickets,
  } = useMainContractEvents({
    eventName: "TicketBought",
    filters: {
      [defaultChainId]: [
        BigNumber.from(routerQuery.id).toHexString(),
        null,
        connectedWalletAddress,
      ],
    },
    provider,
  });
  const canShowTicketQr = !!connectedWalletOwnedTickets?.[0]?.length;
  const isConnectedWalletAnEventManager =
    connectedWalletAddress &&
    eventManagers?.[0]?.includes(connectedWalletAddress);
  const canConnectedWalletBuyTickets = !isConnectedWalletAnEventManager;
  const eventHasSetDates =
    eventMetadata &&
    (getMetadataAttribute(eventMetadata!, "Event Start Date") ||
      getMetadataAttribute(eventMetadata!, "Event End Date"));

  const eventHasSetLocation =
    eventMetadata &&
    (getMetadataAttribute(eventMetadata!, "Location") ||
      getMetadataAttribute(eventMetadata!, "Additional Location Info"));

  const ticketVerificationCleanupTimeout = useRef(0);

  useEffect(() => {
    eventId ? initEvent(eventId) : router.push("/app");

    global.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const scrollableRef = useRef();

  useEffect(() => {
    isEventTicketsModalOpen &&
      setTimeout(() => {
        scrollableRef.current &&
          (scrollableRef.current.removeEventListener(
            "wheel",
            scrollableHandler,
            {
              passive: false,
            }
          ),
          scrollableRef.current.addEventListener("wheel", scrollableHandler, {
            passive: false,
          }));
      });
  }, [isEventTicketsModalOpen]);

  const scrollableHandler = (e) => {
    scrollableRef.current.scrollLeft -= e.deltaY - e.deltaX;
    e.preventDefault();
  };

  useEffect(() => {
    eventTicketTiers &&
      !eventTicketTiersRef.current?.length &&
      (eventTicketTiersRef.current = eventTicketTiers?.[0]?.map(
        ({ metadataUri }) => metadataUri
      ));
  }, [eventId, eventTicketTiers]);

  useEffect(() => {
    isBuyingATicket !== undefined &&
      buyEventTicketWriteConfigToPrepare &&
      preparedBuyEventTicketWriteConfigError &&
      toast({
        title: "Can't complete the purchase: some address already has a ticket",
        status: "error",
        isClosable: true,
      });
  }, [preparedBuyEventTicketWriteConfigError, isBuyingATicket]);

  useEffect(() => {
    event &&
      eventMetadatas &&
      (setEventMetadata(eventMetadatas[0]), setCurrentStage(Stage.EventLoaded));
  }, [eventMetadataUri, event, eventMetadatas]);

  useEffect(() => {
    eventMetadata?.image &&
      fetch(getIPFSUri(eventMetadata?.image as string) as string).then(() =>
        setIsEventPosterLoaded(true)
      );
  }, [eventMetadata]);

  useEffect(() => {
    events && events[0] && setEvent(events[0][0]);
  }, [events]);

  useEffect(() => {
    eventTicketTiers?.[0]?.[0] &&
      setEventTicketPriceLabel(
        getEventTicketPriceRangeLabel(
          eventTicketTiers[0].map((ticketTier) => ({
            price: ticketTier.ticketPrice,
            isFree: ticketTier.ticketPrice.eq(0),
          }))
        )
      );
  }, [eventTicketTiers]);

  useEffect(() => {
    eventTicketTiers?.[0]?.[0] &&
      (setEventTicketStartingPrice(eventTicketTiers[0][0].ticketPrice),
      setEventTicketsTotalSupply(
        getEventTicketTotalSupplyLabel(
          eventTicketTiers[0].map((ticketTier) => ({
            supply: +ticketTier.ticketSupply,
            isUnlimitedSupply: !!(ticketTier.ticketParams & (1 << 3)),
          }))
        )
      ));
  }, [eventTicketTiers]);

  useEffect(() => {
    eventTicketBoughtEvents &&
      setEventTicketsMintedAmount(eventTicketBoughtEvents[0].length);
  }, [eventTicketBoughtEvents]);

  useEffect(() => {
    eventTicketStartingPrice &&
      !BigNumber.from(eventTicketStartingPrice).eq(0) &&
      nativeCurrencyToUsdPrice &&
      setEventTicketNativeCurrencyPriceLabel(
        `~${(+ethers.utils.formatUnits(
          nativeCurrencyToUsdPrice.mul(eventTicketStartingPrice).toString(),
          26
        )).toFixed(4)} MATIC`
      );
  }, [eventTicketStartingPrice, nativeCurrencyToUsdPrice]);

  useEffect(() => {
    buyEventTicketWriteConfigToPrepare &&
      (buyEventTicketWrite
        ? buyEventTicketWrite()
        : refetchPreparedBuyEventTicketWriteConfig());
  }, [buyEventTicketWriteConfigToPrepare, buyEventTicketWrite]);

  useEffect(() => {
    buyEventTicketWriteData &&
      isBuyingATicket &&
      (isSuccessBuyEventTicketWrite &&
        (refetchEventTicketBoughtEvents(),
        refetchEventTicketTiers(),
        refetchConnectedWalletOwnedTickets(),
        setIsBuyingATicket(undefined),
        onCloseCheckoutModal(),
        onCloseEventTicketsModalOpen(),
        toast({
          title: "A ticket has been bought",
          status: "success",
          isClosable: true,
        })),
      isErrorBuyEventTicketWrite &&
        (setIsBuyingATicket(undefined),
        toast({
          title: "Couldn't buy a ticket",
          status: "error",
          isClosable: true,
        }),
        console.error(buyEventTicketWriteError)));
  }, [buyEventTicketWriteData, isSuccessBuyEventTicketWrite]);

  useEffect(() => {
    spendEventTicketWriteConfigToPrepare &&
      (spendEventTicketWrite
        ? spendEventTicketWrite()
        : refetchPreparedSpendEventTicketWriteConfig());
  }, [spendEventTicketWriteConfigToPrepare, spendEventTicketWrite]);

  useEffect(() => {
    spendEventTicketWriteData &&
      (isSuccessSpendEventTicketWrite &&
        (onTicketVerificationModalClose(),
        toast({
          title: "Scanned tickets has been verified!",
          status: "success",
          isClosable: true,
        })),
      isErrorBuyEventTicketWrite &&
        (toast({
          title: "Couldn't verify scanned tickets",
          status: "error",
          isClosable: true,
        }),
        console.error(spendEventTicketWriteError)));
  }, [spendEventTicketWriteData, isSuccessSpendEventTicketWrite]);

  useEffect(() => {
    ticketMessageSigningData &&
      isTicketMessageSigningSuccess &&
      (prepareTicketQrData(ticketMessageSigningData),
      onTicketPreviewModalOpen(),
      onSimpleAlertClose());
  }, [ticketMessageSigningData, isTicketMessageSigningSuccess]);

  useEffect(() => {
    isTicketMessageSigningError &&
      (handleError(ticketMessageSigningError), onSimpleAlertClose());
  }, [isTicketMessageSigningError]);

  useEffect(() => {
    eventTicketsToRefetch?.length && refetchEventTickets();
  }, [eventTicketsToRefetch]);

  useEffect(() => {
    eventTickets?.[0]?.[0] &&
      (setIsTicketVerificationSuccessful(
        eventTickets?.[0]?.[0]?.eventTokenId.toString() == eventId
      ),
      // setScannedTickets([
      //   ...scannedTickets,
      //   {
      //     ticketTokenId: verifyingTicketTokenId!,
      //     ownerAddress: verifiedTicketWalletAddress!,
      //   },
      // ]),
      clearTimeout(ticketVerificationCleanupTimeout.current),
      (ticketVerificationCleanupTimeout.current = setTimeout(
        () => (
          setIsTicketVerificationSuccessful(undefined),
          setIsVerifyingATicket(false),
          setEventTicketsToRefetch([]),
          setVerifyingTicket(undefined)
        ),
        7000
      )));
  }, [eventTickets]);

  useEffect(() => {
    isTicketVerificationSuccessful === true
      ? toast({
          title: "This ticket is valid",
          status: "success",
        })
      : isTicketVerificationSuccessful === false &&
        toast({
          title: "Invalid ticket",
          status: "error",
        });
  }, [isTicketVerificationSuccessful]);

  useEffect(() => {
    copiedValue && onCopy();

    setCopiedValue("");
  }, [copiedValue]);

  useEffect(() => {
    eventTicketsCreatedEvents && refetchEventTicketMetadataUri();
  }, [eventTicketsCreatedEvents]);

  useEffect(() => {
    eventTicketsCreatedEvents && refetchEventTicketMetadataUri();
  }, [eventTicketMetadataUri]);

  useEffect(() => {
    isWalletConnected &&
      isBuyingATicket !== undefined &&
      eventManagers?.[0] &&
      !eventManagers[0].includes(connectedWalletAddress) &&
      onBuyEventTicketButtonClick(isBuyingATicket);
  }, [isWalletConnected, isBuyingATicket, connectedWalletAddress]);

  // todo use recently created event data if exists
  const initEvent = async (eventTokenId: string) => {
    setEventTokenId(eventTokenId);
  };

  // useEffect(() => {
  //   ticketQrScanResult && verifyTicket(ticketQrScanResult);
  // }, [ticketQrScanResult]);

  const getEventTicketPrice = (ticketIndex: number, inNativeCurrency = false) =>
    inNativeCurrency
      ? eventTicketTiers[0][ticketIndex].ticketPrice
      : nativeCurrencyToUsdPrice
          .mul(eventTicketTiers[0][ticketIndex].ticketPrice.toString())
          .div(10 ** 8);

  const getEventTicketPriceLabel = (ticketIndex: number) =>
    eventTicketTiers?.[0]?.[ticketIndex] &&
    BigNumber.from(eventTicketTiers[0][ticketIndex].ticketPrice).eq(0)
      ? "FREE"
      : `$${(+ethers.utils.formatEther(
          eventTicketTiers[0][ticketIndex].ticketPrice.toString()
        )).toFixed(2)}`;

  const getEventTicketNativeCurrencyPriceLabel = (ticketIndex: number) =>
    eventTicketTiers?.[0]?.[ticketIndex] &&
    nativeCurrencyToUsdPrice &&
    !BigNumber.from(eventTicketTiers[0][ticketIndex].ticketPrice).eq(0)
      ? `~${(+ethers.utils.formatUnits(
          nativeCurrencyToUsdPrice
            .mul(eventTicketTiers[0][ticketIndex].ticketPrice)
            .toString(),
          26
        )).toFixed(4)} MATIC`
      : "";

  const onTicketVerificationQrScanned = (scannedTicketQrDataJSON: string) => {
    if (scannedTicketQrDataJSON) {
      try {
        const { ticketTokenId, ticketTier, signedMessage } = JSON.parse(
          scannedTicketQrDataJSON
        );

        const ownerAddress =
          signedMessage &&
          ethers.utils.verifyMessage(ticketSigningMessage, signedMessage);

        ticketTokenId &&
          ownerAddress &&
          (setIsVerifyingATicket(true),
          setVerifyingTicket({ tokenId: ticketTokenId, tier: ticketTier }),
          setEventTicketsToRefetch([{ ticketTokenId }]),
          setVerifiedTicketWalletAddress(ownerAddress));
      } catch (error) {
        handleError(error as Error, {
          title: "Invalid ticket QR code",
          description: "",
        });
        setIsVerifyingATicket(false);
      }
    }
  };

  const shareEvent = () => {
    navigator.share &&
      navigator.share({
        title: eventMetadata?.name,
        url: location.href,
      });
  };

  const onEventLinkCopyButtonClick = () => {
    setCopiedValue(global.location.href);

    toast({
      title: "copied event link",
      status: "success",
      isClosable: true,
    });
  };

  const onVerifyEventTicketButtonClick = () => {
    onTicketVerificationModalOpen();
  };

  const getTicketTokenId = (ticketIndex: number): BigNumberish | undefined =>
    eventTicketBoughtEvents
      ? eventTicketBoughtEvents[0][ticketIndex].args?.ticketTokenId
      : undefined;

  const onBuyEventTicketButtonClick = (ticketTierId: number) => {
    setIsBuyingATicket(ticketTierId);
    onOpenCheckoutModal();
  };

  const onCompleteCheckout = (ticketRecievers: string[]) => {
    if (
      isWalletConnected &&
      !isLoadingBuyEventTicketWrite &&
      isBuyingATicket !== undefined
    ) {
      try {
        eventTicketTiers?.[0]?.[isBuyingATicket]
          ? setBuyEventTicketWriteConfigToPrepare({
              args: [
                eventTicketTiers[0][isBuyingATicket].eventTokenId,
                isBuyingATicket,
                ticketRecievers,
              ],
              overrides: {
                value: getEventTicketPrice(isBuyingATicket),
              },
            })
          : handleError(new Error("Unable to prepare write config"));
      } catch (error) {
        handleError(error as Error);
      }
    } else {
      setOpenWalletConnectModal(true);
    }
  };

  const mbConnectWallet = () =>
    isWalletConnected ? false : (setOpenWalletConnectModal(true), true);

  const onTicketPreviewModalOpenButtonClick = () => {
    onTicketPreviewModalOpen();
  };

  const onTicketSignButtonClick = () => {
    signTicketMessage();
  };

  const prepareTicketQrData = (signedMessage: string) =>
    setTicketPreviewQrData(
      JSON.stringify({
        ticketTokenId: ticketDataToBeSigned?.tokenId,
        ticketTier: ticketDataToBeSigned?.tier,
        signedMessage,
      })
    );

  const onCompleteEventTicketVerificationButtonClick = () =>
    setSpendEventTicketWriteConfigToPrepare({
      args: [
        eventId,
        scannedTickets.map(({ ticketTokenId }) => ticketTokenId),
        scannedTickets.map(({ ownerAddress }) => ownerAddress),
      ],
    });

  const handleError = (
    error: Error | null,
    toastConfig?: Parameters<typeof toast>[0]
  ) => {
    !toast.isActive(ERROR_TOAST_ID) &&
      toast({
        id: ERROR_TOAST_ID,
        title: "An error occured. Please, try later",
        status: "error",
        ...toastConfig,
      }),
      console.error(error),
      setIsBuyingATicket(undefined);
  };

  const onAddToCalendarButtonClick = () => {
    global.open(
      googleCalendarLink({
        title: eventMetadata?.name!,
        description:
          eventMetadata?.description +
          "<br><br>" +
          `<a href="${location.href}">Visit Event Page</a>`,
        location: getMetadataAttribute(eventMetadata!, "Location"),
        start: getMetadataAttribute(eventMetadata!, "Event Start Date")
          ? getMetadataAttribute(eventMetadata!, "Event Start Date") +
            " " +
            (getMetadataAttribute(eventMetadata!, "Event Start Time") || "") +
            " +0000"
          : undefined,
        end: getMetadataAttribute(eventMetadata!, "Event End Date")
          ? getMetadataAttribute(eventMetadata!, "Event End Date") +
            " " +
            (getMetadataAttribute(eventMetadata!, "Event End Time") || "") +
            " +0000"
          : undefined,
        url: location.href,
      })
    );
  };

  const onShowTicketQrButtonClick = (
    ticketTokenId: BigNumberish,
    ticketTier: BigNumberish
  ) => {
    setTicketDataToBeSigned({
      tokenId: ticketTokenId.toString(),
      tier: +ticketTier,
    });

    mbConnectWallet() ||
      (setSimpleAlertData({
        title: <Text>Prove ticket ownership by signing</Text>,
        description: (
          <Highlight
            query={["free"]}
            styles={{
              bg: "accentSecondary",
              borderRadius: "5px",
              color: "textContrast",
              p: ".25em .5em",
            }}
          >
            It is free and for security reasons only
          </Highlight>
        ),
      }),
      setTimeout(onSimpleAlertOpen));
  };

  const onManageEventButtonClick = () => {
    onOpenEventManagerModal();
  };

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

  return (
    <Container
      mt={["-3.5rem", "-3.5rem", "-2.5rem"]}
      variant={"fullscreen"}
      minH={"100vh"}
    >
      <Global
        styles={css`
          body {
            background: var(--chakra-colors-accentPrimary) !important;
          }
        `}
      />
      <Flex
        as={motion.div}
        initial={{ opacity: 0, y: "-20%" }}
        animate={
          currentStage == Stage.EventLoaded
            ? { y: 0, opacity: 1 }
            : { y: "-20%", opacity: 0 }
        }
        sx={{
          flexDirection: "column",
        }}
      >
        <Flex direction={"column"} justifyContent={"center"}>
          <Container
            h={["15rem", "15rem", "20rem"]}
            pos={"relative"}
            overflow={"hidden"}
            zIndex={"base"}
          >
            {eventMetadata?.image && (
              <Flex justify={"center"}>
                <Box
                  pos={"fixed"}
                  mt={"0rem"}
                  left={0}
                  w={"100vw"}
                  h={["15rem", "15rem", "20rem"]}
                  zIndex={"base"}
                  overflow={"hidden"}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={
                      isEventPosterLoaded ? { opacity: 1 } : { opacity: 0 }
                    }
                  >
                    <Image
                      src={
                        eventMetadata.imagePlaceholder ||
                        getIPFSUri(eventMetadata?.image)
                      }
                      w={"100vw"}
                      filter={"blur(40px)"}
                    />
                  </motion.div>
                </Box>
                <Box
                  as={motion.div}
                  initial={{ marginTop: "20rem" }}
                  animate={
                    isEventPosterLoaded && {
                      marginTop: "5rem",
                    }
                  }
                  whileHover={{ marginTop: "4rem" }}
                  zIndex={"docked"}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={getIPFSUri(eventMetadata?.image)}
                    as={motion.img}
                    initial={fadeTopSlideAnimation["false"]}
                    animate={fadeTopSlideAnimation["true"]}
                    maxW={"75vw"}
                    title={"show poster"}
                    onClick={onOpenEventPosterModalOpen}
                    fallback={<></>}
                  />
                </Box>
              </Flex>
            )}
          </Container>
          <Container
            variant={"undersceen"}
            bg={"accentPrimary"}
            position={"relative"}
            zIndex={"docked"}
            px={"2rem"}
          >
            {eventMetadata && (
              <>
                <Container
                  pos={"absolute"}
                  maxWidth={"min(1440px, calc(100vw - 4rem))"}
                  left="50%"
                  top={["-4.5rem", "-4.5rem", "-3rem"]}
                  transform={"translateX(-50%)"}
                  zIndex={"overlay"}
                >
                  <Flex
                    flexDirection={["column", "column", "row"]}
                    gap={["1rem", "1rem", "3rem"]}
                    zIndex={"overlay"}
                  >
                    {eventHasSetDates && (
                      <Flex gap={".5rem"} align={"center"}>
                        <Image src="/icons/calendar.svg"></Image>
                        <Text
                          color={"textContrast"}
                          whiteSpace={"nowrap"}
                          fontSize={["sm"]}
                        >
                          {getMetadataAttribute(
                            eventMetadata,
                            "Event Start Date"
                          )}
                          {getMetadataAttribute(
                            eventMetadata,
                            "Event Start Time"
                          ) && (
                            <Text
                              color={"textContrast"}
                              whiteSpace={"nowrap"}
                              lineHeight={".5rem"}
                              fontSize={["xs"]}
                            >
                              {getMetadataAttribute(
                                eventMetadata,
                                "Event Start Time"
                              )}
                            </Text>
                          )}
                        </Text>
                        {getMetadataAttribute(
                          eventMetadata,
                          "Event End Date"
                        ) && (
                          <Flex gap={".5rem"} alignItems="center">
                            <ArrowForwardIcon color={"textContrast"} />
                            <Text
                              color={"textContrast"}
                              whiteSpace={"nowrap"}
                              fontSize={["sm"]}
                            >
                              {getMetadataAttribute(
                                eventMetadata,
                                "Event End Date"
                              )}
                              {getMetadataAttribute(
                                eventMetadata,
                                "Event End Time"
                              ) && (
                                <Text
                                  color={"textContrast"}
                                  whiteSpace={"nowrap"}
                                  lineHeight={".5rem"}
                                  fontSize={["xs"]}
                                >
                                  {getMetadataAttribute(
                                    eventMetadata,
                                    "Event End Time"
                                  )}
                                </Text>
                              )}
                            </Text>
                          </Flex>
                        )}
                      </Flex>
                    )}
                    {eventHasSetLocation && (
                      <Popover>
                        <PopoverTrigger>
                          <Flex
                            gap={".5rem"}
                            align={"center"}
                            cursor={"pointer"}
                          >
                            <Image src="/icons/location.svg"></Image>
                            <Text
                              color={"textContrast"}
                              whiteSpace={"nowrap"}
                              maxW={[
                                "13rem",
                                "13rem",
                                "13rem",
                                "13rem",
                                "19rem",
                              ]}
                              fontSize={["sm"]}
                              overflow={"hidden"}
                              textOverflow={"ellipsis"}
                            >
                              {[
                                getMetadataAttribute(eventMetadata, "Location"),
                                getMetadataAttribute(
                                  eventMetadata,
                                  "Additional Location Info"
                                ),
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </Text>
                          </Flex>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverCloseButton />
                          <PopoverBody>
                            {[
                              getMetadataAttribute(eventMetadata, "Location"),
                              getMetadataAttribute(
                                eventMetadata,
                                "Additional Location Info"
                              ),
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    )}
                  </Flex>
                  <Popover>
                    <PopoverTrigger>
                      <Heading
                        cursor={"pointer"}
                        position={"absolute"}
                        top={
                          eventHasSetDates || eventHasSetLocation
                            ? ["-3rem", "-3rem", "-4rem"]
                            : ["-1rem", "-1rem", "-2rem"]
                        }
                        color={"textContrast"}
                        maxW={"95%"}
                        fontSize={["2xl", "2xl", "4xl"]}
                        whiteSpace={["nowrap"]}
                        overflow={"hidden"}
                        textOverflow={"ellipsis"}
                      >
                        {eventMetadata?.name}
                      </Heading>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverCloseButton />
                      <PopoverBody>
                        <Text>{eventMetadata?.name}</Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  {getMetadataAttribute(eventMetadata, "media") && (
                    <Flex
                      pos={"absolute"}
                      top={["-9rem", "-9rem", "-14rem"]}
                      right={"0rem"}
                      zIndex={"overlay"}
                      direction={"column"}
                      gap={".5rem"}
                    >
                      {Object.keys(
                        // @ts-ignore
                        getMetadataAttribute(eventMetadata, "media")
                      ).map(
                        (mediaLinkId) =>
                          getMetadataAttribute(eventMetadata, "media")?.[
                            // @ts-ignore
                            mediaLinkId as SocialMediaIds
                          ] &&
                          mediaLinkId !== SocialMediaIds.Site && (
                            // @ts-ignore
                            <Link
                              href={
                                // @ts-ignore
                                getMetadataAttribute(eventMetadata, "media")[
                                  mediaLinkId as keyof SocialMediaIds
                                ] as string
                              }
                              target={"_blank"}
                            >
                              <IconButton
                                variant={"icon"}
                                as={motion.div}
                                aria-label={mediaLinkId}
                                initial={fadeRightSlideAnimation["false"]}
                                animate={fadeRightSlideAnimation["true"]}
                                icon={
                                  {
                                    [SocialMediaIds.Twitter]: <TwitterIcon />,
                                    [SocialMediaIds.Instagram]: (
                                      <InstagramIcon />
                                    ),
                                    [SocialMediaIds.Facebook]: <FacebookIcon />,
                                    [SocialMediaIds.Telegram]: (
                                      <TelegramIcon width="1.25rem" />
                                    ),
                                    [SocialMediaIds.Site]: (
                                      <SiteIcon width="1.25rem" />
                                    ),
                                  }[mediaLinkId]
                                }
                              />
                            </Link>
                          )
                      )}
                    </Flex>
                  )}
                </Container>
              </>
            )}
            <Flex
              maxW={"1440px"}
              margin={"3rem auto"}
              direction={"column"}
              pos={"relative"}
              gap={"2rem"}
            >
              <Flex
                pos={["relative", "relative", "absolute"]}
                top={[0, 0, "-4.25rem"]}
                justifyContent="flex-end"
                flexWrap="wrap"
                right={0}
                gap={"1rem"}
              >
                <Button
                  onClick={onAddToCalendarButtonClick}
                  variant={"secondary"}
                  bg={"bg"}
                  leftIcon={<CalendarIcon />}
                >
                  Add to calendar
                </Button>
                <Button
                  onClick={
                    global.navigator.share
                      ? shareEvent
                      : onEventLinkCopyButtonClick
                  }
                  variant={"secondary"}
                  bg={"bg"}
                  leftIcon={<Image src="/icons/share.svg" />}
                >
                  Share
                </Button>

                {isConnectedWalletAnEventManager && (
                  <Button
                    onClick={onManageEventButtonClick}
                    variant={"secondary"}
                    bg={"bg"}
                    leftIcon={<SettingsIcon />}
                  >
                    Manage Event
                  </Button>
                )}
              </Flex>
              <Container variant="contrastAccent">
                <Flex align={"center"}>
                  <Flex
                    direction={["column", "column", "row"]}
                    justify={"space-between"}
                    align={"center"}
                    gap={"2rem"}
                    flex={1}
                  >
                    <Flex
                      gap={"2rem"}
                      direction={["column", "column", "row"]}
                      align={"center"}
                      justify={"center"}
                    >
                      <Flex
                        direction={"column"}
                        justify={"space-between"}
                        align={["center", "center", "flex-start"]}
                        gap={".5rem"}
                      >
                        <Heading color={"textContrast"} fontSize={"md"}>
                          minting price
                        </Heading>
                        <Flex
                          align={["center", "center", "flex-end"]}
                          gap={".5rem"}
                          direction={["column", "column", "row"]}
                        >
                          <Text
                            color={"textAccent"}
                            fontSize={"3xl"}
                            fontWeight="bold"
                          >
                            {eventTicketPriceLabel}
                          </Text>
                          {eventTicketTiers?.[0]?.length == 1 && (
                            <Text
                              fontSize={"sm"}
                              color={"textContrastSecondary"}
                            >
                              {eventTicketNativeCurrencyPriceLabel}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                      <Flex gap={"2rem"}>
                        <Flex
                          direction={"column"}
                          justify={"space-between"}
                          align={["center", "center", "flex-start"]}
                          gap={".5rem"}
                        >
                          <Heading color={"textContrast"} fontSize={"md"}>
                            Total supply
                          </Heading>
                          <Text
                            color={"textContrast"}
                            fontSize={"3xl"}
                            fontWeight="bold"
                          >
                            {eventTicketsTotalSupply}
                          </Text>
                        </Flex>
                        <Flex
                          direction={"column"}
                          justify={"space-between"}
                          align={["center", "center", "flex-start"]}
                          gap={".5rem"}
                        >
                          <Heading color={"textContrast"} fontSize={"md"}>
                            Total minted
                          </Heading>
                          <Text
                            color={"textContrast"}
                            fontSize={"3xl"}
                            fontWeight="bold"
                          >
                            {eventTicketsMintedAmount}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    {isConnectedWalletAnEventManager && (
                      <Button
                        variant={"accent"}
                        onClick={onVerifyEventTicketButtonClick}
                      >
                        <Flex direction={"column"}>
                          Validate tickets
                          <Text
                            fontSize={"sm"}
                            fontWeight={"light"}
                            textTransform={"none"}
                          >
                            as a manager
                          </Text>
                        </Flex>
                      </Button>
                    )}
                    {!isConnectedWalletAnEventManager && (
                      <Flex gap="1rem" flexDir={["column", "row"]}>
                        {canConnectedWalletBuyTickets && isWalletConnected && (
                          <Button
                            variant={
                              connectedWalletOwnedTickets?.[0]?.length
                                ? "outline"
                                : "accent"
                            }
                            onClick={() =>
                              eventTicketTiers[0].length > 1
                                ? onOpenEventTicketsModalOpen()
                                : onBuyEventTicketButtonClick(0)
                            }
                            isLoading={
                              isLoadingBuyEventTicketWrite ||
                              isLoadingPreparedBuyEventTicketWriteConfig ||
                              isLoadingEventTicketBoughtEvents ||
                              isWalletConnecting ||
                              isLoadingConnectedWalletOwnedTickets
                            }
                          >
                            buy tickets
                          </Button>
                        )}
                        {isWalletConnected ? (
                          !!connectedWalletOwnedTickets?.[0]?.length &&
                          !isConnectedWalletAnEventManager && (
                            <Flex direction={"column"} gap={".5rem"}>
                              <Button
                                variant={"accent"}
                                onClick={onTicketPreviewModalOpenButtonClick}
                              >
                                Show my tickets
                              </Button>
                            </Flex>
                          )
                        ) : (
                          <Button variant={"accent"} onClick={mbConnectWallet}>
                            Connect Wallet
                          </Button>
                        )}
                      </Flex>
                    )}
                  </Flex>
                  <AlertDialog
                    isOpen={isSimpleAlertOpen}
                    leastDestructiveRef={simpleAlertLeastDestructiveRef}
                    onClose={onSimpleAlertClose}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          {simpleAlertData?.title}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          {simpleAlertData?.description}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button
                            variant={"accent"}
                            isLoading={isLoadingTicketMessage}
                            onClick={onTicketSignButtonClick}
                            ref={simpleAlertLeastDestructiveRef}
                            ml={3}
                          >
                            Sign
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                  <Modal
                    isOpen={isTicketPreviewModalOpen}
                    onClose={onTicketPreviewModalClose}
                  >
                    <ModalOverlay />
                    <ModalContent
                      width={
                        connectedWalletOwnedTickets?.[0]?.length > 1
                          ? "30rem"
                          : "auto"
                      }
                      maxW={"calc(100vw - 1rem)"}
                      bg={"accentPrimary"}
                      paddingY={"2rem"}
                    >
                      <Flex flex={1} direction={"column"} gap={"1rem"}>
                        <Flex
                          flex={1}
                          alignItems={"center"}
                          justify={"space-between"}
                          paddingX={["2rem"]}
                          mb="1rem"
                        >
                          <Heading color="textContrast">My Tickets</Heading>
                          <ModalCloseButton
                            pos={"relative"}
                            top={0}
                            right={0}
                            color={"textContrastSecondary"}
                            size={"lg"}
                          />
                        </Flex>
                        {ticketPreviewQrData ? (
                          <Flex
                            flex={1}
                            direction={"column"}
                            align={"center"}
                            justify={"center"}
                            gap={"2rem"}
                            px={["1rem", "2rem"]}
                          >
                            <QRCode
                              renderAs="canvas"
                              size={300}
                              bgColor="transparent"
                              fgColor="#fff"
                              value={ticketPreviewQrData}
                            />
                            <Button
                              variant={"accent"}
                              onClick={() => setTicketPreviewQrData(undefined)}
                            >
                              Done
                            </Button>
                          </Flex>
                        ) : (
                          <Container
                            as={Flex}
                            variant={"scrollableOverlap"}
                            gap={["1rem", "1.5rem"]}
                            px={["1rem", "2rem"]}
                            maxW="100%"
                          >
                            {eventTicketTiers?.[0] &&
                              eventTicketMetadatas?.length &&
                              connectedWalletOwnedTickets?.[0]?.map(
                                ({ args }) => (
                                  <Flex flexDir={"column"} gap={["2rem"]}>
                                    <EventTicket
                                      ticketData={{
                                        title:
                                          eventTicketMetadatas[
                                            +args.ticketTierId
                                          ].name,
                                        desc: eventTicketMetadatas[
                                          +args.ticketTierId
                                        ].description,
                                        image: getIPFSUri(
                                          eventTicketMetadatas[
                                            +args.ticketTierId
                                          ].image
                                        ),
                                        benefits:
                                          eventTicketMetadatas[
                                            +args.ticketTierId
                                          ].__ticketTierBenefits,
                                        imagePlaceholder:
                                          eventTicketMetadatas[
                                            +args.ticketTierId
                                          ].imagePlaceholder,
                                        price:
                                          eventTicketTiers[0][
                                            +args.ticketTierId
                                          ].ticketPrice,
                                        isFree:
                                          eventTicketTiers[0][
                                            +args.ticketTierId
                                          ].ticketPrice.eq(0),
                                        participantsLabel:
                                          getEventParticipantsAmountLabel(
                                            eventTicketTiers[0]
                                          ),
                                      }}
                                      isAbleToBuy={false}
                                      nativeCurrencyToUsdPrice={
                                        nativeCurrencyToUsdPrice
                                      }
                                    />
                                    <Button
                                      variant={"accent"}
                                      width="15rem"
                                      m={"0 auto"}
                                      onClick={() =>
                                        onShowTicketQrButtonClick(
                                          args.ticketTokenId,
                                          args.ticketTierId
                                        )
                                      }
                                    >
                                      Show ticket QR
                                    </Button>
                                  </Flex>
                                )
                              )}
                          </Container>
                        )}
                      </Flex>
                    </ModalContent>
                  </Modal>
                  <Modal
                    isOpen={isTicketVerificationModalOpen}
                    onClose={onTicketVerificationModalClose}
                  >
                    <ModalOverlay />
                    <ModalContent
                      width={"30rem"}
                      maxW={"calc(100vw - 1rem)"}
                      bg={"accentPrimary"}
                      paddingY={"2rem"}
                    >
                      <Flex flex={1} direction={"column"} gap={"1rem"}>
                        <Flex
                          flex={1}
                          alignItems={"center"}
                          justify={"space-between"}
                          paddingX={["2rem"]}
                          mb="1rem"
                        >
                          <Heading color="textContrast">
                            Ticket Verification
                          </Heading>
                          <ModalCloseButton
                            pos={"relative"}
                            top={0}
                            right={0}
                            color={"textContrastSecondary"}
                            size={"lg"}
                          />
                        </Flex>
                        <Flex
                          flexDir={"column"}
                          px={["1rem", "2rem"]}
                          gap="2rem"
                          alignItems={"center"}
                        >
                          <QrScanner
                            showResult={false}
                            onResult={onTicketVerificationQrScanned}
                          />

                          {isVerifyingATicket ? (
                            (isTicketVerificationSuccessful === undefined && (
                              <Flex align={"center"} gap={"1rem"}>
                                <Spinner color="textContrastSecondary" />
                                <Text color={"textContrastSecondary"}>
                                  verifying...
                                </Text>
                              </Flex>
                            )) || (
                              <Flex w={"100%"} gap={"2rem"} flexDir="column">
                                <Text
                                  alignSelf={"center"}
                                  color={"textContrastSecondary"}
                                >
                                  scan for ticket QR
                                </Text>
                                {isTicketVerificationSuccessful === true && (
                                  <Flex
                                    flexDir={"column"}
                                    alignSelf="flex-start"
                                    flex={1}
                                  >
                                    <Flex gap={"1rem"} flexDir="column">
                                      <Flex gap={"1rem"} align="center">
                                        <Image
                                          src="/icons/ticket.svg"
                                          opacity={0.8}
                                          w={"1rem"}
                                          h={"1rem"}
                                        />
                                        <Text
                                          color={"textContrast"}
                                          fontSize={"xl"}
                                          fontWeight="semibold"
                                        >
                                          {
                                            eventTicketMetadatas?.[
                                              verifyingTicket?.tier
                                            ]?.name
                                          }
                                        </Text>
                                      </Flex>
                                      <Flex
                                        flexDirection={"column"}
                                        gap=".25rem"
                                        maxH="7rem"
                                        overflowY="scroll"
                                      >
                                        {eventTicketMetadatas?.[
                                          verifyingTicket?.tier
                                        ]?.__ticketTierBenefits?.map(
                                          (benefit) => (
                                            <Flex
                                              as={motion.div}
                                              initial={
                                                fadeTopSlideAnimation["false"]
                                              }
                                              animate={
                                                fadeTopSlideAnimation["true"]
                                              }
                                              gap=".75rem"
                                              alignItems={"center"}
                                            >
                                              <CheckIcon color={"success"} />
                                              <Text
                                                color={"textContrast"}
                                                fontWeight="semibold"
                                              >
                                                {benefit.substring(0, 55) ||
                                                  "benefit"}
                                              </Text>
                                            </Flex>
                                          )
                                        )}
                                      </Flex>
                                    </Flex>
                                  </Flex>
                                )}
                              </Flex>
                            )
                          ) : (
                            <Text color={"textContrastSecondary"}>
                              scan for ticket QR
                            </Text>
                          )}
                        </Flex>
                        {scannedTicketTicketTier != undefined && (
                          <Flex>{scannedTicketTicketTier}</Flex>
                        )}
                      </Flex>
                      {/* <ModalFooter>
                        <Button
                          variant={"accent"}
                          isLoading={
                            isLoadingPreparedSpendEventTicket ||
                            isLoadingSpendEventTicketWrite
                          }
                          isDisabled={
                            isLoadingPreparedSpendEventTicket ||
                            isLoadingSpendEventTicketWrite
                          }
                          onClick={onCompleteEventTicketVerificationButtonClick}
                          m={"0 auto"}
                        >
                          Complete Verification
                        </Button>
                      </ModalFooter> */}
                    </ModalContent>
                  </Modal>
                </Flex>
              </Container>
              {eventMetadata?.description && (
                <Flex direction={"column"} px={"1rem"}>
                  <Heading
                    fontSize={"md"}
                    color={"textContrastSecondary"}
                    fontWeight={"md"}
                  >
                    Short Description
                  </Heading>
                  <Text
                    color={"textContrast"}
                    mt={".5rem"}
                    whiteSpace={"pre-wrap"}
                  >
                    {eventMetadata?.description}
                  </Text>
                </Flex>
              )}
              {eventMetadata &&
                getMetadataAttribute(eventMetadata, "Long Description") && (
                  <Flex direction={"column"} px={"1rem"}>
                    <Heading
                      fontSize={"md"}
                      color={"textContrastSecondary"}
                      fontWeight={"md"}
                    >
                      Long Description
                    </Heading>
                    <Text
                      color={"textContrast"}
                      mt={".5rem"}
                      whiteSpace={"pre-wrap"}
                    >
                      {getMetadataAttribute(eventMetadata, "Long Description")}
                    </Text>
                  </Flex>
                )}
              {eventMetadata &&
                getMetadataAttribute(
                  eventMetadata,
                  "Additional Location Info"
                ) && (
                  <Flex direction={"column"} px={"1rem"}>
                    <Heading
                      fontSize={"md"}
                      color={"textContrastSecondary"}
                      fontWeight={"md"}
                    >
                      Long Description
                    </Heading>
                    <Text color={"textContrast"} mt={".5rem"}>
                      {/* todo make enums for attribute names */}
                      {getMetadataAttribute(
                        eventMetadata,
                        "Additional Location Info"
                      )}
                    </Text>
                  </Flex>
                )}
              {eventMetadata &&
                getMetadataAttribute(eventMetadata, "media")?.[
                  SocialMediaIds.Site
                ] && (
                  <Flex direction={"column"} px={"1rem"}>
                    <Heading
                      fontSize={"md"}
                      color={"textContrastSecondary"}
                      fontWeight={"md"}
                    >
                      Contact Information
                    </Heading>
                    <Link
                      mt="1rem"
                      href={
                        getMetadataAttribute(eventMetadata, "media")[
                          SocialMediaIds.Site
                        ]!
                      }
                      target={"_blank"}
                    >
                      <Button
                        variant={"icon"}
                        p={"1rem"}
                        as={motion.div}
                        initial={fadeRightSlideAnimation["false"]}
                        animate={fadeRightSlideAnimation["true"]}
                      >
                        {
                          getMetadataAttribute(eventMetadata, "media")[
                            SocialMediaIds.Site
                          ]
                        }
                        <LinkIcon ml=".5rem" />
                      </Button>
                    </Link>
                  </Flex>
                )}
            </Flex>
          </Container>
        </Flex>
      </Flex>
      <Modal isOpen={isEventPosterModalOpen} onClose={onCloseEventPosterModal}>
        <ModalOverlay></ModalOverlay>
        <ModalContent
          maxW={"calc(100vw - 4rem)"}
          bg={"transparent"}
          boxShadow="none"
          onClick={onCloseEventPosterModal}
        >
          <Image
            src={getIPFSUri(eventMetadata?.image)}
            maxW={"calc(100vw - 4rem)"}
            width={"fit-content"}
            margin="0 auto"
            // onClick={onCloseEventPosterModal}
          ></Image>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isEventTicketsModalOpen}
        onClose={onCloseEventTicketsModalOpen}
      >
        <ModalOverlay></ModalOverlay>
        <ModalContent
          width={"65rem"}
          maxW={"calc(100vw - 1rem)"}
          bg={"accentPrimary"}
          paddingY={"2rem"}
        >
          <Flex flex={1} direction={"column"} gap={"2rem"}>
            <Flex
              flex={1}
              alignItems={"center"}
              justify={"space-between"}
              paddingX={["1rem", "2rem"]}
            >
              <Heading color="textContrast">Select ticket</Heading>
              <ModalCloseButton
                pos={"relative"}
                top={0}
                right={0}
                color={"textContrastSecondary"}
                size={"lg"}
              />
            </Flex>
            <Container
              as={Flex}
              variant={"scrollableOverlap"}
              justifyContent={[
                "initial",
                "initial",
                eventTicketTiers?.[0]?.length <= 2 ? "center" : "initial",
              ]}
              gap={"1.5rem"}
              maxW={"100%"}
              px={["1rem", "2rem"]}
              ref={scrollableRef}
            >
              {eventTicketTiers?.[0] &&
                eventTicketMetadatas?.length &&
                eventTicketMetadatas
                  .sort((a, b) =>
                    a.__ticketTierOrder > b.__ticketTierOrder ? 1 : -1
                  )
                  .map((ticketTierMetadata, ticketIndex) => (
                    <EventTicket
                      key={ticketIndex}
                      ticketData={{
                        title: ticketTierMetadata.name,
                        desc: ticketTierMetadata.description,
                        image: getIPFSUri(ticketTierMetadata.image),
                        benefits: ticketTierMetadata.__ticketTierBenefits,
                        imagePlaceholder: ticketTierMetadata.imagePlaceholder,
                        price: eventTicketTiers[0][ticketIndex].ticketPrice,
                        supplyLabel: getEventTicketTierLeftSupplyLabel(
                          eventTicketTiers[0][ticketIndex]
                        ),
                        isFree:
                          eventTicketTiers[0][ticketIndex].ticketPrice.eq(0),
                      }}
                      isAbleToBuy={
                        getEventTicketTierLeftSupply(
                          eventTicketTiers[0][ticketIndex]
                        ) > 0
                      }
                      nativeCurrencyToUsdPrice={nativeCurrencyToUsdPrice}
                      isBuyingTicket={
                        (isBuyingATicket == ticketIndex &&
                          isLoadingBuyEventTicketWrite) ||
                        isLoadingPreparedBuyEventTicketWriteConfig ||
                        isLoadingEventTicketBoughtEvents
                      }
                      onBuyButtonClick={() =>
                        onBuyEventTicketButtonClick(
                          +eventTicketTiers[0][ticketIndex].tier
                        )
                      }
                    />
                  ))}
            </Container>
            <SwipeIcon />
          </Flex>
        </ModalContent>
      </Modal>
      <EventManagerModal
        eventTokenId={eventId}
        isOpen={isEventManagerModalOpen}
        onClose={onCloseEventManagerModal}
      />
      {isBuyingATicket !== undefined &&
        eventMetadata &&
        eventTicketMetadatas?.[0] && (
          <CheckoutModal
            event={{
              name: eventMetadata.name,
              location: getMetadataAttribute(eventMetadata, "Location"),
              startDate: getMetadataAttribute(
                eventMetadata,
                "Event Start Date"
              ),
              endDate: getMetadataAttribute(eventMetadata, "Event End Date"),
              image: getIPFSUri(eventMetadata.image),
            }}
            ticketTier={{
              name: eventTicketMetadatas[isBuyingATicket!].name,
              price: eventTicketTiers?.[0]?.[isBuyingATicket!].ticketPrice,
            }}
            isOpen={isCheckoutModalOpen}
            onClose={onCloseCheckoutModal}
            hasTicket={!!connectedWalletOwnedTickets?.[0]?.length}
            isCompletingPurchase={
              isLoadingBuyEventTicketWrite ||
              isLoadingPreparedBuyEventTicketWriteConfig ||
              isLoadingEventTicketBoughtEvents ||
              isWalletConnecting
            }
            onCompletePurchaseButtonClick={onCompleteCheckout}
          />
        )}
    </Container>
  );
};

export default EventPage;
