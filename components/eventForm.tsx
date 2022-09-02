import React, {
  useState,
  useEffect,
  ReactElement,
  useContext,
  useRef,
  RefObject,
} from "react";
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  FormControl,
  FormHelperText,
  Highlight,
  Select,
  SlideFade,
  ScaleFade,
  Collapse,
} from "@chakra-ui/react";
import FileUploader from "./ui/fileUploader";
import {
  useDebounce,
  handleOnMouseDown,
  useAppSelector,
  defaultDateFormat,
} from "helpers/hooks";
import { BigNumber, BigNumberish, ethers, FixedNumber } from "ethers";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  setEvent as setEventAction,
  resetEvent as resetEventAction,
  initialState as eventFormInitialState,
} from "features/eventForm/eventFormSlice";
import { useAppDispatch } from "helpers/hooks";
import {
  getNativeCurrencyToUsdPrice,
  prepareCreateEvent,
  createEvent,
  parseTransactionLogs,
} from "helpers/contract";
import date from "date-and-time";
import { context as appContext } from "./context";
import {
  useAccount,
  useConnect,
  useProvider,
  useWaitForTransaction,
} from "wagmi";
import {
  AddIcon,
  ArrowBackIcon,
  DeleteIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import { useModal } from "connectkit";
import EventPreview, { EventProps as EventPreviewProps } from "./eventPreview";
import { AnimatePresence, motion } from "framer-motion";

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
  const { setOpen: setWalletConnectModalOpen } = useModal();
  const router = useRouter();
  const { address: connectedWalletAddress, isConnected: isWalletConnected } =
    useAccount();
  const { connect: connectWallet } = useConnect();
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
  const [eventTicketPosterImageFile, setEventTicketPosterImageFile] =
    useState<Blob>();
  const [defaultEventPosterImageFile, setDefaultEventPosterImageFile] =
    useState<Blob>();

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
  const {
    isOpen: isSimpleDialogOpen,
    onOpen: onSimpleDialogOpen,
    onClose: onSimpleDialogClose,
  } = useDisclosure();
  const {
    isOpen: isLongEventDescriptionFieldOpen,
    onOpen: onOpenLongEventDescriptionField,
    onClose: onCloseLongEventDescriptionField,
  } = useDisclosure();
  const {
    isOpen: isEventStartTimeFieldOpen,
    onOpen: onOpenEventStartTimeField,
    onClose: onCloseEventStartTimeField,
  } = useDisclosure();
  const {
    isOpen: isEventEndDateFieldOpen,
    onOpen: onOpenEventEndDateField,
    onClose: onCloseEventEndDateField,
  } = useDisclosure();
  const {
    isOpen: isEventEndTimeFieldOpen,
    onOpen: onOpenEventEndTimeField,
    onClose: onCloseEventEndTimeField,
  } = useDisclosure();
  const {
    isOpen: isEventLocationInfoFieldOpen,
    onOpen: onOpenEventLocationInfoField,
    onClose: onCloseEventLocationInfoField,
  } = useDisclosure();
  const {
    isOpen: isEventTicketDescriptionFieldOpen,
    onOpen: onOpenEventTicketDescriptionField,
    onClose: onCloseEventTicketDescriptionField,
  } = useDisclosure();
  const [simpleDialogData, setSimpleDialogData] = useState<{
    title: string | JSX.Element;
    desc?: string | JSX.Element;
    actions: { label: string | JSX.Element; action: () => any }[];
  }>();
  const simpleDialogCancelRef = useRef() as RefObject<HTMLButtonElement>;
  const hasPersistedFormDataChangedFromInitial =
    JSON.stringify(eventFormData) != JSON.stringify(eventFormInitialState);
  const [eventPreviewData, setEventPreviewData] = useState<EventPreviewProps>();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setEventPreviewData({
      ...eventPreviewData,
      name: eventFormData.eventTitle,
      shortDescription: eventFormData.eventShortDescription,
      longDescription: eventFormData.eventLongDescription,
      location: [
        eventFormData.eventLocation,
        eventFormData.eventAdditionalLocationInfo,
      ]
        .filter(Boolean)
        .join(", "),
      eventTicketPriceLabel: eventFormData.ticketPrice
        ? "$" + eventFormData.ticketPrice
        : "",
      date: [
        eventFormData.eventStartDate
          ? date.format(
              new Date(eventFormData.eventStartDate),
              defaultDateFormat
            )
          : "",
        eventFormData.eventEndDate
          ? date.format(new Date(eventFormData.eventEndDate), defaultDateFormat)
          : "",
      ].filter(Boolean),
      eventTicketsTotalSupply: `${eventFormData.ticketSupply || ""}`,
    });
  }, [eventFormData]);

  useEffect(() => {
    eventPosterImageFile &&
      setEventPreviewData({
        ...eventPreviewData,
        image: URL.createObjectURL(eventPosterImageFile),
      });
  }, [eventPosterImageFile]);

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
      .then((blob) => setDefaultEventPosterImageFile(blob));

    hasPersistedFormDataChangedFromInitial && askToContinuePersistedEventForm();
  };

  const askToContinuePersistedEventForm = () => {
    setSimpleDialogData({
      title: "There are unsaved changes",
      desc: "Should we continue or start from scratch?",
      actions: [
        {
          label: "Start from scratch",
          action: () => (dispatch(resetEventAction()), onSimpleDialogClose()),
        },
        { label: "Continue", action: onSimpleDialogClose },
      ],
    });
    onSimpleDialogOpen();
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
      !eventFormData.eventShortDescription &&
      "Add event short description") ||
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
    description: eventData.eventShortDescription || "",
    attributes: [
      eventData.eventLongDescription && {
        trait_type: "Long Description",
        value: eventData.eventLongDescription,
      },
      eventData.eventStartDate && {
        trait_type: "Event Start Date",
        value: date.format(
          new Date(eventData.eventStartDate),
          defaultDateFormat
        ),
      },
      eventData.eventStartTime && {
        trait_type: "Event Start Time",
        value: date.format(
          new Date(date.parse(eventData.eventStartTime, "hh:mm")),
          "hh:mm A"
        ),
      },
      eventData.eventEndDate && {
        trait_type: "Event End Date",
        value: date.format(new Date(eventData.eventEndDate), defaultDateFormat),
      },
      eventData.eventEndTime && {
        trait_type: "Event End Time",
        value: date.format(
          new Date(date.parse(eventData.eventEndTime, "hh:mm")),
          "hh:mm A"
        ),
      },
      eventData.eventLocation && {
        trait_type: "Location",
        value: eventData.eventLocation,
      },
      eventData.eventAdditionalLocationInfo && {
        trait_type: "Additional Location Info",
        value: eventData.eventAdditionalLocationInfo,
      },
    ].filter(Boolean) as object[],
  });

  const getEventTicketMetadata = (
    ticketData: typeof eventFormData
  ): Partial<EventTicketMetadata> => ({
    name: ticketData.eventTitle || "",
    description:
      ticketData.eventTicketDescription ||
      ticketData.eventShortDescription ||
      "",
  });

  const beforeEventCreation = () => {
    !isWalletConnected && setWalletConnectModalOpen(true);

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
      image: eventPosterImageFile! || defaultEventPosterImageFile,
    });

    const ticketMetadataUrl = await uploadMetadata({
      ...(eventTicketMetadata as EventTicketMetadata),
      image: eventTicketPosterImageFile! || defaultEventPosterImageFile,
    });

    setCreateEventWritePayloadToPrepare({
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

  const addEventManager = () => {
    setEvent({
      eventManagers: [...(eventFormData.eventManagers || []), ""],
    });
  };

  const removeEventManager = (managerIndex: number) => {
    setEvent({
      eventManagers: eventFormData.eventManagers?.filter(
        (_, i) => i != managerIndex
      ),
    });
  };

  return (
    <Flex sx={{ flexDirection: "column" }}>
      <EventTicketImage
        eventTitle={ticketEventTitle}
        onImageGenerated={setTicketEventImageResult}
      />
      <Flex
        gap={"2rem"}
        maxW={"100vw"}
        padding={[".5rem", ".5rem", ".5rem", 0]}
      >
        <Box
          as={motion.div}
          flex={1}
          display={["none", "none", "none", "block"]}
          initial={{ opacity: 0, x: "-20%" }}
          animate={
            !isSuccessCreateEventWrite
              ? { x: 0, opacity: 1 }
              : { x: "-20%", opacity: 0 }
          }
        >
          <EventPreview eventData={eventPreviewData} />
        </Box>
        <Container
          as={motion.div}
          initial={{ opacity: 0, x: "20%" }}
          animate={
            !isSuccessCreateEventWrite
              ? { x: 0, opacity: 1 }
              : { x: "20%", opacity: 0 }
          }
          variant={"simple"}
        >
          <Heading as="h1">Ticket constructor</Heading>
          <Tabs
            index={eventFormData.tabIndex}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            mt={"2rem"}
            variant={"unstyled"}
            minH={"41rem"}
            w={"25rem"}
            maxW={"100%"}
            onChange={(tabIndex) => setEvent({ tabIndex: tabIndex || 0 })}
          >
            <TabPanels>
              <TabPanel>
                <Heading as="h3" fontSize={"xx-large"}>
                  Main info
                </Heading>
                <Flex
                  direction={"column"}
                  maxH={"32rem"}
                  px={".5rem"}
                  overflow={"scroll"}
                >
                  <Flex mt={"1.5rem"} direction={"column"} gap={"1.5rem"}>
                    <FormControl variant="floating" id="title" isRequired>
                      <Input
                        value={eventFormData.eventTitle}
                        autoFocus
                        placeholder=" "
                        onChange={(event) =>
                          setEvent({ eventTitle: event.target.value })
                        }
                      />
                      <FormLabel>Event title</FormLabel>
                    </FormControl>
                    <Select placeholder="Event Type" isRequired>
                      <option>Event</option>
                    </Select>
                    <FormControl variant="floating" id="shortdesc" isRequired>
                      <Textarea
                        value={eventFormData.eventShortDescription}
                        placeholder=" "
                        onChange={(event) =>
                          setEvent({
                            eventShortDescription: event.target.value,
                          })
                        }
                      />
                      <FormLabel>Short description</FormLabel>
                      <FormHelperText>
                        Min 30, Max 200 symbols. Description will be shown on
                        the list of all events
                      </FormHelperText>
                    </FormControl>
                    <FileUploader
                      placeholder={
                        <Highlight
                          query={"upload event cover"}
                          styles={{
                            background: "accentSecondary",
                            color: "textContrast",
                            px: ".5rem",
                            py: ".5rem",
                            borderRadius: "sm",
                          }}
                        >
                          Drad and grop or click to upload event cover
                        </Highlight>
                      }
                      onChange={(files) => setEventPosterImageFile(files[0])}
                      config={{
                        maxFiles: 1,
                        accept: { "image/*": [], "video/*": [] },
                      }}
                    />
                    <Button
                      variant={"ghost"}
                      display={"flex"}
                      gap={"1rem"}
                      onClick={() =>
                        isLongEventDescriptionFieldOpen
                          ? (onCloseLongEventDescriptionField(),
                            setEvent({
                              eventLongDescription: "",
                            }))
                          : onOpenLongEventDescriptionField()
                      }
                    >
                      {isLongEventDescriptionFieldOpen ? (
                        <DeleteIcon color={"textAccent"} />
                      ) : (
                        <AddIcon color={"accentSecondary"} />
                      )}
                      <Text>
                        {isLongEventDescriptionFieldOpen ? "Remove " : "Add "}
                        long description
                      </Text>
                    </Button>
                    {isLongEventDescriptionFieldOpen && (
                      <FormControl variant="floating" id="longdesc">
                        <Textarea
                          autoFocus
                          value={eventFormData.eventLongDescription}
                          placeholder=" "
                          rows={6}
                          onChange={(event) =>
                            setEvent({
                              eventLongDescription: event.target.value,
                            })
                          }
                        />
                        <FormLabel>Long description</FormLabel>
                      </FormControl>
                    )}
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction={"column"}>
                  <Heading as="h3" fontSize={"xx-large"}>
                    Additional Info
                  </Heading>
                  <Flex
                    paddingTop={"1.5rem"}
                    maxH={"32rem"}
                    px={".5rem"}
                    direction={"column"}
                    gap={"1.5rem"}
                    overflow={"scroll"}
                  >
                    <Flex gap={"1.5rem"}>
                      <FormControl
                        variant="floating"
                        id="ticketSupply"
                        isRequired
                      >
                        <Input
                          value={eventFormData.eventStartDate}
                          placeholder=" "
                          min={eventFormData.eventEndDate}
                          type="date"
                          onChange={(event) =>
                            setEvent({ eventStartDate: event.target.value })
                          }
                        />
                        <FormLabel>Start Date</FormLabel>
                      </FormControl>
                      {!isEventStartTimeFieldOpen && (
                        <Button
                          variant={"ghost"}
                          display={"flex"}
                          gap={"1rem"}
                          onClick={onOpenEventStartTimeField}
                        >
                          <AddIcon color={"accentSecondary"} />
                          <Text>Add time</Text>
                        </Button>
                      )}
                    </Flex>
                    {isEventStartTimeFieldOpen && (
                      <Flex gap={"1rem"}>
                        <FormControl variant="floating" id="longdesc">
                          <Input
                            autoFocus
                            value={eventFormData.eventStartTime}
                            placeholder=" "
                            type="time"
                            onChange={(event) =>
                              setEvent({
                                eventStartTime: event.target.value,
                              })
                            }
                          />
                          <FormLabel>Start time</FormLabel>
                        </FormControl>
                        <Button
                          variant={"ghost"}
                          display={"flex"}
                          gap={"1rem"}
                          onClick={() => (
                            onCloseEventStartTimeField(),
                            setEvent({
                              eventStartTime: "",
                            })
                          )}
                        >
                          <DeleteIcon color={"textAccent"} />
                          <Text>Remove</Text>
                        </Button>
                      </Flex>
                    )}
                    <Button
                      variant={"ghost"}
                      display={"flex"}
                      gap={"1rem"}
                      onClick={() =>
                        isEventEndDateFieldOpen
                          ? (onCloseEventEndDateField(),
                            onCloseEventEndTimeField(),
                            setEvent({
                              eventEndDate: "",
                              eventEndTime: "",
                            }))
                          : onOpenEventEndDateField()
                      }
                    >
                      {isEventEndDateFieldOpen ? (
                        <DeleteIcon color={"textAccent"} />
                      ) : (
                        <AddIcon color={"accentSecondary"} />
                      )}
                      <Text>
                        {isEventEndDateFieldOpen ? "Remove " : "Add "}
                        end date
                      </Text>
                    </Button>
                    {isEventEndDateFieldOpen && (
                      <Flex gap={"1rem"}>
                        <FormControl variant="floating" id="longdesc">
                          <Input
                            autoFocus
                            value={eventFormData.eventEndDate}
                            placeholder=" "
                            type="date"
                            min={eventFormData.eventStartDate}
                            onChange={(event) =>
                              setEvent({
                                eventEndDate: event.target.value,
                              })
                            }
                          />
                          <FormLabel>End date</FormLabel>
                        </FormControl>
                        {!isEventEndTimeFieldOpen && (
                          <Button
                            variant={"ghost"}
                            display={"flex"}
                            gap={"1rem"}
                            onClick={onOpenEventEndTimeField}
                          >
                            <AddIcon color={"accentSecondary"} />
                            <Text>Add time</Text>
                          </Button>
                        )}
                      </Flex>
                    )}
                    {isEventEndTimeFieldOpen && (
                      <Flex gap={"1rem"}>
                        <FormControl variant="floating" id="longdesc">
                          <Input
                            autoFocus
                            value={eventFormData.eventEndTime}
                            placeholder=" "
                            type="time"
                            min={eventFormData.eventStartTime}
                            onChange={(event) =>
                              setEvent({
                                eventEndTime: event.target.value,
                              })
                            }
                          />
                          <FormLabel>End time</FormLabel>
                        </FormControl>
                        <Button
                          variant={"ghost"}
                          display={"flex"}
                          gap={"1rem"}
                          onClick={() => (
                            onCloseEventEndTimeField(),
                            setEvent({
                              eventEndTime: "",
                            })
                          )}
                        >
                          <DeleteIcon color={"textAccent"} />
                          <Text>Remove</Text>
                        </Button>
                      </Flex>
                    )}
                    <FormControl variant="floating" id="address">
                      <Input
                        value={eventFormData.eventLocation}
                        placeholder=" "
                        onChange={(event) =>
                          setEvent({ eventLocation: event.target.value })
                        }
                      />
                      <FormLabel>Address</FormLabel>
                    </FormControl>
                    <Button
                      variant={"ghost"}
                      display={"flex"}
                      gap={"1rem"}
                      onClick={() =>
                        isEventLocationInfoFieldOpen
                          ? (onCloseEventLocationInfoField(),
                            setEvent({
                              eventAdditionalLocationInfo: "",
                            }))
                          : onOpenEventLocationInfoField()
                      }
                    >
                      {isEventLocationInfoFieldOpen ? (
                        <DeleteIcon color={"textAccent"} />
                      ) : (
                        <AddIcon color={"accentSecondary"} />
                      )}
                      <Text>
                        {isEventLocationInfoFieldOpen ? "Remove " : "Add "}
                        additional location info
                      </Text>
                    </Button>
                    {isEventLocationInfoFieldOpen && (
                      <FormControl
                        variant="floating"
                        id="eventAdditionalLocationInfo"
                      >
                        <Textarea
                          value={eventFormData.eventAdditionalLocationInfo}
                          placeholder=" "
                          onChange={(event) =>
                            setEvent({
                              eventAdditionalLocationInfo: event.target.value,
                            })
                          }
                        />
                        <FormLabel>Additional location info</FormLabel>
                      </FormControl>
                    )}
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction={"column"}>
                  <Heading as="h3" fontSize={"xx-large"}>
                    Ticket Info
                  </Heading>
                  <Flex
                    paddingTop={"1.5rem"}
                    direction={"column"}
                    gap={"1.5rem"}
                    maxH={"32rem"}
                    px={".5rem"}
                    overflow={"scroll"}
                  >
                    <FileUploader
                      placeholder={
                        <Highlight
                          query={"upload ticket cover"}
                          styles={{
                            background: "accentSecondary",
                            color: "textContrast",
                            px: ".5rem",
                            py: ".5rem",
                            borderRadius: "sm",
                          }}
                        >
                          Drad and grop or click to upload ticket cover
                        </Highlight>
                      }
                      onChange={(files) =>
                        setEventTicketPosterImageFile(files[0])
                      }
                      config={{
                        maxFiles: 1,
                        accept: { "image/*": [], "video/*": [] },
                      }}
                    />
                    <Button
                      variant={"ghost"}
                      display={"flex"}
                      gap={"1rem"}
                      onClick={() =>
                        isEventTicketDescriptionFieldOpen
                          ? (onCloseEventTicketDescriptionField(),
                            setEvent({
                              eventTicketDescription: "",
                            }))
                          : onOpenEventTicketDescriptionField()
                      }
                    >
                      {isEventTicketDescriptionFieldOpen ? (
                        <DeleteIcon color={"textAccent"} />
                      ) : (
                        <AddIcon color={"accentSecondary"} />
                      )}
                      <Text>
                        {isEventTicketDescriptionFieldOpen ? "Remove " : "Add "}
                        ticket description
                      </Text>
                    </Button>
                    {isEventTicketDescriptionFieldOpen && (
                      <FormControl variant="floating" id="ticketDesc">
                        <Textarea
                          value={eventFormData.eventTicketDescription}
                          placeholder=" "
                          onChange={(event) =>
                            setEvent({
                              eventTicketDescription: event.target.value,
                            })
                          }
                        />
                        <FormLabel>Ticket description</FormLabel>
                      </FormControl>
                    )}
                    <FormControl variant="floating" id="price">
                      <InputGroup>
                        <InputLeftAddon children="$" />
                        <Input
                          value={eventFormData.ticketPrice}
                          type="number"
                          placeholder=" "
                          onChange={(event) =>
                            setEvent({ ticketPrice: event.target.value })
                          }
                          textAlign={"center"}
                        />
                        <FormLabel left={"3rem !important"}>
                          Ticket price
                        </FormLabel>
                        <InputRightAddon
                          children={ticketNativeCurrencyPriceLabel}
                          w={"10rem"}
                          justifyContent={"flex-end"}
                          overflow={"hidden"}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl
                      variant="floating"
                      id="ticketSupply"
                      isRequired
                    >
                      <Input
                        value={eventFormData.ticketSupply}
                        placeholder=" "
                        type="number"
                        min={1}
                        onChange={(event) =>
                          setEvent({ ticketSupply: +event.target.value })
                        }
                      />
                      <FormLabel>Tickets supply</FormLabel>
                    </FormControl>
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction={"column"}>
                  <Heading as="h3" fontSize={"xx-large"}>
                    Info
                  </Heading>
                  <Flex
                    paddingTop={"1.5rem"}
                    direction={"column"}
                    gap={"1.5rem"}
                    maxH={"32rem"}
                    px={".5rem"}
                    overflow={"scroll"}
                  >
                    <FormControl
                      variant="floating"
                      id="beneficiary"
                      isRequired
                      display={"flex"}
                      gap={"1rem"}
                    >
                      <Input
                        value={eventFormData.beneficiary}
                        placeholder=" "
                        onChange={(event) =>
                          setEvent({ beneficiary: event.target.value })
                        }
                      />
                      <FormLabel>Beneficiary wallet address</FormLabel>
                      <Button
                        variant={"accent"}
                        onClick={() =>
                          isWalletConnected
                            ? setEvent({
                                beneficiary: connectedWalletAddress,
                              })
                            : setWalletConnectModalOpen(true)
                        }
                      >
                        Me
                      </Button>
                    </FormControl>
                    {eventFormData.eventManagers?.map(
                      (manager, managerIndex) => (
                        <Flex gap={"1rem"} key={managerIndex}>
                          <FormControl variant="floating" id="longdesc">
                            <Input
                              autoFocus
                              value={
                                eventFormData.eventManagers?.[managerIndex]
                              }
                              placeholder=" "
                              onChange={(event) => {
                                console.log(managerIndex);
                                let eventManagers = [
                                  ...(eventFormData.eventManagers || []),
                                ];
                                eventManagers.splice(
                                  managerIndex,
                                  1,
                                  event.target.value
                                );
                                setEvent({
                                  eventManagers,
                                });
                              }}
                            />
                            <FormLabel>
                              Manager #{managerIndex + 1} wallet address
                            </FormLabel>
                          </FormControl>
                          <Button
                            variant={"ghost"}
                            display={"flex"}
                            gap={"1rem"}
                            onClick={() => removeEventManager(managerIndex)}
                          >
                            <DeleteIcon color={"textAccent"} />
                          </Button>
                        </Flex>
                      )
                    )}
                    <Button
                      variant={"ghost"}
                      display={"flex"}
                      gap={"1rem"}
                      onClick={addEventManager}
                    >
                      <AddIcon color={"accentSecondary"} />
                      <Text>Add event manager</Text>
                    </Button>
                  </Flex>
                </Flex>
              </TabPanel>
            </TabPanels>
            <Flex mt={"4rem"} justifyContent={"space-between"}>
              <Flex align={"center"}>
                <IconButton
                  mr={"1rem"}
                  display={["none", "none", "block"]}
                  disabled={eventFormData.tabIndex == 0}
                  onClick={onPrevFormTabButtonClick}
                  icon={<ArrowBackIcon boxSize={"1.5rem"} />}
                  aria-label="back"
                />
                <TabList>
                  <Tab>1</Tab>
                  <Tab>2</Tab>
                  <Tab>3</Tab>
                  <Tab>4</Tab>
                </TabList>
              </Flex>
              <Button
                variant={"outlineAccent"}
                isLoading={
                  currentEventCreationStage == EventCreationStages.creatingEvent
                }
                onClick={onNextFormTabButtonClick}
              >
                {isOnLastFormTab ? "Finish" : "Next"}
              </Button>
            </Flex>
          </Tabs>
        </Container>
        {/* </Collapse> */}
      </Flex>
      <AlertDialog
        isOpen={isSimpleDialogOpen}
        leastDestructiveRef={simpleDialogCancelRef}
        onClose={onSimpleDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {simpleDialogData?.title}
            </AlertDialogHeader>
            <AlertDialogBody>{simpleDialogData?.desc}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={simpleDialogCancelRef}
                onClick={simpleDialogData?.actions[0].action}
              >
                {simpleDialogData?.actions[0].label}
              </Button>
              <Button
                variant="accent"
                onClick={simpleDialogData?.actions[1].action}
                ml={"1rem"}
              >
                {simpleDialogData?.actions[1].label}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default EventForm;
