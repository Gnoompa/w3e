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
  CloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Slide,
  Icon,
  position,
} from "@chakra-ui/react";
import FileUploader from "./ui/fileUploader";
import {
  useDebounce,
  handleOnMouseDown,
  useAppSelector,
  defaultDateFormat,
  SocialMediaIds,
  useScrollShadow,
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
  defaultChainId,
  getChainNameById,
  getChainById,
} from "helpers/contract";
import date from "date-and-time";
import { context as appContext } from "./context";
import {
  useAccount,
  useConnect,
  useNetwork,
  useProvider,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import {
  AddIcon,
  ArrowBackIcon,
  CloseIcon,
  DeleteIcon,
  PlusSquareIcon,
  QuestionIcon,
} from "@chakra-ui/icons";
import { useModal } from "connectkit";
import EventPreview, { EventProps as EventPreviewProps } from "./eventPreview";
import { AnimatePresence, motion } from "framer-motion";
import TwitterIcon from "../public/icons/twitter";
import FacebookIcon from "../public/icons/facebook";
import InstagramIcon from "../public/icons/insta";
import TelegramIcon from "../public/icons/tg";
import SiteIcon from "../public/icons/site";
import { object, string, number, InferType } from "yup";
import { SchemaLike } from "yup/lib/types";

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

  const { chain: connectedChain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
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
  const isOnLastFormTab = eventFormData.tabIndex == 4;
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
  const activeEventFormTabRef = useRef() as RefObject<HTMLElement>;
  const shouldShowActiveEventFormTabShadow = useScrollShadow(
    activeEventFormTabRef.current
  );
  const hasPersistedFormDataChangedFromInitial =
    JSON.stringify(eventFormData) != JSON.stringify(eventFormInitialState);
  const [eventPreviewData, setEventPreviewData] = useState<EventPreviewProps>();
  const tabPanelAnimation = {
    true: { opacity: 1, y: 0 },
    false: { opacity: 0, y: "-20px" },
  };
  const prevEventFormTabIndex = useRef(eventFormData.tabIndex);
  const [invalidEventFormTabIndexes, setInvalidEventFormTabIndexes] = useState(
    []
  );
  const [invalidEventFormFields, setInvalidEventFormFields] = useState([]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log(shouldShowActiveEventFormTabShadow);
  }, [shouldShowActiveEventFormTabShadow]);
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
      mediaLinks: eventFormData.eventMediaLinks,
      isUnlimitedTicketSupply: eventFormData.isUnlimitedTicketSupply,
      isFreeTicketPrice: eventFormData.isFreeTicketPrice,
    });

    eventFormData.eventEndDate && onOpenEventEndDateField();
    eventFormData.eventEndTime && onOpenEventEndTimeField();
    eventFormData.eventAdditionalLocationInfo && onOpenEventLocationInfoField();
    eventFormData.eventLongDescription && onOpenLongEventDescriptionField();
  }, [eventFormData]);

  useEffect(() => {
    setEventPreviewData((prevData) => ({
      ...prevData,
      image: eventPosterImageFile
        ? URL.createObjectURL(eventPosterImageFile)
        : undefined,
    }));
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

  const validateEventForm = (): boolean =>
    !eventFormData.beneficiary ||
    !eventFormData.eventTitle ||
    !eventFormData.eventShortDescription ||
    (!eventFormData.isFreeTicketPrice && !eventFormData.ticketPrice) ||
    (!eventFormData.isUnlimitedTicketSupply &&
      !eventFormData.isUnlimitedTicketSupply)
      ? (setSimpleDialogData({
          title: "Please, fill all the required fields",
          desc: "",
          actions: [{ label: "Ok", action: onSimpleDialogClose }],
        }),
        onSimpleDialogOpen(),
        true)
      : false;

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
      eventData.eventMediaLinks && {
        non_standard_trait_type: "media",
        value: eventData.eventMediaLinks,
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
    mbConnectWallet() ||
      mbSwitchChain() ||
      validateEventForm() ||
      setCurrentEventCreationStage(EventCreationStages.creatingEvent);
  };

  const mbConnectWallet = () =>
    isWalletConnected ? false : (setWalletConnectModalOpen(true), true);

  const mbSwitchChain = () =>
    connectedChain?.id == defaultChainId
      ? false
      : (setSimpleDialogData({
          title: "Wrong network",
          desc:
            `Please, switch your wallet to ` +
            getChainById(defaultChainId).name +
            ` network`,
          actions: switchNetwork
            ? [
                {
                  label: "Switch Network",
                  action: () => (
                    switchNetwork?.(defaultChainId), onSimpleDialogClose()
                  ),
                },
              ]
            : [],
        }),
        onSimpleDialogOpen(),
        true);

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
      params: [
        BigNumber.from(
          1 <<
            [eventFormData.isUnlimitedTicketSupply && 2].filter(Boolean).length
        ),
      ],
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

  // const onPrevFormTabButtonClick = () => {
  //   eventFormData.tabIndex !== 0 &&
  //     setEvent({ tabIndex: eventFormData.tabIndex - 1 });
  // };

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

  const eventFormTabsValidationSchemas = [
    {
      eventTitle: () => string().required(),
    },
  ] as { [Property in keyof typeof eventFormData]: () => any }[];

  const validateEventFormTab = (tabIndex: number) => {
    eventFormTabsValidationSchemas[tabIndex];
  };

  const onEventFormTabChange = (tabIndex: number) => {
    validateEventFormTab(eventFormData.tabIndex);

    // prevEventFormTabIndex.current = eventFormData.tabIndex

    setEvent({ tabIndex: tabIndex || 0 });
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
            onChange={onEventFormTabChange}
          >
            <TabPanels>
              <TabPanel
                as={motion.div}
                animate={tabPanelAnimation[`${eventFormData.tabIndex == 0}`]}
              >
                <Heading
                  as="h3"
                  fontSize={"xx-large"}
                  boxShadow={
                    shouldShowActiveEventFormTabShadow
                      ? "0 15px 15px -17px grey"
                      : "none"
                  }
                  position={"relative"}
                  zIndex="banner"
                >
                  Main info
                </Heading>
                <Flex
                  ref={activeEventFormTabRef}
                  direction={"column"}
                  maxH={"32rem"}
                  px={".5rem"}
                  overflowY={"scroll"}
                >
                  <Flex mt={"1.5rem"} direction={"column"} gap={"1rem"}>
                    <FormControl
                      variant="floating"
                      id="title"
                      isRequired
                      isInvalid={invalidEventFormFields.includes("eventTitle")}
                    >
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
                    <FormControl variant="floating" id="type" isRequired>
                      <Select defaultValue={"offline"} isRequired>
                        <option value={"offline"}>Offline</option>
                        {/* <option value={"online"}>Online</option> */}
                      </Select>
                      <FormLabel>Event type</FormLabel>
                    </FormControl>
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
                    {!isLongEventDescriptionFieldOpen && (
                      <Flex align={"center"} gap={".5rem"}>
                        <Button
                          variant={"ghost"}
                          display={"flex"}
                          gap={"1rem"}
                          onClick={onOpenLongEventDescriptionField}
                        >
                          <AddIcon color={"accentSecondary"} />
                          <Text>Add long description</Text>
                        </Button>
                        <Popover trigger="hover">
                          <PopoverTrigger>
                            <QuestionIcon color={"accentPrimaryContrast"} />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>
                              Long description, if present, is shown on events’
                              details page and short description on events
                              listing page. Otherwise short description is used
                              on both pages.
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                    )}
                    {isLongEventDescriptionFieldOpen && (
                      <Flex gap={".5rem"}>
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
                        <CloseButton
                          onClick={() => (
                            onCloseLongEventDescriptionField(),
                            setEvent({
                              eventLongDescription: "",
                            })
                          )}
                        />
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel
                as={motion.div}
                animate={tabPanelAnimation[`${eventFormData.tabIndex == 1}`]}
              >
                <Flex direction={"column"}>
                  <Heading as="h3" fontSize={"xx-large"}>
                    Additional Info
                  </Heading>
                  <Flex
                    paddingTop={"1.5rem"}
                    maxH={"32rem"}
                    px={".5rem"}
                    direction={"column"}
                    gap={"1rem"}
                    overflowY={"scroll"}
                  >
                    <Flex gap={"1rem"}>
                      <FormControl
                        variant="floating"
                        id="startDate"
                        flex={1}
                        isRequired
                      >
                        <Input
                          autoFocus
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
                          <Text>Add start time</Text>
                        </Button>
                      )}
                      {isEventStartTimeFieldOpen && (
                        <Flex gap={".5rem"} align="center" flex={1}>
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
                          <CloseButton
                            onClick={() => (
                              onCloseEventStartTimeField(),
                              setEvent({
                                eventStartTime: "",
                              })
                            )}
                          />
                        </Flex>
                      )}
                    </Flex>
                    {isEventEndDateFieldOpen && (
                      <Flex gap={".5rem"} align={"center"}>
                        <FormControl variant="floating" id="enddate" flex={1}>
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
                        <CloseButton
                          onClick={() => (
                            onCloseEventEndDateField(),
                            onCloseEventEndTimeField(),
                            setEvent({
                              eventEndDate: "",
                              eventEndTime: "",
                            })
                          )}
                        />
                        {!isEventEndTimeFieldOpen && (
                          <Button
                            variant={"ghost"}
                            display={"flex"}
                            gap={"1rem"}
                            onClick={onOpenEventEndTimeField}
                          >
                            <AddIcon color={"accentSecondary"} />
                            <Text>Add end time</Text>
                          </Button>
                        )}
                        {isEventEndTimeFieldOpen && (
                          <Flex gap={".5rem"} flex={1} align={"center"}>
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
                            <CloseButton
                              onClick={() => (
                                onCloseEventEndTimeField(),
                                setEvent({
                                  eventEndTime: "",
                                })
                              )}
                            />
                          </Flex>
                        )}
                      </Flex>
                    )}
                    {!isEventEndDateFieldOpen && (
                      <Button
                        variant={"ghost"}
                        display={"flex"}
                        gap={"1rem"}
                        onClick={onOpenEventEndDateField}
                      >
                        <AddIcon color={"accentSecondary"} />
                        <Text>Add end date</Text>
                      </Button>
                    )}
                    <FormControl variant="floating" id="address" isRequired>
                      <Input
                        value={eventFormData.eventLocation}
                        placeholder=" "
                        onChange={(event) =>
                          setEvent({ eventLocation: event.target.value })
                        }
                      />
                      <FormLabel>Address</FormLabel>
                    </FormControl>
                    {!isEventLocationInfoFieldOpen && (
                      <Flex gap={".5rem"} align={"center"}>
                        <Button
                          variant={"ghost"}
                          display={"flex"}
                          gap={"1rem"}
                          onClick={onOpenEventLocationInfoField}
                        >
                          <AddIcon color={"accentSecondary"} />
                          <Text>Add additional location info</Text>
                        </Button>
                        <Popover trigger="hover">
                          <PopoverTrigger>
                            <QuestionIcon color={"accentPrimaryContrast"} />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>
                              Add more info about location, like floor or
                              building number
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                    )}
                    {isEventLocationInfoFieldOpen && (
                      <Flex gap={".5rem"}>
                        <FormControl
                          variant="floating"
                          id="eventAdditionalLocationInfo"
                        >
                          <Textarea
                            autoFocus
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
                        <CloseButton
                          onClick={() => (
                            onCloseEventLocationInfoField(),
                            setEvent({
                              eventAdditionalLocationInfo: "",
                            })
                          )}
                        />
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel
                as={motion.div}
                animate={tabPanelAnimation[`${eventFormData.tabIndex == 2}`]}
              >
                <Flex direction={"column"}>
                  <Heading as="h3" fontSize={"xx-large"}>
                    Ticket Info
                  </Heading>
                  <Flex
                    paddingTop={"1.5rem"}
                    direction={"column"}
                    gap={"1.25rem"}
                    maxH={"32rem"}
                    px={".5rem"}
                    overflowY={"scroll"}
                  >
                    <Popover trigger="hover">
                      <PopoverTrigger>
                        <QuestionIcon
                          color={"accentPrimaryContrast"}
                          alignSelf={"flex-end"}
                          mb={"-2.75rem"}
                          mr={".5rem"}
                          zIndex={"overlay"}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                          While it’s possible to attach imagery of any size
                          proportions, we recommend upholding vertical A4(1:√2)
                          proportions
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
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
                    {!isEventTicketDescriptionFieldOpen && (
                      <Flex gap={".5rem"} align={"center"}>
                        <Button
                          variant={"ghost"}
                          display={"flex"}
                          gap={"1rem"}
                          onClick={onOpenEventTicketDescriptionField}
                        >
                          <AddIcon color={"accentSecondary"} />
                          <Text>Add ticket description</Text>
                        </Button>
                        <Popover trigger="hover">
                          <PopoverTrigger>
                            <QuestionIcon color={"accentPrimaryContrast"} />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>
                              This information is going to be shown on NFT
                              marketplaces/aggregators when collection is going
                              to be deployed under NFT description section. If
                              not specified, event short description will be
                              used
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                    )}
                    {isEventTicketDescriptionFieldOpen && (
                      <Flex gap={".5rem"}>
                        <FormControl variant="floating" id="ticketDesc">
                          <Textarea
                            autoFocus
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
                        <CloseButton
                          onClick={() => (
                            onCloseEventTicketDescriptionField(),
                            setEvent({
                              eventTicketDescription: "",
                            })
                          )}
                        />
                      </Flex>
                    )}
                    <Flex gap={"1rem"} justifyContent={"space-between"}>
                      <FormControl
                        variant="floating"
                        id="price"
                        isRequired
                        flex={0.6}
                      >
                        <InputGroup>
                          <InputLeftAddon children="$" />
                          <Input
                            value={eventFormData.ticketPrice}
                            isDisabled={eventFormData.isFreeTicketPrice}
                            type="number"
                            max="99999"
                            placeholder=" "
                            onChange={(event) =>
                              setEvent({ ticketPrice: event.target.value })
                            }
                            textAlign={"center"}
                          />
                          <FormLabel left={"3rem !important"}>
                            Ticket price
                          </FormLabel>
                        </InputGroup>
                        <FormHelperText textAlign={"right"}>
                          {ticketNativeCurrencyPriceLabel}
                        </FormHelperText>
                      </FormControl>
                      <FormControl
                        display="flex"
                        alignItems="center"
                        flex={0.4}
                        mt="-1.25rem"
                      >
                        <FormLabel htmlFor="freeTickets" mb="0">
                          free
                        </FormLabel>
                        <Switch
                          value={+eventFormData.isFreeTicketPrice}
                          isChecked={eventFormData.isFreeTicketPrice}
                          onChange={() =>
                            setEvent({
                              isFreeTicketPrice:
                                !eventFormData.isFreeTicketPrice,
                            })
                          }
                          id="freeTickets"
                          size={"lg"}
                        />
                      </FormControl>
                    </Flex>
                    <Flex gap={"1rem"} justifyContent={"space-between"}>
                      <FormControl
                        flex={0.6}
                        isDisabled={eventFormData.isUnlimitedTicketSupply}
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
                      <FormControl
                        display="flex"
                        alignItems="center"
                        flex={0.4}
                      >
                        <FormLabel htmlFor="unlimitedTicketSupply" mb="0">
                          unlimited
                        </FormLabel>
                        <Switch
                          value={+eventFormData.isUnlimitedTicketSupply}
                          isChecked={eventFormData.isUnlimitedTicketSupply}
                          onChange={() =>
                            setEvent({
                              isUnlimitedTicketSupply:
                                !eventFormData.isUnlimitedTicketSupply,
                            })
                          }
                          id="unlimitedTicketSupply"
                          size={"lg"}
                        />
                      </FormControl>
                    </Flex>
                  </Flex>
                </Flex>
              </TabPanel>
              <TabPanel
                as={motion.div}
                animate={tabPanelAnimation[`${eventFormData.tabIndex == 3}`]}
              >
                <Flex direction={"column"}>
                  <Heading as="h3" fontSize={"xx-large"}>
                    Payment Info
                  </Heading>
                  <Flex
                    paddingTop={"1.5rem"}
                    direction={"column"}
                    gap={"1.5rem"}
                    maxH={"32rem"}
                    px={".5rem"}
                    overflowY={"scroll"}
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
                        <Flex gap={"1rem"} key={managerIndex} align={"center"}>
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
                          <CloseButton
                            onClick={() => removeEventManager(managerIndex)}
                          />
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
              <TabPanel
                as={motion.div}
                animate={tabPanelAnimation[`${eventFormData.tabIndex == 4}`]}
              >
                <Flex direction={"column"}>
                  <Heading as="h3" fontSize={"xx-large"}>
                    Social
                  </Heading>
                  <Flex
                    paddingTop={"1.5rem"}
                    direction={"column"}
                    gap={"1.5rem"}
                    maxH={"32rem"}
                    px={".5rem"}
                    overflowY={"scroll"}
                  >
                    <Flex gap={"1rem"} align={"center"}>
                      <Container variant={"icon"} flex={0}>
                        <TelegramIcon width={16} />
                      </Container>
                      <Input
                        value={
                          eventFormData?.eventMediaLinks.hasOwnProperty(
                            SocialMediaIds.Telegram
                          )
                            ? eventFormData?.eventMediaLinks?.[
                                SocialMediaIds.Telegram
                              ]
                            : ""
                        }
                        flex={1}
                        onChange={(event) =>
                          setEvent({
                            eventMediaLinks: {
                              ...eventFormData.eventMediaLinks,
                              [SocialMediaIds.Telegram]: event.target.value,
                            },
                          })
                        }
                        placeholder="f.e https://t.me/web3events_eng"
                      />
                    </Flex>
                    <Flex gap={"1rem"} align={"center"}>
                      <Container variant={"icon"} flex={0}>
                        <TwitterIcon />
                      </Container>
                      <Input
                        value={
                          eventFormData?.eventMediaLinks.hasOwnProperty(
                            SocialMediaIds.Twitter
                          )
                            ? eventFormData?.eventMediaLinks?.[
                                SocialMediaIds.Twitter
                              ]
                            : ""
                        }
                        flex={1}
                        onChange={(event) =>
                          setEvent({
                            eventMediaLinks: {
                              ...eventFormData.eventMediaLinks,
                              [SocialMediaIds.Twitter]: event.target.value,
                            },
                          })
                        }
                        placeholder="f.e https://twitter.com/VitalikButerin"
                      />
                    </Flex>
                    <Flex gap={"1rem"} align={"center"}>
                      <Container variant={"icon"} flex={0}>
                        <InstagramIcon />
                      </Container>
                      <Input
                        value={
                          eventFormData?.eventMediaLinks.hasOwnProperty(
                            SocialMediaIds.Twitter
                          )
                            ? eventFormData?.eventMediaLinks?.[
                                SocialMediaIds.Instagram
                              ]
                            : ""
                        }
                        flex={1}
                        onChange={(event) =>
                          setEvent({
                            eventMediaLinks: {
                              ...eventFormData.eventMediaLinks,
                              [SocialMediaIds.Instagram]: event.target.value,
                            },
                          })
                        }
                        placeholder="f.e https://instagram.com/buterin_vitalik.eth"
                      />
                    </Flex>
                    <Flex gap={"1rem"} align={"center"}>
                      <Container variant={"icon"} flex={0}>
                        <FacebookIcon />
                      </Container>
                      <Input
                        value={
                          eventFormData?.eventMediaLinks.hasOwnProperty(
                            SocialMediaIds.Twitter
                          )
                            ? eventFormData?.eventMediaLinks?.[
                                SocialMediaIds.Facebook
                              ]
                            : ""
                        }
                        flex={1}
                        onChange={(event) =>
                          setEvent({
                            eventMediaLinks: {
                              ...eventFormData.eventMediaLinks,
                              [SocialMediaIds.Facebook]: event.target.value,
                            },
                          })
                        }
                        placeholder="f.e https://facebook.com/VitalikButerinCa"
                      />
                    </Flex>
                    <Flex gap={"1rem"} align={"center"}>
                      <Container variant={"icon"} flex={0}>
                        <SiteIcon width={16} />
                      </Container>
                      <Input
                        value={
                          eventFormData?.eventMediaLinks.hasOwnProperty(
                            SocialMediaIds.Site
                          )
                            ? eventFormData?.eventMediaLinks?.[
                                SocialMediaIds.Site
                              ]
                            : ""
                        }
                        flex={1}
                        onChange={(event) =>
                          setEvent({
                            eventMediaLinks: {
                              ...eventFormData.eventMediaLinks,
                              [SocialMediaIds.Site]: event.target.value,
                            },
                          })
                        }
                        placeholder="f.e https://web3events.ai/"
                      />
                    </Flex>
                  </Flex>
                </Flex>
              </TabPanel>
            </TabPanels>
            <Flex mt={"4rem"} justifyContent={"space-between"}>
              <Flex align={"center"}>
                {/* <IconButton
                  mr={"1rem"}
                  display={["none", "none", "block"]}
                  disabled={eventFormData.tabIndex == 0}
                  onClick={onPrevFormTabButtonClick}
                  icon={<ArrowBackIcon boxSize={"1.5rem"} />}
                  aria-label="back"
                /> */}
                <TabList>
                  <Tab>1</Tab>
                  <Tab>2</Tab>
                  <Tab>3</Tab>
                  <Tab>4</Tab>
                  <Tab>5</Tab>
                </TabList>
              </Flex>
              <Button
                px={["1rem", "2rem"]}
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

            <AlertDialogFooter as={Flex} gap={"1rem"}>
              {simpleDialogData?.actions.map(({ action, label }, index) => (
                <Button
                  key={index}
                  ref={index == 0 ? simpleDialogCancelRef : undefined}
                  onClick={action}
                  variant={index == 0 ? "solid" : "accent"}
                >
                  {label}
                </Button>
              ))}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default EventForm;
