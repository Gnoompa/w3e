import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  RefObject,
} from "react";
import axios from "axios";
import {
  Flex,
  Box,
  Button,
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  Heading,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import {
  useAppSelector,
  defaultDateFormat,
  SocialMediaIds,
  useScrollShadow,
  uploadMetadata,
  defaultTimeFormat,
} from "helpers/hooks";
import { BigNumber, BigNumberish, ethers, FixedNumber } from "ethers";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  setEvent as setEventAction,
  resetEvent as resetEventAction,
  initialState as eventFormInitialState,
} from "features/eventForm/eventPersistedFormSlice";
import { useAppDispatch } from "helpers/hooks";
import {
  getNativeCurrencyToUsdPrice,
  prepareCreateEvent,
  createEvent,
  parseTransactionLogs,
  defaultChainId,
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
import { useModal } from "connectkit";
import EventPreview, {
  EventProps as EventPreviewProps,
  EventProps,
} from "./eventPreview";
import { AnimatePresence, motion } from "framer-motion";
import {
  selectInvalidFields,
  setFields as setEventFormFields,
  State as EventFormStateType,
} from "features/eventForm/eventFormSlice";
import { default as MainInfoTab } from "./eventForm/tabs/main";
import { default as VenueTab } from "./eventForm/tabs/venue";
import { default as TicketTab } from "./eventForm/tabs/tickets";
import { default as PaymentTab } from "./eventForm/tabs/payment";
import { default as SocialsTab } from "./eventForm/tabs/socials";
import { default as useEventFormValidationHook } from "./eventForm/validationHook";
import {
  getEventTicketPriceRangeLabel,
  getEventTicketTotalSupplyLabel,
} from "./helpers/events";
import { resolveObjectURL } from "buffer";
import useMediaPlaceholderGenerator from "helpers/hooks/mediaPlaceholderGenerator";

// const EventTicketImage = dynamic(() => import("./eventTicket"), {
//   ssr: false,
// });

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
  const { validateField: validateEventFormField } =
    useEventFormValidationHook();
  const [currentEventCreationStage, setCurrentEventCreationStage] =
    useState<EventCreationStages>(EventCreationStages.eventConfig);
  const [eventFormActiveFieldModal, setEventFormActiveFieldModal] =
    useState<FieldModalIds>();

  const eventPersistedFormData = useAppSelector(
    (state) => state.eventPersistedForm
  );
  const eventFormData = useAppSelector((state) => state.eventForm);
  const eventPersistedFormDataRef = useRef(eventPersistedFormData);

  const [ticketEventTitle, setTicketEventTitle] = useState<string>();
  const [ticketEventImageResult, setTicketEventImageResult] = useState<{
    eventTitle: string;
    image: string;
  }>();

  const [isScanningBeneficiaryQr, setIsScanningBeneficiaryQr] = useState(false);
  const [scannedBeneficiaryAddress, setScannedBeneficiaryAddress] =
    useState("");
  const [eventPosterImageFile, setEventPosterImageFile] = useState<Blob>();
  const [eventTicketPosterImageFile, setEventTicketPosterImageFile] =
    useState<Blob>();
  const defaultEventPosterImageFileUrl =
    "https://bafybeifqylhbj3ixirvr5yy2agrtyffpapz4axtsmitvbui6ccqmer3vuy.ipfs.nftstorage.link/Group%2073.png";
  const [defaultEventPosterImageFile, setDefaultEventPosterImageFile] =
    useState<Blob>();

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
  const {
    data: createEventWriteResponse,
    write: createEventWrite,
    isError: isErrorCreateEventWrite,
  } = createEvent(preparedCreateEventWriteConfig);

  const {
    isLoading: isLoadingCreateEventWriteData,
    data: createEventWriteReceipt,
    isSuccess: isSuccessCreateEventWrite,
  } = useWaitForTransaction({
    hash: createEventWriteResponse?.hash,
    wait: createEventWriteResponse?.wait,
  });
  const isOnLastFormTab = eventPersistedFormData.tabIndex == 4;
  const {
    isOpen: isSimpleDialogOpen,
    onOpen: onSimpleDialogOpen,
    onClose: onSimpleDialogClose,
  } = useDisclosure();
  const { generateMediaPlaceholder } = useMediaPlaceholderGenerator();
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
    JSON.stringify(eventPersistedFormData) !=
    JSON.stringify(eventFormInitialState);
  const [eventPreviewData, setEventPreviewData] = useState<EventPreviewProps>();
  const tabPanelAnimation = {
    true: { opacity: 1, y: 0 },
    false: { opacity: 0, y: "-20px" },
  };
  const eventFormFields = useAppSelector((state) => state.eventForm.fields);
  const invalidEventFormFields = useAppSelector(selectInvalidFields);
  const eventFormFieldsRef = useRef(eventFormFields);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const eventFormTabIdToFieldNameMap = {
    0: ["eventTitle", "eventShortDescription"],
    2: ["ticketPrice", "ticketSupply", "addedTickets"],
    3: ["beneficiary"],
  } as {
    [key: number]: (keyof typeof eventPersistedFormData)[];
  };
  const eventFormTabs = [
    MainInfoTab,
    VenueTab,
    TicketTab,
    PaymentTab,
    SocialsTab,
  ];

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    isWalletConnected && isCreatingEvent && beforeEventCreation();
  }, [isCreatingEvent, isWalletConnected]);

  useEffect(() => {
    setEventPreviewData({
      ...eventPreviewData,
      name: eventPersistedFormData.eventTitle,
      shortDescription: eventPersistedFormData.eventShortDescription,
      longDescription: eventPersistedFormData.eventLongDescription,
      location: [
        eventPersistedFormData.eventLocation,
        eventPersistedFormData.eventAdditionalLocationInfo,
      ]
        .filter(Boolean)
        .join(", "),
      date: [
        eventPersistedFormData.eventStartDate
          ? date.format(
              new Date(eventPersistedFormData.eventStartDate),
              defaultDateFormat
            )
          : "",
        eventPersistedFormData.eventEndDate
          ? date.format(
              new Date(eventPersistedFormData.eventEndDate),
              defaultDateFormat
            )
          : "",
      ].filter(Boolean),
      time: [
        eventPersistedFormData.eventStartTime
          ? date.format(
              new Date(
                date.parse(eventPersistedFormData.eventStartTime, "hh:mm")
              ),
              defaultTimeFormat
            )
          : "",
        eventPersistedFormData.eventEndTime
          ? date.format(
              new Date(
                date.parse(eventPersistedFormData.eventEndTime, "hh:mm")
              ),
              defaultTimeFormat
            )
          : "",
      ].filter(Boolean),
      mediaLinks: eventPersistedFormData.eventMediaLinks,
      eventTicketPriceLabel: getEventTicketPriceRangeLabel(
        Object.values({
          ...eventPersistedFormData.isFreeTicketPrice,
          ...eventPersistedFormData.ticketPrice,
        }).map((price, index) => ({
          price: +price ? ethers.utils.parseEther(price) : 0,
          isFree: eventPersistedFormData.isFreeTicketPrice[index],
        }))
      ),
      eventTicketsSupplyLabel: getEventTicketTotalSupplyLabel(
        Object.values({
          ...eventPersistedFormData.isUnlimitedTicketSupply,
          ...eventPersistedFormData.ticketSupply,
        }).map((supply, index) => ({
          isUnlimitedSupply:
            eventPersistedFormData.isUnlimitedTicketSupply[index],
          supply: +(supply || 0),
        }))
      ),
      ticket:
        eventFormData.editingTicketIndex !== undefined &&
        eventFormTabs[eventPersistedFormData.tabIndex] == TicketTab
          ? {
              image: defaultEventPosterImageFileUrl,
              ...eventPreviewData?.ticket,
              ...getTicketData(eventFormData.editingTicketIndex),
            }
          : undefined,
    });

    eventPersistedFormDataRef.current = eventPersistedFormData;
  }, [
    eventPersistedFormData,
    eventFormData.editingTicketIndex,
    eventFormData.ticketPosters,
  ]);

  useEffect(() => {
    eventFormFieldsRef.current = eventFormFields;
  }, [eventFormFields]);

  useEffect(() => {
    isErrorCreateEventWrite &&
      (setCurrentEventCreationStage(EventCreationStages.eventConfig),
      setSimpleDialogData({
        title: "Something went wrong creating the event",
        desc: "Please, try to create an event again",
        actions: [{ label: "Ok", action: onSimpleDialogClose }],
      }),
      onSimpleDialogOpen());
  }, [isErrorCreateEventWrite]);

  useEffect(() => {
    setEventPreviewData((prevData) => ({
      ...prevData,
      image: eventFormData.eventPoster
        ? URL.createObjectURL(eventFormData.eventPoster)
        : undefined,
    }));
  }, [eventFormData.eventPoster]);

  useEffect(() => {
    eventFormData.editingTicketIndex !== undefined &&
      eventFormTabs[eventPersistedFormData.tabIndex] == TicketTab &&
      setEventPreviewData((prevData) => ({
        ...prevData,
        ticket: {
          ...prevData?.ticket,
          image: eventFormData.ticketPosters?.[eventFormData.editingTicketIndex]
            ? URL.createObjectURL(
                eventFormData.ticketPosters[eventFormData.editingTicketIndex]!
              )
            : defaultEventPosterImageFileUrl,
        },
      }));
  }, [eventFormData.ticketPosters, eventFormData.editingTicketIndex]);

  useEffect(() => {
    createEventWriteReceipt &&
      isSuccessCreateEventWrite &&
      (router.push(
        "/#event?id=" +
          parseTransactionLogs(createEventWriteReceipt.logs).filter(
            (log) => log.name == "EventCreated"
          )[0].args.eventTokenId
      ),
      dispatch(resetEventAction()));
  }, [createEventWriteReceipt, isSuccessCreateEventWrite]);

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
    fetch(defaultEventPosterImageFileUrl)
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
          action: () => (
            dispatch(resetEventAction()),
            dispatch(setEventFormFields([])),
            onSimpleDialogClose()
          ),
        },
        { label: "Continue", action: onSimpleDialogClose },
      ],
    });
    onSimpleDialogOpen();
  };

  const setEvent = (data: Partial<typeof eventPersistedFormData>) => {
    dispatch(setEventAction({ ...eventPersistedFormData, ...data }));
  };

  const validateEventForm = () =>
    Promise.all(
      Object.keys(eventFormTabIdToFieldNameMap)
        .map((tabId) => validateEventFormTabFields(+tabId))
        ?.flat()
    );

  const getEventMetadata = (
    eventData: typeof eventPersistedFormData
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
          defaultDateFormat,
          true
        ),
      },
      eventData.eventStartTime && {
        trait_type: "Event Start Time",
        value: date.format(
          new Date(date.parse(eventData.eventStartTime, "hh:mm")),
          "hh:mm A",
          true
        ),
      },
      eventData.eventEndDate && {
        trait_type: "Event End Date",
        value: date.format(
          new Date(eventData.eventEndDate),
          defaultDateFormat,
          true
        ),
      },
      eventData.eventEndTime && {
        trait_type: "Event End Time",
        value: date.format(
          new Date(date.parse(eventData.eventEndTime, "hh:mm")),
          "hh:mm A",
          true
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

  const getEventTicketMetadatas = (
    ticketData: typeof eventPersistedFormData
  ): Partial<EventTicketMetadata>[] =>
    ticketData.addedTickets.map((ticketIndex) => ({
      name: ticketData.eventTicketName[ticketIndex] || "",
      description:
        ticketData.eventTicketDescription[ticketIndex] ||
        ticketData.eventShortDescription ||
        "",
      __ticketTierBenefits:
        ticketData.ticketBenefits[ticketIndex]?.filter(Boolean),
      __ticketTierOrder: ticketIndex,
    }));

  const beforeEventCreation = () => {
    setIsCreatingEvent(true);

    mbConnectWallet() ||
      mbSwitchChain() ||
      validateEventForm()
        .then(() =>
          setCurrentEventCreationStage(EventCreationStages.creatingEvent)
        )
        .catch(
          () => (
            setSimpleDialogData({
              title: "Please, fill all the required fields",
              desc: "",
              actions: [{ label: "Ok", action: onSimpleDialogClose }],
            }),
            onSimpleDialogOpen()
          )
        );
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

  const getTicketData = (ticketIndex?: number) =>
    ticketIndex == undefined
      ? undefined
      : {
          title: eventPersistedFormData.eventTicketName[ticketIndex],
          desc: eventPersistedFormData.eventTicketDescription[ticketIndex],
          benefits: eventPersistedFormData.ticketBenefits[ticketIndex],
          price: +eventPersistedFormData.ticketPrice[ticketIndex]
            ? ethers.utils.parseEther(
                eventPersistedFormData.ticketPrice[ticketIndex]
              )
            : 0,
          isFree: eventPersistedFormData.isFreeTicketPrice[ticketIndex],
        };

  // todo prepare request before uploading to ipfs
  const prepareEventForCreation = async () => {
    let eventMetadataUrl;
    let ticketMetadataUrls: Awaited<ReturnType<typeof uploadMetadata>>[] = [];

    const eventMetadata = getEventMetadata(eventPersistedFormData);
    const eventTicketMetadatas = getEventTicketMetadatas(
      eventPersistedFormData
    );

    await Promise.all([
      uploadMetadata({
        ...(eventMetadata as EventMetadata),
        image: eventFormData.eventPoster! || defaultEventPosterImageFile,
      }).then((response) => (eventMetadataUrl = response)),
      ...eventTicketMetadatas.map((metadata, ticketIndex) =>
        uploadMetadata({
          ...(metadata as EventTicketMetadata),
          image:
            eventFormData.ticketPosters?.[ticketIndex] ||
            defaultEventPosterImageFile!,
        })
          .then((response) => (ticketMetadataUrls[ticketIndex] = response))
          .catch(console.error)
      ),
    ]);

    let ticketsData = eventPersistedFormData.addedTickets?.map(
      (ticketIndex) => ({
        ticketSupply: Math.floor(
          +eventPersistedFormData.ticketSupply[ticketIndex]! || 0
        ),
        ticketPrice: ethers.utils.parseEther(
          `${+eventPersistedFormData.ticketPrice[ticketIndex]! || 0}`
        ),
        params: BigNumber.from(
          1 <<
            (eventPersistedFormData.isUnlimitedTicketSupply[ticketIndex]
              ? 3
              : 0)
        ),
        subscriptionDuration:
          eventPersistedFormData.subscriptionDuration?.[ticketIndex] || 0,
      })
    );

    console.log(
      eventTicketMetadatas,
      {
        ticketSupply: ticketsData.map(({ ticketSupply }) => ticketSupply),
        ticketPrice: ticketsData.map(({ ticketPrice }) => ticketPrice),
        params: ticketsData.map(({ params }) => params),
        subscriptionDuration: ticketsData.map(
          ({ subscriptionDuration }) => subscriptionDuration
        ),
        beneficiary: eventPersistedFormData.beneficiary,
        managers: [
          eventPersistedFormData.beneficiary,
          ...eventPersistedFormData.eventManagers,
        ],
        eventMetadataUri: eventMetadataUrl || "",
        ticketMetadataUri: ticketMetadataUrls,
      },
      ticketMetadataUrls
    );

    setCreateEventWritePayloadToPrepare({
      ticketSupply: ticketsData.map(({ ticketSupply }) => ticketSupply),
      ticketPrice: ticketsData.map(({ ticketPrice }) => ticketPrice),
      ticketParams: ticketsData.map(({ params }) => params),
      beneficiary: eventPersistedFormData.beneficiary,
      managers: [
        eventPersistedFormData.beneficiary,
        ...eventPersistedFormData.eventManagers,
      ],
      eventMetadataUri: eventMetadataUrl,
      ticketMetadataUri: ticketMetadataUrls,
    });
  };

  const onNextFormTabButtonClick = () => {
    isOnLastFormTab
      ? beforeEventCreation()
      : setEvent({ tabIndex: eventPersistedFormData.tabIndex + 1 });
  };

  const getIsEventFormTabInvalid = (tabIndex: number) =>
    !!invalidEventFormFields.filter(({ tabId }) => tabId == tabIndex).length;

  const validateEventFormTabFields = (tabIndex: number) =>
    eventFormTabIdToFieldNameMap[tabIndex]?.map((fieldName) =>
      validateEventFormField({ fieldName, tabId: tabIndex })
    );

  const onEventFormTabChange = (tabIndex: number) => {
    Promise.all(
      validateEventFormTabFields(eventPersistedFormData.tabIndex)
    ).catch(() => {});

    setEvent({ tabIndex: tabIndex || 0 });
  };

  return (
    <Flex sx={{ flexDirection: "column" }}>
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
          <Heading as="h1">Event constructor</Heading>
          <Tabs
            index={eventPersistedFormData.tabIndex}
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
              {eventFormTabs.map((Tab, index) => (
                <TabPanel
                  key={index}
                  as={motion.div}
                  animate={
                    tabPanelAnimation[
                      `${eventPersistedFormData.tabIndex == index}`
                    ]
                  }
                >
                  <Tab />
                </TabPanel>
              ))}
            </TabPanels>
            <Flex mt={"4rem"} justifyContent={"space-between"}>
              <Flex align={"center"}>
                {/* <IconButton
                  mr={"1rem"}
                  display={["none", "none", "block"]}
                  disabled={eventPersistedFormData.tabIndex == 0}
                  onClick={onPrevFormTabButtonClick}
                  icon={<ArrowBackIcon boxSize={"1.5rem"} />}
                  aria-label="back"
                /> */}
                <TabList>
                  {Array(5)
                    .fill(null)
                    .map((_, tabIndex) => (
                      <Tab
                        bg={
                          getIsEventFormTabInvalid(tabIndex)
                            ? "warn"
                            : "accentPrimaryFaded"
                        }
                      >
                        {tabIndex + 1}
                      </Tab>
                    ))}
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
