import React, { useRef, useState, useEffect, ReactElement } from "react";
import {
  Flex,
  Box,
  Button,
  Label,
  Input,
  Text,
  Container,
  Textarea,
  Switch,
  Spinner,
  SxProp,
  ThemeUIStyleObject,
  Link,
} from "theme-ui";
import {
  NavigateBack,
  Tooltip,
  Field,
  LocationPicker,
  TimespanPicker,
  FileUploader,
} from "@components/indexx";
import {
  useDebounce,
  handleOnMouseDown,
  formatWalletAddress,
  useAppSelector,
} from "helpers/hooks";
import OutsideClickHandler from "react-outside-click-handler";
import { BigNumber, ethers, FixedNumber } from "ethers";
import NextImage from "next/image";
import { Location } from "./ui/locationPicker";
import { Timespan } from "./ui/timespanPicker";
import { Portal } from "react-portal";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { setEvent as setEventAction } from "features/eventForm/eventFormSlice";
import { useAppDispatch } from "helpers/hooks";
import { getEvents, getNativeCurrencyToUsdPrice } from "helpers/contract";

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

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [currentEventCreationStage, setcurrentEventCreationStage] =
    useState<EventCreationStages>(EventCreationStages.eventConfig);
  const [fieldModalInFocus, setFieldModalInFocus] = useState<FieldModalIds>();

  const eventFormData = useAppSelector((state) => state.eventForm);

  const [ticketPriceInNativeCurrency, setTicketPriceInNativeCurrency] = useState<string>();

  const debouncedTicketPrice = useDebounce(eventFormData.ticketPrice, 4000);

  const [ticketEventTitle, setTicketEventTitle] = useState<string>();
  const [ticketEventImageResult, setTicketEventImageResult] = useState<{
    eventTitle: string;
    image: string;
  }>();
  const [priceFieldSubtitle, setPriceFieldSubtitle] = useState<
    string | ReactElement
  >();

  const [isScanningBeneficiaryQr, setIsScanningBeneficiaryQr] = useState(false);
  const [scannedBeneficiaryAddress, setScannedBeneficiaryAddress] =
    useState("");
  const [eventPoster, setEventPoster] = useState<File>();
  const { data: nativeCurrencyToUsdPriceData } = getNativeCurrencyToUsdPrice()
  // const { data, isLoading, isError } = getEvents(BigNumber.from(0));

  useEffect(() => {
    // init()
  }, [])

  useEffect(() => {
    eventFormData.isFreeTicketPrice && setPriceFieldSubtitle("FREE");
  }, [eventFormData.isFreeTicketPrice]);

  useEffect(() => {
    nativeCurrencyToUsdPriceData?.length && setTicketPriceInNativeCurrency(nativeCurrencyToUsdPriceData[0]);
  }, [nativeCurrencyToUsdPriceData])

  useEffect(() => {
    setPriceFieldSubtitle(
      eventFormData.isFreeTicketPrice ? (
        "FREE"
      ) : eventFormData.ticketPrice && ticketPriceInNativeCurrency ? (
        `~${(eventFormData.ticketPrice * +ticketPriceInNativeCurrency).toFixed(
          2
        )} MATIC`
      ) : eventFormData.ticketPrice && !ticketPriceInNativeCurrency ? (
        <Spinner size={".75rem"} />
      ) : (
        "0 MATIC"
      )
    );
  }, [
    ticketPriceInNativeCurrency,
    eventFormData.ticketPrice,
    eventFormData.isFreeTicketPrice,
  ]);

  useEffect(() => {
    !eventFormData.isFreeTicketPrice &&
      debouncedTicketPrice &&
      nativeCurrencyToUsdPrice &&
      setTicketPriceInNativeCurrency(ethers.utils.formatUnits(nativeCurrencyToUsdPrice, 8).toString())
  }, [eventFormData.isFreeTicketPrice, debouncedTicketPrice]);

  // useEffect(() => {
  //   currentEventCreationStage == EventCreationStages.creatingEvent &&
  //     eventTitle == ticketEventImageResult?.eventTitle &&
  //     createEvent();
  // }, [currentEventCreationStage, eventTitle, ticketEventImageResult]);

  const setEvent = (data: Partial<typeof eventFormData>) => {
    dispatch(setEventAction({ ...eventFormData, ...data }));
  };

  // const onFieldBlur = (): void => {
  //   setFieldModalInFocus(undefined);
  // };

  // const onQrScanResult = (result: string): void => {
  //   setScannedBeneficiaryAddress(result);
  // };

  // const toggleActiveDialog = (fieldId: FieldModalIds): void => {
  //   setTimeout(() =>
  //     setFieldModalInFocus(fieldModalInFocus === fieldId ? undefined : fieldId)
  //   );
  // };

  // const prepareNFTFilesForMoralis = (files: Array<File>): Array<{path: string, content: string}> =>
  //     files.map((file, fileIndex) => ({
  //         path: `tickero/${eventNonce}/${file.name}`,
  //         content: file.text
  //     }))

  // const uploadNFTFiles = (files: Array<File>): Promise<any> =>
  //   web3APIProvider.uploadEventNFTFolder(files);

  // const onNFTFilesUpload = (files: Array<File>): void => {
  //   files.length && validateNFTFiles(files) && uploadNFTFiles;
  // };

  // const validateNFTFiles = (files: Array<File>): true | string => true;

  // const validateEventForm = (): true | string =>
  //   (!beneficiary && "Add event description") ||
  //   (!eventTitle && !eventDescription && "Add event description") ||
  //   (!ticketPrice &&
  //     !isFreeTicketPrice &&
  //     "Add ticket or subscription price") ||
  //   true;

  // const goToEventRewardsStage = (): void => {
  //   let errorMessage = validateEventForm();

  //   errorMessage === true ? beforeEventCreation() : alert(errorMessage);
  // };

  // const mbUploadEventPoster = async (eventPoster: File | undefined) =>
  //   (await eventPoster) &&
  //   web3APIProvider.uploadEventFiles({ files: [eventPoster] });

  // const uploadTicketImage = async (ticketImage: string) =>
  //   await web3APIProvider.uploadEventFiles({
  //     files: [{ base64: ticketImage }],
  //   });

  // const getEventMetadata = (): TickeroEventMetadata => ({
  //   name: eventTitle!,
  //   description: eventDescription,
  //   attributes: [
  //     (eventTimespan?.fromDate || eventTimespan?.fromTime) && {
  //       trait_type: "Event Start Date/Time",
  //       value: `
  //                   ${
  //                     eventTimespan.fromDate ? eventTimespan.fromDate + " " : ""
  //                   }
  //                   ${eventTimespan.fromTime ? eventTimespan.fromTime : ""}
  //                   `,
  //     },
  //     eventTimespan?.weekdays?.length && {
  //       trait_type: "Happens On Every",
  //       value: eventTimespan.weekdays
  //         .map((weekday) => weekday.title)
  //         .join(", "),
  //     },
  //     eventTimespan?.at && {
  //       trait_type: "Happens At",
  //       value: eventTimespan.at,
  //     },
  //     eventLocation && {
  //       trait_type: "Location",
  //       value: eventLocation,
  //     },
  //   ].filter(Boolean) as object[],
  // });

  // const uploadEventMetadata = (data: object): Promise<string> =>
  //   web3APIProvider.uploadEventFiles({
  //     files: [{ base64: Buffer.from(JSON.stringify(data)).toString("base64") }],
  //   });

  // const beforeEventCreation = () => {
  //   setcurrentEventCreationStage(EventCreationStages.creatingEvent);
  //   setTicketEventTitle(eventTitle);
  // };

  // const createEvent = async (): void => {
  //   const eventPosterUrl = await mbUploadEventPoster(eventPoster);
  //   const eventMetadata = getEventMetadata();

  //   const eventMetadataUrl = await uploadEventMetadata({
  //     ...eventMetadata,
  //     image: eventPosterUrl,
  //   });

  //   const ticketImageUrl = await uploadTicketImage(
  //     ticketEventImageResult!.image
  //   );

  //   const ticketMetadataUrl = await uploadEventMetadata({
  //     image: ticketImageUrl,
  //   });

  //   const eventTokenId = await web3APIProvider.createEvent({
  //     calldata: {
  //       payload: {
  //         ticketSupply: [Math.floor(+ticketSupply! || 0)],
  //         ticketPrice: [ethers.utils.parseEther(`${+ticketPrice! || 0}`)],
  //         beneficiary: beneficiary,
  //         managers: [beneficiary],
  //         params: [0],
  //         subscriptionDuration: [subscriptionDuration || 0],
  //         eventMetadataUri: eventMetadataUrl,
  //         ticketMetadataUri: [ticketMetadataUrl],
  //       },
  //     },
  //   });

  //   const response = await eventTokenId.wait();

  //   router.push(
  //     "/#event?id=" +
  //       response.events.filter(({ event }) => event == "EventCreated")[0]
  //         .args[0]
  //   );
  // };

  return (
    <Flex>
      {eventFormData.eventTitle}
      <button onClick={() => setEvent({ eventTitle: "" + Math.random() })}>
        set title
      </button>
      test
    </Flex>
  );
  //   <Flex
  //     sx={{
  //       flexDirection: "column",
  //       width: "22rem",
  //       margin: "31rem auto",
  //       transform: "translateY(-50%)",
  //     }}
  //   >
  //     <EventTicketImage
  //       eventTitle={ticketEventTitle}
  //       onImageGenerated={setTicketEventImageResult}
  //     />
  //     {
  //       {
  //         [EventCreationStages.eventConfig]: (
  //           <>
  //             <Text mt=".75em" as="h1">
  //               New Event
  //             </Text>
  //             {/* <Flex mt='3rem' sx={{flexDirection: 'column'}}>
  //                       <Flex sx={{alignItems: 'center', justifyContent: 'space-between'}}>
  //                           <Flex>
  //                               <Switch value={+isTestMode} checked={isTestMode} id="isTestMode" onChange={() => setIsTestMode(!isTestMode)} />
  //                               <Label htmlFor="isTestMode" variant='forms.label.switch' sx={{ whiteSpace: 'nowrap' }}>
  //                                   test for free
  //                               </Label>
  //                               <Text ml='1rem' variant='hint'>
  //                                   ({targetBlockchainLabel})
  //                               </Text>
  //                           </Flex>
  //                           <Box>
  //                               <Tooltip />
  //                           </Box>
  //                       </Flex>
  //                       {!!isTestMode &&
  //                           <Flex mt='1rem' sx={{justifyContent: 'center'}}>
  //                               <Link href='https://faucet.polygon.technology/' target='_blank'>
  //                                   <Button variant='accentSmall'>get free tokens</Button>
  //                               </Link>
  //                           </Flex>
  //                       }
  //                   </Flex> */}
  //             <Flex mt="2rem" sx={{ gap: "2rem" }}>
  //               <Box sx={{ position: "relative" }}>
  //                 <Field
  //                   variant="forms.input.dialog"
  //                   placeholder="description"
  //                   onMouseDown={(event) =>
  //                     handleOnMouseDown(event, () =>
  //                       toggleActiveDialog(FieldModalIds.description)
  //                     )
  //                   }
  //                   icon="✏️"
  //                   readOnly
  //                 />
  //                 {fieldModalInFocus == FieldModalIds.description && (
  //                   <ContainerPopup
  //                     onOutsideClick={() => setfieldModalInFocus(undefined)}
  //                   >
  //                     <Field
  //                       value={eventTitle}
  //                       autoFocus
  //                       variant="forms.input.dialogTransparent"
  //                       placeholder="title"
  //                       onChange={(event) =>
  //                         dispatch(setEventTitle(event.target.value))
  //                       }
  //                       sx={{ textAlign: "center" }}
  //                     />
  //                     <Textarea
  //                       value={eventDescription}
  //                       mt="1rem"
  //                       placeholder="description"
  //                       onChange={(event) =>
  //                         setEventDescription(event.target.value)
  //                       }
  //                     />
  //                   </ContainerPopup>
  //                 )}
  //               </Box>
  //               <Box sx={{ position: "relative" }}>
  //                 <Field
  //                   variant="forms.input.dialog"
  //                   placeholder="ticketing"
  //                   onMouseDown={(event) =>
  //                     handleOnMouseDown(event, () =>
  //                       toggleActiveDialog(FieldModalIds.ticketing)
  //                     )
  //                   }
  //                   icon="🎟"
  //                   readOnly
  //                 />
  //                 {fieldModalInFocus == FieldModalIds.ticketing && (
  //                   <ContainerPopup
  //                     onOutsideClick={() => setfieldModalInFocus(undefined)}
  //                     sx={{ right: 0 }}
  //                   >
  //                     <Flex sx={{ flexDirection: "column" }}>
  //                       <Flex mb="1rem" sx={{ alignItems: "center" }}>
  //                         <Text as="h2">Tickets</Text>
  //                         <Flex ml="1rem">
  //                           <Switch
  //                             value={+isInSubscriptionMode}
  //                             checked={isInSubscriptionMode}
  //                             id="isInSubscriptionMode"
  //                             onChange={() =>
  //                               setIsInSubscriptionMode(!isInSubscriptionMode)
  //                             }
  //                           />
  //                           <Label
  //                             htmlFor="isInSubscriptionMode"
  //                             variant="forms.label.switch"
  //                             sx={{ whiteSpace: "nowrap" }}
  //                           >
  //                             as subscription
  //                           </Label>
  //                         </Flex>
  //                       </Flex>
  //                       {!!isInSubscriptionMode && (
  //                         <Flex mb="1rem" sx={{ flexDirection: "column" }}>
  //                           <Flex sx={{ alignItems: "center", gap: "1rem" }}>
  //                             <Field
  //                               value={subscriptionDuration}
  //                               onChange={(event) =>
  //                                 setSubscriptionDuration(+event.target.value)
  //                               }
  //                               type="number"
  //                               variant="forms.input.dialogTransparent"
  //                               placeholder="duration"
  //                               disabled={!!isIndefiniteSubscription}
  //                               autoFocus
  //                               sx={{ width: "7rem" }}
  //                             />
  //                             <Flex>
  //                               <Switch
  //                                 value={+isIndefiniteSubscription}
  //                                 checked={isIndefiniteSubscription}
  //                                 id="isIndefiniteSubscription"
  //                                 onChange={() =>
  //                                   setIsIndefiniteSubscription(
  //                                     !isIndefiniteSubscription
  //                                   )
  //                                 }
  //                               />
  //                               <Label
  //                                 htmlFor="isIndefiniteSubscription"
  //                                 variant="forms.label.switch"
  //                               >
  //                                 indefinite
  //                               </Label>
  //                             </Flex>
  //                           </Flex>
  //                           <Flex
  //                             mt=".25rem"
  //                             pr=".25rem"
  //                             sx={{
  //                               alignContent: "flex-end",
  //                               width: "7rem",
  //                               justifyContent: "flex-end",
  //                             }}
  //                           >
  //                             <Text variant="fieldSubtitle">in days</Text>
  //                           </Flex>
  //                         </Flex>
  //                       )}
  //                       <Flex sx={{ alignItems: "center", gap: "1rem" }}>
  //                         <Field
  //                           value={ticketSupply}
  //                           onChange={(event) =>
  //                             setTicketSupply(+event.target.value)
  //                           }
  //                           variant="forms.input.dialogTransparent"
  //                           placeholder="supply"
  //                           disabled={!!isUnlimitedTicketSupply}
  //                           autoFocus
  //                           sx={{ width: "7rem" }}
  //                         />
  //                         <Flex sx={{ alignItems: "center" }}>
  //                           <Switch
  //                             value={+isUnlimitedTicketSupply}
  //                             checked={isUnlimitedTicketSupply}
  //                             id="isUnlimitedTicketSupply"
  //                             onChange={() =>
  //                               setIsUnlimitedTicketSupply(
  //                                 !isUnlimitedTicketSupply
  //                               )
  //                             }
  //                           />
  //                           <Label
  //                             htmlFor="isUnlimitedTicketSupply"
  //                             variant="forms.label.switch"
  //                           >
  //                             unlimited
  //                           </Label>
  //                         </Flex>
  //                       </Flex>
  //                       <Flex mt="1rem" sx={{ alignItems: "center" }}>
  //                         <Flex sx={{ flexDirection: "column" }}>
  //                           <Flex sx={{ alignItems: "center", gap: "1rem" }}>
  //                             <Field
  //                               value={ticketPrice}
  //                               type="number"
  //                               variant="forms.input.dialogTransparent"
  //                               placeholder="price"
  //                               disabled={!!isFreeTicketPrice}
  //                               onChange={(event) =>
  //                                 setTicketPrice(+event.target.value)
  //                               }
  //                               postfix="$"
  //                               sx={{ width: "7rem" }}
  //                             />
  //                             <Flex>
  //                               <Switch
  //                                 value={+isFreeTicketPrice}
  //                                 checked={isFreeTicketPrice}
  //                                 id="isFreeTicketPrice"
  //                                 onChange={() =>
  //                                   setIsFreeTicketPrice(!isFreeTicketPrice)
  //                                 }
  //                               />
  //                               <Label
  //                                 htmlFor="isFreeTicketPrice"
  //                                 variant="forms.label.switch"
  //                               >
  //                                 free
  //                               </Label>
  //                             </Flex>
  //                           </Flex>
  //                           <Flex
  //                             mt=".25rem"
  //                             pr=".25rem"
  //                             sx={{
  //                               alignContent: "flex-end",
  //                               width: "7rem",
  //                               justifyContent: "flex-end",
  //                             }}
  //                           >
  //                             <Text variant="fieldSubtitle">
  //                               {priceFieldSubtitle}
  //                             </Text>
  //                           </Flex>
  //                         </Flex>
  //                       </Flex>
  //                     </Flex>
  //                   </ContainerPopup>
  //                 )}
  //               </Box>
  //             </Flex>
  //             <Flex mt="2rem" sx={{ gap: "2rem" }}>
  //               <LocationPicker
  //                 value={eventLocation}
  //                 onChange={(location) => setEventLocation(location)}
  //               />
  //               <TimespanPicker
  //                 value={eventTimespan}
  //                 onChange={setEventTimespan}
  //               />
  //             </Flex>
  //             <Flex mt="2rem" sx={{ alignItems: "center" }}>
  //               <Box sx={{ flex: 1, position: "relative" }}>
  //                 <Field
  //                   variant="forms.input.dialog"
  //                   value={beneficiary}
  //                   placeholder="beneficiary"
  //                   onChange={(event) => setBeneficiary(event.target.value)}
  //                   onBlur={() => onFieldBlur()}
  //                   onFocus={() => setfieldModalInFocus(FieldModalIds.beneficiary)}
  //                   icon="👛"
  //                 />
  //                 {fieldModalInFocus == FieldModalIds.beneficiary && (
  //                   <ContainerPopup
  //                     variant="layout.container.popupTransparent"
  //                     onOutsideClick={() => setfieldModalInFocus(undefined)}
  //                     sx={{ left: 0 }}
  //                   >
  //                     <Flex sx={{ gap: "1rem" }}>
  //                       <Button
  //                         variant="fieldDialog"
  //                         onMouseDown={(event) =>
  //                           handleOnMouseDown(event, () =>
  //                             setBeneficiary(web3APIProvider.getEthAddress())
  //                           )
  //                         }
  //                       >
  //                         <Flex
  //                           sx={{
  //                             flexDirection: "column",
  //                             alignItems: "flex-start",
  //                           }}
  //                         >
  //                           <Text>me</Text>
  //                         </Flex>
  //                       </Button>
  //                       <Button
  //                         variant="fieldDialog"
  //                         onMouseDown={(event) =>
  //                           handleOnMouseDown(event, () =>
  //                             setIsScanningBeneficiaryQr(true)
  //                           )
  //                         }
  //                       >
  //                         <Flex sx={{ flexDirection: "column" }}>
  //                           {/* <NextImage src={cameraIcon} width='30px' height='30px' alt='camera icon' /> */}
  //                           <Text
  //                             variant="secondary"
  //                             mt=".25rem"
  //                             sx={{ fontSize: ".75rem" }}
  //                           >
  //                             scan QR
  //                           </Text>
  //                         </Flex>
  //                       </Button>
  //                     </Flex>
  //                   </ContainerPopup>
  //                 )}
  //                 {isScanningBeneficiaryQr && (
  //                   <Portal>
  //                     <Container variant="layout.container.modalBackground">
  //                       <Flex
  //                         sx={{
  //                           flexDirection: "column",
  //                           alignItems: "center",
  //                           margin: "max(50vh, 10rem) auto",
  //                           transform: "translateY(-50%)",
  //                           maxWidth: "23rem",
  //                         }}
  //                       >
  //                         <Flex
  //                           sx={{
  //                             alignItems: "center",
  //                             justifyContent: "space-between",
  //                             width: "100%",
  //                           }}
  //                         >
  //                           <Text as="h2">Beneficiary</Text>
  //                           {/* <NextImage src={crossIcon} width='30px' height='30px' alt='back' onClick={() => setIsScanningBeneficiaryQr(false)}/> */}
  //                         </Flex>
  //                         <Box mt="2rem" sx={{ maxWidth: "100%" }}>
  //                           <QrScanner onResult={onQrScanResult} />
  //                         </Box>
  //                         {scannedBeneficiaryAddress && (
  //                           <Button
  //                             variant="accent"
  //                             mt="2rem"
  //                             onClick={() => (
  //                               setBeneficiary(scannedBeneficiaryAddress),
  //                               setIsScanningBeneficiaryQr(false)
  //                             )}
  //                           >
  //                             set the beneficiary
  //                           </Button>
  //                         )}
  //                       </Flex>
  //                     </Container>
  //                   </Portal>
  //                 )}
  //               </Box>
  //               <Box ml="2rem">
  //                 <Tooltip />
  //               </Box>
  //             </Flex>
  //             <Box mt="2rem">
  //               <FileUploader
  //                 subtitle="add poster"
  //                 onChange={(files) => setEventPoster(files[0])}
  //                 config={{
  //                   maxFiles: 1,
  //                   accept: { "image/*": [], "video/*": [] },
  //                 }}
  //               />
  //             </Box>
  //             <Button
  //               onClick={goToEventRewardsStage}
  //               mt="4rem"
  //               variant="accent"
  //               sx={{ alignSelf: "flex-end" }}
  //             >
  //               <Flex sx={{ alignItems: "center" }}>
  //                 next
  //                 <Box ml="1rem" sx={{ transform: "rotate(180deg)" }}>
  //                   {/* <NextImage width='30px' height='30px' src={arrowBackSvg} /> */}
  //                 </Box>
  //               </Flex>
  //             </Button>
  //           </>
  //         ),
  //         [EventCreationStages.rewardConfig]: (
  //           <>
  //             <NavigateBack href="#createEvent">to event</NavigateBack>
  //             <Flex
  //               mt="2rem"
  //               sx={{ alignItems: "center", justifyContent: "space-between" }}
  //             >
  //               <Text as="h2">Participation Rewards</Text>
  //               <Button variant="accentSmall" onClick={beforeEventCreation}>
  //                 skip
  //               </Button>
  //             </Flex>
  //             <Flex mt="3rem" sx={{ flexDirection: "column" }}>
  //               {/* <Flex mt='3rem'>
  //                           <Flex sx={{alignItems: 'center', flex: 1}}>
  //                               <Switch value={+isUpgradableEventReward} checked={isUpgradableEventReward} id="isUpgradableEventReward" onChange={() => setIsUpgradableEventReward(!isUpgradableEventReward)} />
  //                               <Label htmlFor="isUpgradableEventReward" variant='forms.label.switch'>
  //                                   upgradable NFTs
  //                               </Label>
  //                           </Flex>
  //                           <Tooltip />
  //                       </Flex> */}
  //               <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
  //                 <Flex>
  //                   <Text mr="1rem">how to upload nft files</Text>
  //                   <Tooltip />
  //                 </Flex>
  //                 <Box mt="2rem">
  //                   <FileUploader
  //                     onChange={onNFTFilesUpload}
  //                     subtitle="add NFT files"
  //                   />
  //                 </Box>
  //                 {/* <Text mt='2rem' variant='hint'>
  //                               file structure primer
  //                           </Text>
  //                           <Container mt='.5rem' variant='layout.container.image' sx={{width: '15rem'}}>
  //                               <NextImage src={isUpgradableEventReward ? upgradableEventRewardImage : simpleEventRewardImage} objectFit='cover' />
  //                           </Container> */}
  //                 <Button
  //                   onClick={beforeEventCreation}
  //                   mt="4rem"
  //                   variant="accent"
  //                   sx={{ alignSelf: "center" }}
  //                 >
  //                   complete
  //                 </Button>
  //               </Flex>
  //             </Flex>
  //           </>
  //         ),
  //         [EventCreationStages.creatingEvent]: (
  //           <>
  //             <Flex
  //               sx={{
  //                 flexDirection: "column",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //               }}
  //             >
  //               <Spinner />
  //               <Text mt="2rem" as="h2">
  //                 creating the event
  //               </Text>
  //               <Text mt="1rem" variant="hint">
  //                 might take a minute
  //               </Text>
  //             </Flex>
  //           </>
  //         ),
  //       }[currentEventCreationStage]
  //     }
  //   </Flex>
  // );
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
