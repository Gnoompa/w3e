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
import QRCode from "qrcode.react";
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
} from "@chakra-ui/react";
import { getIPFSUri, SocialMediaIds, useRouterQuery } from "helpers/hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { BigNumber, BigNumberish, ethers } from "ethers";
import {
  chain,
  useAccount,
  useProvider,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";
import {
  buyEventTicket,
  getBalanceOfToken,
  getEventManagers,
  getEvents,
  getEventTickets,
  getNativeCurrencyToUsdPrice,
  getOwnerOfToken,
  getTokenMetadataUris,
  prepareBuyEventTicket,
  useMainContractEvents,
  useTokenMetadataFetch,
} from "helpers/contract";
import {
  ArrowForwardIcon,
  CheckIcon,
  ExternalLinkIcon,
  LinkIcon,
} from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { fadeRightSlideAnimation } from "styles/theme";
import TwitterIcon from "../public/icons/twitter";
import FacebookIcon from "../public/icons/facebook";
import InstagramIcon from "../public/icons/insta";

const Dashboard = () => {
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
  const [copiedValue, setCopiedValue] = useState<string>("");
  const { hasCopied, onCopy } = useClipboard(copiedValue);
  const { address: connectedWalletAddress } = useAccount();
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.LoadingEvent);
  const [eventTokenId, setEventTokenId] = useState<string>();
  const [event, setEvent] = useState<OnchainEvent>();
  const [scannedTickets, setScannedTickets] = useState<Array<object>>([]);
  const [isBuyingATicket, setIsBuyingATicket] = useState(false);
  const [isVerifyingATicket, setIsVerifyingATicket] = useState(false);
  const [eventTicketStartingPrice, setEventTicketStartingPrice] =
    useState<BigNumberish>();
  const [eventTicketsTotalSupply, setEventTicketsTotalSupply] =
    useState<number>();
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

  const [isTicketVerificationSuccessful, setIsTicketVerificationSuccessful] =
    useState<boolean>();
  const eventId = routerQuery.id;
  const { data: eventMetadataUri } = getTokenMetadataUris([
    {
      args: [[eventId]],
    },
  ]);
  const { data: eventMetadata } = useTokenMetadataFetch({
    did: eventMetadataUri?.[0][0],
  }) as { data: EventMetadata | undefined };
  const { data: events } = getEvents([{ args: [eventId] }]);
  const { data: eventManagers } = getEventManagers([{ args: [eventId] }]);
  const { data: eventTickets } = getEventTickets([{ args: [[eventId]] }]);
  const [verifyingTicketTokenId, setVerifyingTicketTokenId] =
    useState<BigNumberish>();
  const [verifiedTicketWalletAddress, setVerifiedTicketWalletAddress] =
    useState<string>();
  const {
    data: balanceOfVerifyingTicketData,
    refetch: refetchBalanceOfVerifyingTicket,
  } = getBalanceOfToken([
    {
      args: [verifiedTicketWalletAddress, verifyingTicketTokenId],
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
  const { data: eventTicketsCreatedEvents } = useMainContractEvents({
    eventName: "TicketsCreated",
    filters: {
      [chain.polygonMumbai.id]: [
        null,
        BigNumber.from(routerQuery.id).toHexString(),
      ],
    },
    provider,
  });
  const {
    data: eventTicketBoughtEvents,
    refetch: refetchEventTicketBoughtEvents,
    isLoading: isLoadingEventTicketBoughtEvents,
  } = useMainContractEvents({
    eventName: "TicketBought",
    filters: {
      [chain.polygonMumbai.id]: [BigNumber.from(routerQuery.id).toHexString()],
    },
    provider,
  });
  const { data: eventTicketUsedEvents } = useMainContractEvents({
    eventName: "TicketUsed",
    provider,
  });
  const {
    data: nativeCurrencyToUsdPrice,
    refetch: refetchNativeCurrencyToUsdPrice,
  } = getNativeCurrencyToUsdPrice();
  const connectedWalletOwnedTickets = eventTicketBoughtEvents?.[0]
    .filter((event) => event.args?.buyer == connectedWalletAddress)
    .map((connectedWalletOwnedTicket) =>
      eventTicketsCreatedEvents?.[0].filter((ticket) =>
        connectedWalletOwnedTicket.args?.tokenId.eq(ticket.args?.tokenId)
      )
    );
  const canShowTicketQr = !!connectedWalletOwnedTickets?.length;
  const isConnectedWalletAnEventManager =
    connectedWalletAddress &&
    eventManagers &&
    eventManagers[0].includes(connectedWalletAddress);
  const canConnectedWalletBuyTickets =
    !connectedWalletOwnedTickets?.length && !isConnectedWalletAnEventManager;

  useEffect(() => {
    eventId ? initEvent(eventId) : router.push("/app");
  }, []);

  useEffect(() => {
    event && eventMetadata && setCurrentStage(Stage.EventLoaded);
  }, [event, eventMetadata]);

  useEffect(() => {
    events && setEvent(events[0]);
  }, [events]);

  useEffect(() => {
    eventTickets &&
      setEventTicketPriceLabel(
        BigNumber.from(eventTickets[0][0][0].price).eq(0)
          ? "FREE"
          : `$${(+ethers.utils.formatEther(
              eventTickets[0][0][0].price.toString()
            )).toFixed(2)}`
      );
  }, [eventTickets]);

  useEffect(() => {
    eventTickets &&
      (setEventTicketStartingPrice(eventTickets[0][0][0].price),
      setEventTicketsTotalSupply(
        BigNumber.from(eventTickets[0][0][0].price).eq(0)
          ? "∞"
          : eventTickets[0][0]
              .map((ticketTier) => +ticketTier.supply)
              .reduce((a, b) => a + b)
      ));
  }, [eventTickets]);

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
          nativeCurrencyToUsdPrice[0].answer
            .mul(eventTicketStartingPrice)
            .toString(),
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
      (isSuccessBuyEventTicketWrite &&
        (refetchEventTicketBoughtEvents(),
        setIsBuyingATicket(false),
        toast({
          title: "A ticket has been bought",
          status: "success",
          isClosable: true,
        })),
      isErrorBuyEventTicketWrite &&
        (toast({
          title: "Couldn't buy a ticket",
          status: "error",
          isClosable: true,
        }),
        console.error(buyEventTicketWriteError)));
  }, [buyEventTicketWriteData, isSuccessBuyEventTicketWrite]);

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
    verifyingTicketTokenId && refetchBalanceOfVerifyingTicket();
  }, [verifyingTicketTokenId]);

  useEffect(() => {
    balanceOfVerifyingTicketData &&
      balanceOfVerifyingTicketData[0] &&
      (setIsTicketVerificationSuccessful(
        balanceOfVerifyingTicketData[0].gte(1)
      ),
      setTimeout(
        () => (
          setIsTicketVerificationSuccessful(undefined),
          setIsVerifyingATicket(false),
          setVerifyingTicketTokenId(undefined)
        ),
        3000
      ));
  }, [balanceOfVerifyingTicketData]);

  useEffect(() => {
    copiedValue && onCopy();
  }, [copiedValue]);

  return <Container variant={"contrast"} maxWidth={"1336px"}></Container>;
};

export default Dashboard;
