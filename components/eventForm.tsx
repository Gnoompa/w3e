import React, { useState, useEffect, ReactElement, useContext } from "react";
import {
  Flex,
  Box,
  Button,
  Text,
  FormLabel,
  Container,
  Textarea,
  Switch,
  Input,
  Tooltip,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  Heading,
  InputLeftAddon,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { ChakraProps } from "@chakra-ui/system";
import FileUploader from "./ui/fileUploader";
import TimespanPicker from "./ui/timespanPicker";

import { useDebounce, handleOnMouseDown, useAppSelector } from "helpers/hooks";
import OutsideClickHandler from "react-outside-click-handler";
import { BigNumber, BigNumberish, ethers, FixedNumber } from "ethers";
import { Portal } from "react-portal";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  setEvent as setEventAction,
  resetEvent as resetEventAction,
} from "features/eventForm/eventFormSlice";
import { useAppDispatch } from "helpers/hooks";
import {
  getNativeCurrencyToUsdPrice,
  prepareCreateEvent,
  createEvent,
  parseTransactionLogs,
} from "helpers/contract";
import { context as appContext } from "./context";
import { useAccount, useProvider, useWaitForTransaction } from "wagmi";
import { ArrowBackIcon } from "@chakra-ui/icons";

const QrScanner = dynamic(() => import("./ui/qrScanner"), {
  ssr: false,
});

const EventTicketImage = dynamic(() => import("./eventTicket"), {
  ssr: false,
});

const EventForm = () => {
  enum FieldModalIds {
    description,
    ticketing,
    location,
    dateTime,
    beneficiary,
  }

  enum EventCreationStages {
    eventConfig,
    creatingEvent,
  }

  const context = useContext(appContext);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { address: connectedWalletAddress, isConnected: isWalletConnected } =
    useAccount();
  const [currentEventCreationStage, setCurrentEventCreationStage] =
    useState<EventCreationStages>(EventCreationStages.eventConfig);
  const [eventFormActiveFieldModal, setEventFormActiveFieldModal] =
    useState<FieldModalIds>();

  const eventFormData = useAppSelector((state) => state.eventForm);

  const [ticketEventTitle, setTicketEventTitle] = useState<string>();
  const [ticketEventImageResult, setTicketEventImageResult] = useState<{
    eventTitle: string;
    image: string;
  }>();
  const [ticketNativeCurrencyPriceLabel, setTicketNativeCurrencyPriceLabel] =
    useState<string | ReactElement>();

  const [isScanningBeneficiaryQr, setIsScanningBeneficiaryQr] = useState(false);
  const [scannedBeneficiaryAddress, setScannedBeneficiaryAddress] =
    useState("");
  const [eventPosterImageFile, setEventPosterImageFile] = useState<Blob>();

  const debouncedTicketPrice = useDebounce(eventFormData.ticketPrice, 4000);
  const [nativeCurrencyToUsdPrice, setNativeCurrencyToUsdPrice] =
    useState<BigNumberish>();
  const {
    data: nativeCurrencyToUsdPriceResponse,
    refetch: refetchNativeCurrencyToUsdPrice,
  } = getNativeCurrencyToUsdPrice();

  const [
    createEventWritePayloadToPrepare,
    setCreateEventWritePayloadToPrepare,
  ] = useState<Parameters<typeof prepareCreateEvent>[0]["args"]>();

  // todo handle write request errors
  const {
    config: preparedCreateEventWriteConfig,
    refetch: refetchPreparedCreateEventWriteConfig,
  } = prepareCreateEvent({
    args: createEventWritePayloadToPrepare,
    enabled: false,
  });

  // todo handle transaction signing rejection
  const { data: createEventWriteResponse, write: createEventWrite } =
    createEvent(preparedCreateEventWriteConfig);

  const {
    isLoading: isLoadingCreateEventWriteData,
    data: createEventWriteReceipt,
    isSuccess: isSuccessCreateEventWrite,
  } = useWaitForTransaction({
    hash: createEventWriteResponse?.hash,
    wait: createEventWriteResponse?.wait,
  });

  const isOnLastFormTab = eventFormData.tabIndex == 3;

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    createEventWriteReceipt &&
      isSuccessCreateEventWrite &&
      (router.push(
        "/#event?id=" +
          parseTransactionLogs(createEventWriteReceipt.logs).filter(
            (log) => log.name == "EventCreated"
          )[0].args.tokenId
      ),
      dispatch(resetEventAction()));
  }, [createEventWriteReceipt, isSuccessCreateEventWrite]);

  useEffect(() => {
    nativeCurrencyToUsdPriceResponse?.length &&
      setNativeCurrencyToUsdPrice(nativeCurrencyToUsdPriceResponse[0].answer);
  }, [nativeCurrencyToUsdPriceResponse]);

  useEffect(() => {
    setTicketNativeCurrencyPriceLabel(
      eventFormData.isFreeTicketPrice ? (
        "FREE"
      ) : eventFormData.ticketPrice && nativeCurrencyToUsdPrice ? (
        `~${(
          +ethers.utils.formatUnits(nativeCurrencyToUsdPrice, 8) *
          +eventFormData.ticketPrice
        ).toFixed(2)} MATIC`
      ) : eventFormData.ticketPrice && !nativeCurrencyToUsdPrice ? (
        <Spinner size={".75rem"} />
      ) : (
        "0 MATIC"
      )
    );
  }, [
    nativeCurrencyToUsdPrice,
    eventFormData.ticketPrice,
    eventFormData.isFreeTicketPrice,
  ]);

  useEffect(() => {
    !eventFormData.isFreeTicketPrice &&
      debouncedTicketPrice &&
      refetchNativeCurrencyToUsdPrice();
  }, [eventFormData.isFreeTicketPrice, debouncedTicketPrice]);

  useEffect(() => {
    currentEventCreationStage == EventCreationStages.creatingEvent &&
      prepareEventForCreation();
  }, [currentEventCreationStage]);

  useEffect(() => {
    createEventWritePayloadToPrepare &&
      (!createEventWrite
        ? refetchPreparedCreateEventWriteConfig()
        : createEventWrite?.());
  }, [createEventWritePayloadToPrepare, createEventWrite]);

  const init = async () => {
    fetch(
      "https://bafybeifqylhbj3ixirvr5yy2agrtyffpapz4axtsmitvbui6ccqmer3vuy.ipfs.nftstorage.link/Group%2073.png"
    )
      .then((response) => response.blob())
      .then((blob) => setEventPosterImageFile(blob));
  };

  const setEvent = (data: Partial<typeof eventFormData>) => {
    dispatch(setEventAction({ ...eventFormData, ...data }));
  };

  const onEventFormFieldBlur = (): void => {
    setEventFormActiveFieldModal(undefined);
  };

  const onBeneficiaryQrScanResult = (result: string): void => {
    setScannedBeneficiaryAddress(result);
  };

  const toggleEventFormActiveFieldModal = (fieldId: FieldModalIds): void => {
    setTimeout(() =>
      setEventFormActiveFieldModal(
        eventFormActiveFieldModal === fieldId ? undefined : fieldId
      )
    );
  };

  const validateEventForm = (): true | string =>
    (!eventFormData.beneficiary && "Add event description") ||
    (!eventFormData.eventTitle &&
      !eventFormData.eventDescription &&
      "Add event description") ||
    (!eventFormData.ticketPrice &&
      !eventFormData.isFreeTicketPrice &&
      "Add ticket or subscription price") ||
    true;

  const uploadMetadata = (
    metatata: Parameters<typeof context.NFTStorageClient.store>[0]
  ) => context.NFTStorageClient.store(metatata);

  const getEventMetadata = (
    eventData: typeof eventFormData
  ): Partial<EventMetadata> => ({
    name: eventData.eventTitle || "",
    description: eventData.eventDescription || "",
    attributes: [
      (eventData.eventTimespan?.fromDate ||
        eventData.eventTimespan?.fromTime) && {
        trait_type: "Event Start Date/Time",
        value: `
                    ${
                      eventData.eventTimespan.fromDate
                        ? eventData.eventTimespan.fromDate + " "
                        : ""
                    }
                    ${
                      eventData.eventTimespan.fromTime
                        ? eventData.eventTimespan.fromTime
                        : ""
                    }
                    `,
      },
      eventData.eventTimespan?.weekdays?.length && {
        trait_type: "Happens On Every",
        value: eventData.eventTimespan.weekdays
          .map((weekday) => weekday.title)
          .join(", "),
      },
      eventData.eventTimespan?.at && {
        trait_type: "Happens At",
        value: eventData.eventTimespan.at,
      },
      eventData.eventLocation && {
        trait_type: "Location",
        value: eventData.eventLocation,
      },
    ].filter(Boolean) as object[],
  });

  const getEventTicketMetadata = (
    ticketData: typeof eventFormData
  ): Partial<EventTicketMetadata> => ({
    name: ticketData.eventTitle || "",
    description: ticketData.eventDescription || "",
  });

  const beforeEventCreation = () => {
    !isWalletConnected && alert("Connect a wallet");

    isWalletConnected &&
      validateEventForm() &&
      setCurrentEventCreationStage(EventCreationStages.creatingEvent);
  };

  // todo prepare request before uploading to ipfs
  const prepareEventForCreation = async () => {
    const eventMetadata = getEventMetadata(eventFormData);
    const eventTicketMetadata = getEventTicketMetadata(eventFormData);

    const eventMetadataUrl = await uploadMetadata({
      ...(eventMetadata as EventMetadata),
      image: eventPosterImageFile!,
    });

    const ticketMetadataUrl = await uploadMetadata({
      ...(eventTicketMetadata as EventTicketMetadata),
      image: eventPosterImageFile!,
    });

    setCreateEventWritePayloadToPrepare({
      // ticketSupply: [Math.floor(2! || 0)],
      // ticketPrice: [ethers.utils.parseEther(`${1! || 0}`)],
      // beneficiary: "0x5b3999bc2e8c46f75BF629DA951559D83E34FBdD",
      // managers: ["0x5b3999bc2e8c46f75BF629DA951559D83E34FBdD"],
      // params: [0],
      // subscriptionDuration: [0],
      // eventMetadataUri: "testuri",
      // ticketMetadataUri: ["testuri"],
      ticketSupply: [Math.floor(+eventFormData.ticketSupply! || 0)],
      ticketPrice: [
        ethers.utils.parseEther(`${+eventFormData.ticketPrice! || 0}`),
      ],
      beneficiary: eventFormData.beneficiary,
      managers: [eventFormData.beneficiary],
      params: [0],
      subscriptionDuration: [eventFormData.subscriptionDuration || 0],
      eventMetadataUri: eventMetadataUrl.url,
      ticketMetadataUri: [ticketMetadataUrl.url],
    });
  };

  const onNextFormTabButtonClick = () => {
    isOnLastFormTab
      ? beforeEventCreation()
      : setEvent({ tabIndex: eventFormData.tabIndex + 1 });
  };

  const onPrevFormTabButtonClick = () => {
    eventFormData.tabIndex !== 0 &&
      setEvent({ tabIndex: eventFormData.tabIndex - 1 });
  };

  return (
    <Flex sx={{ flexDirection: "column" }}>
      <EventTicketImage
        eventTitle={ticketEventTitle}
        onImageGenerated={setTicketEventImageResult}
      />
      {{
        [EventCreationStages.eventConfig]: (
          <>
            <Heading mt=".75em" as="h1">
              Ticket constructor
            </Heading>
            <Tabs
              index={eventFormData.tabIndex}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
              mt={"2rem"}
              variant={"unstyled"}
              minH={"30rem"}
              w={"25rem"}
              onChange={(tabIndex) => setEvent({ tabIndex: tabIndex || 0 })}
            >
              <TabPanels>
                <TabPanel>
                  <Flex direction={"column"}>
                    <Heading as="h3" fontSize={"xx-large"}>
                      Main info
                    </Heading>
                    <Flex mt={"1rem"} direction={"column"} gap={"1rem"}>
                      <Input
                        value={eventFormData.eventTitle}
                        autoFocus
                        placeholder="event title"
                        onChange={(event) =>
                          setEvent({ eventTitle: event.target.value })
                        }
                        textAlign={"center"}
                      />
                      <Textarea
                        value={eventFormData.eventDescription}
                        mt="1rem"
                        placeholder="event description"
                        onChange={(event) =>
                          setEvent({ eventDescription: event.target.value })
                        }
                      />
                      <InputGroup>
                        <Input
                          value={eventFormData.beneficiary}
                          autoFocus
                          placeholder="beneficiary wallet address"
                          onChange={(event) =>
                            setEvent({ beneficiary: event.target.value })
                          }
                        />
                        <InputRightAddon
                          children={
                            <Text
                              cursor={"pointer"}
                              fontWeight={"bold"}
                              onClick={() =>
                                setEvent({
                                  beneficiary: connectedWalletAddress,
                                })
                              }
                            >
                              Me
                            </Text>
                          }
                        />
                      </InputGroup>
                    </Flex>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex direction={"column"}>
                    <Heading as="h3" fontSize={"xx-large"}>
                      Ticketing
                    </Heading>
                    <Flex mt={"1rem"} direction={"column"} gap={"1rem"}>
                      <Input
                        value={eventFormData.ticketSupply}
                        autoFocus
                        placeholder="tickets supply"
                        onChange={(event) =>
                          setEvent({ ticketSupply: +event.target.value })
                        }
                      />
                      <InputGroup>
                        <InputLeftAddon children="$" fontWeight={"black"} />
                        <Input
                          value={eventFormData.ticketPrice}
                          type="number"
                          placeholder="ticket price"
                          onChange={(event) =>
                            console.log(event.target.value) ||
                            setEvent({ ticketPrice: event.target.value })
                          }
                          textAlign={"center"}
                        />
                        <InputRightAddon
                          children={ticketNativeCurrencyPriceLabel}
                          w={"10rem"}
                          justifyContent={"flex-end"}
                          overflow={"hidden"}
                          fontWeight={"bold"}
                        />
                      </InputGroup>
                    </Flex>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex direction={"column"}>
                    <Heading as="h3" fontSize={"xx-large"}>
                      Venue
                    </Heading>
                    <Flex mt={"1rem"} direction={"column"} gap={"1rem"}>
                      <Input
                        value={eventFormData.eventLocation}
                        autoFocus
                        placeholder="location"
                        onChange={(event) =>
                          setEvent({ eventLocation: event.target.value })
                        }
                      />
                      <InputGroup>
                        <InputLeftAddon children={"From"} />
                        <Input type={"date"} />
                      </InputGroup>
                      <InputGroup>
                        <InputLeftAddon children={"To"} />
                        <Input type={"date"} />
                      </InputGroup>
                    </Flex>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex direction={"column"}>
                    <Heading as="h3" fontSize={"xx-large"}>
                      Media
                    </Heading>
                    <Flex mt={"1rem"} direction={"column"} gap={"1rem"}>
                      <FileUploader
                        subtitle="add poster"
                        onChange={(files) => setEventPosterImageFile(files[0])}
                        config={{
                          maxFiles: 1,
                          accept: { "image/*": [], "video/*": [] },
                        }}
                      />
                    </Flex>
                  </Flex>
                </TabPanel>
              </TabPanels>
              <Flex mt={"4rem"} justifyContent={"space-between"}>
                <Flex align={"center"}>
                  <IconButton
                    disabled={eventFormData.tabIndex == 0}
                    onClick={onPrevFormTabButtonClick}
                    icon={<ArrowBackIcon boxSize={"1.5rem"} />}
                    aria-label="back"
                  />
                  <TabList ml={"1rem"}>
                    <Tab>1</Tab>
                    <Tab>2</Tab>
                    <Tab>3</Tab>
                    <Tab>4</Tab>
                  </TabList>
                </Flex>
                <Button
                  variant={"outlineAccent"}
                  onClick={onNextFormTabButtonClick}
                >
                  {isOnLastFormTab ? "Finish" : "Next"}
                </Button>
              </Flex>
            </Tabs>
          </>
        ),
        [EventCreationStages.creatingEvent]: (
          <>
            <Flex
              sx={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner />
              <Text mt="2rem" as="h2">
                creating the event
              </Text>
              <Text mt="1rem" variant="hint">
                might take a minute
              </Text>
            </Flex>
          </>
        ),
      }[currentEventCreationStage] || <></>}
    </Flex>
  );
};

{
  /* <QrScanner onResult={onBeneficiaryQrScanResult} /> */
}

{
  /* {scannedBeneficiaryAddress && (
                            <Button
                              variant="accent"
                              mt="2rem"
                              onClick={() => (
                                setEvent({
                                  beneficiary: scannedBeneficiaryAddress,
                                }),
                                setIsScanningBeneficiaryQr(false)
                              )}
                            >
                              set the beneficiary
                            </Button>
                          )} */
}

const ContainerPopup: React.FC<{
  onOutsideClick?: Function;
  sx?: ChakraProps["sx"];
  variant?: string;
}> = (props) => (
  <OutsideClickHandler
    onOutsideClick={props.onOutsideClick}
    useCapture
    display="contents"
  >
    <Container variant={props.variant || "layout.container.popup"} {...props}>
      {props.children}
    </Container>
  </OutsideClickHandler>
);

export default EventForm;
