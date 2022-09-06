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
import {
  getIPFSUri,
  getMetadataAttribute,
  SocialMediaIds,
  useRouterQuery,
} from "helpers/hooks";
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
import TelegramIcon from "../public/icons/tg";
import SiteIcon from "../public/icons/site";

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
  const { data: eventMetadatas } = useTokenMetadataFetch({
    dids: eventMetadataUri?.[0],
  }) as { data: EventMetadata[] | undefined };
  const [eventMetadata, setEventMetadata] = useState<EventMetadata>();
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
    event &&
      eventMetadatas &&
      (setEventMetadata(eventMetadatas[0]), setCurrentStage(Stage.EventLoaded));
  }, [eventMetadataUri, event, eventMetadatas]);

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

  useEffect(() => {
    console.log(connectedWalletAddress, eventTicketBoughtEvents);
  }, [connectedWalletAddress, eventTicketBoughtEvents]);

  // todo use recently created event data if exists
  const initEvent = async (eventTokenId: string) => {
    setEventTokenId(eventTokenId);
  };

  // useEffect(() => {
  //   ticketQrScanResult && verifyTicket(ticketQrScanResult);
  // }, [ticketQrScanResult]);

  const getEventTicketPrice = (ticketIndex: number, inNativeCurrency = false) =>
    inNativeCurrency
      ? eventTickets[0][0][ticketIndex].price
      : nativeCurrencyToUsdPrice[0].answer
          .mul(10 ** 10)
          .mul(
            +ethers.utils.formatEther(eventTickets[0][0][0].price.toString())
          );

  const onTicketVerificationQrScanned = (scannedTicketQrDataJSON: string) => {
    if (scannedTicketQrDataJSON) {
      try {
        const { ticketTokenId, signedMessage } = JSON.parse(
          scannedTicketQrDataJSON
        );
        const address =
          signedMessage &&
          ethers.utils.verifyMessage(ticketSigningMessage, signedMessage);

        ticketTokenId &&
          address &&
          (setIsVerifyingATicket(true),
          setVerifyingTicketTokenId(ticketTokenId),
          setVerifiedTicketWalletAddress(address));
      } catch (error) {
        handleError(error as Error, {
          title: "Ivalid ticket QR code",
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
    onCopy();

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
    eventTicketsCreatedEvents
      ? eventTicketsCreatedEvents[0][ticketIndex].args?.tokenId
      : undefined;

  const onBuyEventTicketButtonClick = (ticketIndex: number) => {
    setIsBuyingATicket(true);

    try {
      const ticketTokenId = getTicketTokenId(ticketIndex);

      ticketTokenId
        ? setBuyEventTicketWriteConfigToPrepare({
            args: [ticketTokenId, connectedWalletAddress!],
            overrides: {
              value: getEventTicketPrice(ticketIndex, true),
            },
          })
        : handleError(new Error("Unable to prepare write config"));
    } catch (error) {
      handleError(error as Error);
    }
  };

  const onTicketPreviewModalOpenButtonClick = () => {
    setSimpleAlertData({
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
    });

    setTimeout(onSimpleAlertOpen);
  };

  const onTicketSignButtonClick = () => {
    signTicketMessage();
  };

  const prepareTicketQrData = (signedMessage: string) =>
    setTicketPreviewQrData(
      JSON.stringify({
        ticketTokenId: getTicketTokenId(0)?._hex,
        signedMessage,
      })
    );

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
      setIsBuyingATicket(false);
  };

  return (
    <Container mt={"-2.5rem"} variant={"fullscreen"} minH={"100vh"}>
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
            h={"20rem"}
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
                  h={"20rem"}
                  zIndex={"base"}
                  overflow={"hidden"}
                >
                  <Image
                    src={getIPFSUri(eventMetadata?.image)}
                    w={"100vw"}
                    filter={"blur(40px)"}
                  />
                </Box>
                <Image
                  src={getIPFSUri(eventMetadata?.image)}
                  zIndex={"docked"}
                  mt={"5rem"}
                  px={"1rem"}
                />
              </Flex>
            )}
          </Container>
          <Container
            variant={"undersceen"}
            bg={"accentPrimary"}
            zIndex={"docked"}
            px={"2rem"}
          >
            {eventMetadata && (
              <>
                <Container
                  pos={"absolute"}
                  top={"-.5 rem"}
                  left={"2rem"}
                  zIndex={"overlay"}
                >
                  <Flex
                    pos={"absolute"}
                    bottom={"1rem"}
                    gap={"3rem"}
                    zIndex={"overlay"}
                  >
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
                      </Text>
                      {getMetadataAttribute(
                        eventMetadata,
                        "Event End Date"
                      ) && (
                        <Flex gap={".5rem"}>
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
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                    <Flex gap={".5rem"} align={"center"}>
                      <Image src="/icons/location.svg"></Image>
                      <Text
                        color={"textContrast"}
                        whiteSpace={"nowrap"}
                        maxW={["13rem", "13rem", "13rem", "13rem", "19rem"]}
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
                  </Flex>
                  <Flex
                    pos={"absolute"}
                    bottom={"3rem"}
                    zIndex={"docked"}
                    w={"100%"}
                    left={"50%"}
                    transform={"translateX(-50%)"}
                  >
                    <Heading
                      color={"textContrast"}
                      maxW={"100%"}
                      whiteSpace={"nowrap"}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                    >
                      {eventMetadata?.name}
                    </Heading>
                  </Flex>
                </Container>
                {getMetadataAttribute(eventMetadata, "media") && (
                  <Flex
                    pos={"absolute"}
                    top={"2rem"}
                    right={"2rem"}
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
                        ] && (
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
                                  [SocialMediaIds.Instagram]: <InstagramIcon />,
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
              </>
            )}
            <Flex
              maxW={"1440px"}
              margin={"3rem auto"}
              direction={"column"}
              pos={"relative"}
              gap={"2rem"}
            >
              <Flex pos={"absolute"} top={"-4.25rem"} right={0} gap={"1rem"}>
                {global.navigator.share && (
                  <Button
                    onClick={shareEvent}
                    variant={"secondary"}
                    bg={"bg"}
                    leftIcon={<ExternalLinkIcon />}
                  >
                    Share
                  </Button>
                )}
                <IconButton
                  aria-label="copy event link"
                  variant={"secondary"}
                  icon={<LinkIcon />}
                  bg={"bg"}
                  onClick={onEventLinkCopyButtonClick}
                />
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
                          <Text fontSize={"sm"} color={"textContrastSecondary"}>
                            {eventTicketNativeCurrencyPriceLabel}
                          </Text>
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
                    {canConnectedWalletBuyTickets ? (
                      <Button
                        variant={"accent"}
                        onClick={() => onBuyEventTicketButtonClick(0)}
                        isLoading={
                          isBuyingATicket || isLoadingEventTicketBoughtEvents
                        }
                      >
                        buy
                      </Button>
                    ) : (
                      !isConnectedWalletAnEventManager && (
                        <Flex direction={"column"} gap={".5rem"}>
                          <Button
                            variant={"accent"}
                            onClick={onTicketPreviewModalOpenButtonClick}
                          >
                            Show my ticket
                          </Button>
                        </Flex>
                      )
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
                    <ModalContent>
                      <ModalHeader>My Ticket</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody paddingBottom={"3rem"}>
                        <Flex
                          flex={1}
                          direction={"column"}
                          align={"center"}
                          justify={"center"}
                          gap={"1rem"}
                        >
                          {ticketPreviewQrData && (
                            <QRCode
                              renderAs="canvas"
                              size={300}
                              value={ticketPreviewQrData}
                            />
                          )}
                          <Text color={"text"}>
                            show this to an event manager
                          </Text>
                        </Flex>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                  <Modal
                    isOpen={isTicketVerificationModalOpen}
                    onClose={onTicketVerificationModalClose}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Verifying Tickets</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Flex
                          flex={1}
                          direction={"column"}
                          align={"center"}
                          justify={"center"}
                          gap={"1rem"}
                        >
                          <QrScanner
                            showResult={false}
                            onResult={onTicketVerificationQrScanned}
                          />
                          {isVerifyingATicket ? (
                            (isTicketVerificationSuccessful === undefined && (
                              <Flex align={"center"} gap={"1rem"}>
                                <Text fontWeight={"bold"}>
                                  verifying a ticket
                                </Text>
                                <Spinner />
                              </Flex>
                            )) ||
                            (isTicketVerificationSuccessful === true && (
                              <Flex align={"center"} gap={"1rem"}>
                                <Text fontWeight={"bold"}>ticket is valid</Text>
                                <CheckIcon color={"green"} />
                              </Flex>
                            )) ||
                            (isTicketVerificationSuccessful === false && (
                              <Flex align={"center"} gap={"1rem"}>
                                <Text fontWeight={"bold"}>
                                  ticket is not valid
                                </Text>
                                <AlertIcon color={"red"} />
                              </Flex>
                            ))
                          ) : (
                            <Text color={"text"}>scan ticket QR codes</Text>
                          )}
                        </Flex>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          variant={"accent"}
                          onClick={onTicketVerificationModalClose}
                          m={"0 auto"}
                        >
                          Complete Verification
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </Flex>
              </Container>
              <Flex direction={"column"} px={"1rem"}>
                <Heading
                  fontSize={"md"}
                  color={"textContrastSecondary"}
                  fontWeight={"md"}
                >
                  Short Description
                </Heading>
                <Text color={"textContrast"} mt={".5rem"}>
                  {eventMetadata?.description || "-"}
                </Text>
              </Flex>
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
            </Flex>
          </Container>
        </Flex>
      </Flex>
    </Container>
  );
};

export default EventPage;
