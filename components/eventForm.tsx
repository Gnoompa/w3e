import React, { useState, useEffect, ReactElement, useContext } from "react";
import {
  Flex,
  Box,
  Button,
  Label,
  Text,
  Container,
  Textarea,
  Switch,
  Spinner,
  ThemeUIStyleObject,
} from "theme-ui";
import {
  NavigateBack,
  Tooltip,
  Field,
  LocationPicker,
  TimespanPicker,
  FileUploader,
} from "@components/indexx";
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
    rewardConfig,
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
          eventFormData.ticketPrice
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

  return (
    <Flex sx={{ flexDirection: "column" }}>
      <EventTicketImage
        eventTitle={ticketEventTitle}
        onImageGenerated={setTicketEventImageResult}
      />
      {
        {
          [EventCreationStages.eventConfig]: (
            <>
              <Text mt=".75em" as="h1">
                New Event
              </Text>
              {/* <Flex mt='3rem' sx={{flexDirection: 'column'}}>
                        <Flex sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                            <Flex>
                                <Switch value={+isTestMode} checked={isTestMode} id="isTestMode" onChange={() => setIsTestMode(!isTestMode)} />
                                <Label htmlFor="isTestMode" variant='forms.label.switch' sx={{ whiteSpace: 'nowrap' }}>
                                    test for free
                                </Label>
                                <Text ml='1rem' variant='hint'>
                                    ({targetBlockchainLabel})
                                </Text>
                            </Flex>
                            <Box>
                                <Tooltip />
                            </Box>
                        </Flex>
                        {!!isTestMode &&
                            <Flex mt='1rem' sx={{justifyContent: 'center'}}>
                                <Link href='https://faucet.polygon.technology/' target='_blank'>
                                    <Button variant='accentSmall'>get free tokens</Button>
                                </Link>
                            </Flex>
                        }
                    </Flex> */}
              <Flex mt="2rem" sx={{ gap: "2rem" }}>
                <Box sx={{ position: "relative" }}>
                  <Field
                    variant="forms.input.dialog"
                    placeholder="description"
                    onMouseDown={(event) =>
                      handleOnMouseDown(event, () =>
                        toggleEventFormActiveFieldModal(
                          FieldModalIds.description
                        )
                      )
                    }
                    icon="✏️"
                    readOnly
                  />
                  {eventFormActiveFieldModal == FieldModalIds.description && (
                    <ContainerPopup
                      onOutsideClick={() =>
                        setEventFormActiveFieldModal(undefined)
                      }
                    >
                      <Field
                        value={eventFormData.eventTitle}
                        autoFocus
                        variant="forms.input.dialogTransparent"
                        placeholder="title"
                        onChange={(event) =>
                          setEvent({ eventTitle: event.target.value })
                        }
                        sx={{ textAlign: "center" }}
                      />
                      <Textarea
                        value={eventFormData.eventDescription}
                        mt="1rem"
                        placeholder="description"
                        onChange={(event) =>
                          setEvent({ eventDescription: event.target.value })
                        }
                      />
                    </ContainerPopup>
                  )}
                </Box>
                <Box sx={{ position: "relative" }}>
                  <Field
                    variant="forms.input.dialog"
                    placeholder="ticketing"
                    onMouseDown={(event) =>
                      handleOnMouseDown(event, () =>
                        toggleEventFormActiveFieldModal(FieldModalIds.ticketing)
                      )
                    }
                    icon="🎟"
                    readOnly
                  />
                  {eventFormActiveFieldModal == FieldModalIds.ticketing && (
                    <ContainerPopup
                      onOutsideClick={() =>
                        setEventFormActiveFieldModal(undefined)
                      }
                      sx={{ right: 0 }}
                    >
                      <Flex sx={{ flexDirection: "column" }}>
                        <Flex mb="1rem" sx={{ alignItems: "center" }}>
                          <Text as="h2">Tickets</Text>
                          <Flex ml="1rem">
                            <Switch
                              value={+!!eventFormData.isInSubscriptionMode}
                              checked={eventFormData.isInSubscriptionMode}
                              id="isInSubscriptionMode"
                              onChange={() =>
                                setEvent({
                                  isInSubscriptionMode:
                                    !eventFormData.isInSubscriptionMode,
                                })
                              }
                            />
                            <Label
                              htmlFor="isInSubscriptionMode"
                              variant="forms.label.switch"
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              as subscription
                            </Label>
                          </Flex>
                        </Flex>
                        {!!!eventFormData.isInSubscriptionMode && (
                          <Flex mb="1rem" sx={{ flexDirection: "column" }}>
                            <Flex sx={{ alignItems: "center", gap: "1rem" }}>
                              <Field
                                value={eventFormData.subscriptionDuration}
                                onChange={(event) =>
                                  setEvent({
                                    subscriptionDuration: +event.target.value,
                                  })
                                }
                                type="number"
                                variant="forms.input.dialogTransparent"
                                placeholder="duration"
                                disabled={
                                  !!eventFormData.isIndefiniteSubscription
                                }
                                autoFocus
                                sx={{ width: "7rem" }}
                              />
                              <Flex>
                                <Switch
                                  value={
                                    +!!eventFormData.isIndefiniteSubscription
                                  }
                                  checked={
                                    eventFormData.isIndefiniteSubscription
                                  }
                                  id="isIndefiniteSubscription"
                                  onChange={() =>
                                    setEvent({
                                      isIndefiniteSubscription:
                                        !eventFormData.isIndefiniteSubscription,
                                    })
                                  }
                                />
                                <Label
                                  htmlFor="isIndefiniteSubscription"
                                  variant="forms.label.switch"
                                >
                                  indefinite
                                </Label>
                              </Flex>
                            </Flex>
                            <Flex
                              mt=".25rem"
                              pr=".25rem"
                              sx={{
                                alignContent: "flex-end",
                                width: "7rem",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Text variant="fieldSubtitle">in days</Text>
                            </Flex>
                          </Flex>
                        )}
                        <Flex sx={{ alignItems: "center", gap: "1rem" }}>
                          <Field
                            value={eventFormData.ticketSupply}
                            onChange={(event) =>
                              setEvent({ ticketSupply: +event.target.value })
                            }
                            variant="forms.input.dialogTransparent"
                            placeholder="supply"
                            disabled={!!eventFormData.isUnlimitedTicketSupply}
                            autoFocus
                            sx={{ width: "7rem" }}
                          />
                          <Flex sx={{ alignItems: "center" }}>
                            <Switch
                              value={+!!eventFormData.isUnlimitedTicketSupply}
                              checked={eventFormData.isUnlimitedTicketSupply}
                              id="isUnlimitedTicketSupply"
                              onChange={() =>
                                setEvent({
                                  isUnlimitedTicketSupply:
                                    !eventFormData.isUnlimitedTicketSupply,
                                })
                              }
                            />
                            <Label
                              htmlFor="isUnlimitedTicketSupply"
                              variant="forms.label.switch"
                            >
                              unlimited
                            </Label>
                          </Flex>
                        </Flex>
                        <Flex mt="1rem" sx={{ alignItems: "center" }}>
                          <Flex sx={{ flexDirection: "column" }}>
                            <Flex sx={{ alignItems: "center", gap: "1rem" }}>
                              <Field
                                value={eventFormData.ticketPrice}
                                type="number"
                                variant="forms.input.dialogTransparent"
                                placeholder="price"
                                disabled={!!eventFormData.isFreeTicketPrice}
                                onChange={(event) =>
                                  setEvent({ ticketPrice: +event.target.value })
                                }
                                postfix="$"
                                sx={{ width: "7rem" }}
                              />
                              <Flex>
                                <Switch
                                  value={+!!eventFormData.isFreeTicketPrice}
                                  checked={eventFormData.isFreeTicketPrice}
                                  id="isFreeTicketPrice"
                                  onChange={() =>
                                    setEvent({
                                      isFreeTicketPrice:
                                        !eventFormData.isFreeTicketPrice,
                                    })
                                  }
                                />
                                <Label
                                  htmlFor="isFreeTicketPrice"
                                  variant="forms.label.switch"
                                >
                                  free
                                </Label>
                              </Flex>
                            </Flex>
                            <Flex
                              mt=".25rem"
                              pr=".25rem"
                              sx={{
                                alignContent: "flex-end",
                                width: "7rem",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Text variant="fieldSubtitle">
                                {ticketNativeCurrencyPriceLabel}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    </ContainerPopup>
                  )}
                </Box>
              </Flex>
              <Flex mt="2rem" sx={{ gap: "2rem" }}>
                <LocationPicker
                  value={eventFormData.eventLocation}
                  onChange={(location) => setEvent({ eventLocation: location })}
                />
                <TimespanPicker
                  value={eventFormData.eventTimespan}
                  onChange={(timespan) => setEvent({ eventTimespan: timespan })}
                />
              </Flex>
              <Flex mt="2rem" sx={{ alignItems: "center" }}>
                <Box sx={{ flex: 1, position: "relative" }}>
                  <Field
                    variant="forms.input.dialog"
                    value={eventFormData.beneficiary}
                    placeholder="beneficiary"
                    onChange={(event) =>
                      setEvent({ beneficiary: event.target.value })
                    }
                    onBlur={() => setEventFormActiveFieldModal(undefined)}
                    onFocus={() =>
                      setEventFormActiveFieldModal(FieldModalIds.beneficiary)
                    }
                    icon="👛"
                  />
                  {eventFormActiveFieldModal == FieldModalIds.beneficiary && (
                    <ContainerPopup
                      variant="layout.container.popupTransparent"
                      onOutsideClick={() =>
                        setEventFormActiveFieldModal(undefined)
                      }
                      sx={{ left: 0 }}
                    >
                      <Flex sx={{ gap: "1rem" }}>
                        <Button
                          variant="fieldDialog"
                          onMouseDown={(event) =>
                            handleOnMouseDown(event, () =>
                              setEvent({ beneficiary: connectedWalletAddress })
                            )
                          }
                        >
                          <Flex
                            sx={{
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text>me</Text>
                          </Flex>
                        </Button>
                        <Button
                          variant="fieldDialog"
                          onMouseDown={(event) =>
                            handleOnMouseDown(event, () =>
                              setIsScanningBeneficiaryQr(true)
                            )
                          }
                        >
                          <Flex sx={{ flexDirection: "column" }}>
                            {/* <NextImage src={cameraIcon} width='30px' height='30px' alt='camera icon' /> */}
                            <Text
                              variant="secondary"
                              mt=".25rem"
                              sx={{ fontSize: ".75rem" }}
                            >
                              scan QR
                            </Text>
                          </Flex>
                        </Button>
                      </Flex>
                    </ContainerPopup>
                  )}
                  {isScanningBeneficiaryQr && (
                    <Portal>
                      <Container variant="layout.container.modalBackground">
                        <Flex
                          sx={{
                            flexDirection: "column",
                            alignItems: "center",
                            margin: "max(50vh, 10rem) auto",
                            transform: "translateY(-50%)",
                            maxWidth: "23rem",
                          }}
                        >
                          <Flex
                            sx={{
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            <Text as="h2">Beneficiary</Text>
                            {/* <NextImage src={crossIcon} width='30px' height='30px' alt='back' onClick={() => setIsScanningBeneficiaryQr(false)}/> */}
                          </Flex>
                          <Box mt="2rem" sx={{ maxWidth: "100%" }}>
                            <QrScanner onResult={onBeneficiaryQrScanResult} />
                          </Box>
                          {scannedBeneficiaryAddress && (
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
                          )}
                        </Flex>
                      </Container>
                    </Portal>
                  )}
                </Box>
                <Box ml="2rem">
                  <Tooltip />
                </Box>
              </Flex>
              <Box mt="2rem">
                <FileUploader
                  subtitle="add poster"
                  onChange={(files) => setEventPosterImageFile(files[0])}
                  config={{
                    maxFiles: 1,
                    accept: { "image/*": [], "video/*": [] },
                  }}
                />
              </Box>
              <Button
                onClick={beforeEventCreation}
                mt="4rem"
                variant="accent"
                sx={{ alignSelf: "flex-end" }}
              >
                <Flex sx={{ alignItems: "center" }}>next</Flex>
              </Button>
            </>
          ),
          [EventCreationStages.rewardConfig]: (
            <>
              <NavigateBack href="#createEvent">to event</NavigateBack>
              <Flex
                mt="2rem"
                sx={{ alignItems: "center", justifyContent: "space-between" }}
              >
                <Text as="h2">Participation Rewards</Text>
                <Button variant="accentSmall" onClick={beforeEventCreation}>
                  skip
                </Button>
              </Flex>
              <Flex mt="3rem" sx={{ flexDirection: "column" }}>
                {/* <Flex mt='3rem'>
                            <Flex sx={{alignItems: 'center', flex: 1}}>
                                <Switch value={+isUpgradableEventReward} checked={isUpgradableEventReward} id="isUpgradableEventReward" onChange={() => setIsUpgradableEventReward(!isUpgradableEventReward)} />
                                <Label htmlFor="isUpgradableEventReward" variant='forms.label.switch'>
                                    upgradable NFTs
                                </Label>
                            </Flex>
                            <Tooltip />
                        </Flex> */}
                <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
                  <Flex>
                    <Text mr="1rem">how to upload nft files</Text>
                    <Tooltip />
                  </Flex>
                  <Box mt="2rem">
                    {/* <FileUploader
                      onChange={onNFTFilesUpload}
                      subtitle="add NFT files"
                    /> */}
                  </Box>
                  {/* <Text mt='2rem' variant='hint'>
                                file structure primer
                            </Text>
                            <Container mt='.5rem' variant='layout.container.image' sx={{width: '15rem'}}>
                                <NextImage src={isUpgradableEventReward ? upgradableEventRewardImage : simpleEventRewardImage} objectFit='cover' />
                            </Container> */}
                  <Button
                    onClick={beforeEventCreation}
                    mt="4rem"
                    variant="accent"
                    sx={{ alignSelf: "center" }}
                  >
                    complete
                  </Button>
                </Flex>
              </Flex>
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
        }[currentEventCreationStage]
      }
    </Flex>
  );
};

const ContainerPopup: React.FC<{
  onOutsideClick?: Function;
  sx?: ThemeUIStyleObject;
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
