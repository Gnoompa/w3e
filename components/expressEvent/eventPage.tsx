import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Image,
  Skeleton,
  Text,
  useColorMode,
  Link,
  Box,
  Icon,
  Modal,
  ModalContent,
  CloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  Search2Icon,
  SearchIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import LensIcon from "public/icons/lens";
import { useAccount, useSignMessage } from "wagmi";
import { useProfiles as useCCProfiles } from "./cc/profile";
import {
  getProfileExternalLink,
  useProfiles as useLensProfiles,
} from "./lens/profile";
import TicketIcon from "public/icons/brandTicket";
import { useAuth as useLensAuth } from "./lens/auth";
import { useAuth as useCCAuth } from "./cc/auth";
import { useModal } from "connectkit";
import { ExpressEventMetadata, ProfileType } from "./types";
import { AnimatePresence, motion } from "framer-motion";
import { getIPFSUri, useRouterQuery } from "helpers/hooks";
import { useRouter } from "next/router";
import BrandTicket from "public/icons/brandTicket";
import { Routes } from "helpers/routes";
import { usePost as useLensPost } from "./lens/post";
import {
  profileTypeToExternalLinkMap,
  profileTypeToStylesMap,
} from "./constants";
import QRCode from "qrcode.react";
import QrScanner from "@components/ui/qrScanner";
import { ethers } from "ethers";

export const EventPage: React.FC = (): JSX.Element => {
  const { setColorMode } = useColorMode();
  const { address: connectedAddress } = useAccount();
  const { setOpen: setOpenWalletConnectModal } = useModal();
  const router = useRouter();
  const queryEventId = useRouterQuery(router).id;
  const [eventMetadata, setEventMetadata] = useState<ExpressEventMetadata>();

  // Lens
  const { isAuthed: isLensAuthed, auth: lensAuth } =
    useLensAuth(connectedAddress);
  const { post: lensPost } = useLensPost({
    profile: eventMetadata?.profiles.filter(
      ({ type }) => type == ProfileType.LENS
    )[0],
    eventMetadataId: queryEventId,
  });
  const { profiles: lensProfiles, defaultProfile: lensDefaultProfile } =
    useLensProfiles({
      address: connectedAddress,
    });

  // CyberConnect
  const { isAuthed: isCCAuthed, auth: CCAuth } = useCCAuth(connectedAddress);
  const { profiles: CCProfiles, defaultProfile: CCDefaultProfile } =
    useCCProfiles({
      address: connectedAddress,
    });

  const ticketMessageToSign =
    "Sign this message to show your ticket. It is free";
  const {
    data: signedTicketData,
    isError: signTicketError,
    isLoading: signTicketLoading,
    isSuccess: signTicketSuccess,
    signMessage: signTicketMessage,
  } = useSignMessage({
    message: ticketMessageToSign,
  });

  const profileTypeToPostMap = {
    [ProfileType.LENS]: lensPost,
  };

  const processingStages = {
    signing: {
      id: 0,
      label: "Preparing",
      subtitle: "Please, sign",
      bg: "rgba(32, 32, 32, 1)",
      color: "var(--chakra-colors-text)",
      icon: BrandTicket,
    },
  } as {
    [key: string | number]: {
      id: string | number;
      label: string;
      subtitle: string;
      bg: string;
      color: string;
      icon: React.FC;
    };
  };

  const ticketTypes = {
    basic: {
      title: "Basic",
      icon: () => BrandTicket,
    },
    vip: {
      title: "VIP",
      icon: () => BrandTicket,
    },
    invalid: {
      title: "Invalid",
      icon: (props) => (
        <WarningTwoIcon {...props} color={"#e91e63 !important"} />
      ),
    },
    processing: {
      title: "Validating",
      icon: (props) => (
        <Search2Icon
          {...props}
          w="6rem"
          h="6rem"
          mt={"-2rem"}
          pr={"1.75rem"}
          color={"#fff"}
        />
      ),
    },
  };

  const [activeProcessingStageId, setActiveProcessingStageId] =
    useState<number>();
  const [activeProcessingStages, setActiveProcessingStages] =
    useState<typeof processingStages["signing"][]>();

  const [ticketQrData, setTicketQrData] = useState<any>();
  const [scannedTicketData, setScannedTicketData] = useState<string>();
  const [scannedTicket, setScannedTicket] = useState<object>();
  const scannedTicketCleanupTimeout = useRef(0);
  const [isValidatingTicket, setIsValidatingTicket] = useState<boolean>(false);
  const [isUserMediaAvailable, setIsUserMediaAvailable] =
    useState<boolean>(true);

  useEffect(() => {
    setColorMode("dark");
  }, []);

  useEffect(() => {
    queryEventId && getEventMetadata();
  }, [queryEventId]);

  useEffect(() => {
    activeProcessingStageId === 0 &&
      connectedAddress &&
      !signTicketLoading &&
      !signTicketSuccess &&
      showTicket();
  }, [connectedAddress, activeProcessingStageId]);

  useEffect(() => {
    signedTicketData && setTicketQrData(signedTicketData);
  }, [signedTicketData]);

  useEffect(() => {
    !isValidatingTicket &&
      (setTicketQrData(undefined), setScannedTicket(undefined));
  }, [isValidatingTicket]);

  useEffect(() => {
    try {
      if (
        scannedTicketData &&
        scannedTicket?.title !== ticketTypes.processing.title
      ) {
        const ticketOwnerAddress = ethers.utils.verifyMessage(
          ticketMessageToSign,
          scannedTicketData
        );

        ethers.utils.isAddress(ticketOwnerAddress)
          ? setScannedTicket(ticketTypes.processing)
          : setScannedTicket(ticketTypes.invalid);
      }
    } catch (e) {
      setScannedTicket(ticketTypes.invalid);
    }
  }, [scannedTicketData]);

  useEffect(() => {
    scannedTicket &&
      scannedTicket?.title !== ticketTypes.processing.title &&
      (clearTimeout(scannedTicketCleanupTimeout.current),
      (scannedTicketCleanupTimeout.current = setTimeout(
        () => setScannedTicket(undefined),
        3000
      )));
  }, [scannedTicket]);

  useEffect(() => {
    activeProcessingStageId === undefined && setTicketQrData(undefined);
  }, [activeProcessingStageId]);

  useEffect(() => {
    signTicketError &&
      activeProcessingStages?.length &&
      (setActiveProcessingStageId(activeProcessingStages?.length - 1),
      setTimeout(() => setActiveProcessingStageId(undefined), 3000));
  }, [signTicketError]);

  const getEventMetadata = () =>
    queryEventId &&
    fetch(getIPFSUri(`ipfs://${queryEventId}`))
      .then((res) => res.json())
      .then((json) => setEventMetadata(json));

  const showTicket = () => {
    setActiveProcessingStageId(0);

    connectedAddress
      ? (setActiveProcessingStages([
          processingStages.signing,
          {
            id: "error",
            label: "Oops",
            subtitle: "smth went wrong 😅",
            bg: "var(--chakra-colors-bg)",
            color: "var(--chakra-colors-text)",
            icon: (props) => (
              <WarningTwoIcon {...props} color={"#e91e63 !important"} />
            ),
          },
        ]),
        signTicketMessage())
      : setOpenWalletConnectModal(true);
  };

  return (
    <Flex
      flexDir={"column"}
      gap={"3rem"}
      mt={[0, 0, "1rem"]}
      px={["2rem", "2rem", 0]}
      w={["27rem"]}
      maxW={"100%"}
    >
      <Flex flexDir={"column"} gap={"1rem"}>
        <Flex flexDir={"column"}>
          <Heading as={"h2"} textTransform={"uppercase"} fontSize={"4xl"}>
            express
          </Heading>
          <Heading
            as={"h2"}
            textTransform={"uppercase"}
            fontSize={"xl"}
            lineHeight="1rem"
          >
            event
          </Heading>
        </Flex>
        <Heading
          as={"h3"}
          color="textContrastAccent"
          fontWeight={"medium"}
          fontSize={"lg"}
          textTransform={"lowercase"}
          _after={{ content: "'🎉'", px: ".5rem" }}
        >
          single post to host an event
        </Heading>
      </Flex>
      <Flex flexDir={"column"} gap="1rem" zIndex={1} width={"100%"}>
        <Flex flexDir={"column"} gap=".5rem" mb="1rem">
          <Skeleton isLoaded={!!eventMetadata} borderRadius={"sm"}>
            <Text fontWeight={"bold"} fontSize="3xl">
              {eventMetadata?.title || "event title"}
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!!eventMetadata} borderRadius={"sm"}>
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Text fontWeight={"semibold"} fontSize="lg">
                    event details
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text fontSize="lg">{eventMetadata?.details}</Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Skeleton>
        </Flex>
        <Flex gap="1rem">
          <Container
            as={motion.div}
            initial={"idle"}
            whileHover={"hover"}
            display={"flex"}
            pos={"relative"}
            overflow={"hidden"}
            flexDir={"column"}
            gap={".5rem"}
            bg={"accentPrimaryContrast"}
            borderRadius="sm"
            h={"7rem"}
            p="1rem 1.5rem"
            cursor={"pointer"}
            onClick={showTicket}
          >
            <Flex flexDir={"column"}>
              <Text fontWeight={"bold"} fontSize={"2xl"} lineHeight="1.15em">
                Show
              </Text>
              <Text fontWeight={"bold"} fontSize={"2xl"} lineHeight="1.15em">
                ticket
              </Text>
            </Flex>
            <motion.div
              style={{
                position: "absolute",
                bottom: "-1rem",
                right: "-1rem",
              }}
              variants={{ idle: { scale: 1 }, hover: { scale: 1.1 } }}
            >
              <BrandTicket width="5.5rem" height="5.5rem" />
            </motion.div>
          </Container>
          <Container
            as={motion.div}
            initial={"idle"}
            whileHover={"hover"}
            display={"flex"}
            pos={"relative"}
            overflow={"hidden"}
            flexDir={"column"}
            gap={".5rem"}
            bg={"accentPrimaryContrast"}
            borderRadius="sm"
            h={"7rem"}
            p="1rem 1.5rem"
            cursor={"pointer"}
            onClick={() => setIsValidatingTicket(true)}
          >
            <Flex flexDir={"column"}>
              <Text fontWeight={"bold"} fontSize={"2xl"} lineHeight="1.15em">
                Validate
              </Text>
              <Text fontWeight={"bold"} fontSize={"2xl"} lineHeight="1.15em">
                tickets
              </Text>
            </Flex>
            <motion.div
              style={{
                position: "absolute",
                bottom: "-1rem",
                right: "-1rem",
              }}
              variants={{ idle: { scale: 1 }, hover: { scale: 1.1 } }}
            >
              <Image src="/icons/qr.png" width="5.5rem" height="5.5rem" />
            </motion.div>
          </Container>
        </Flex>
        <Flex flexDir={"column"} gap=".5rem">
          <Text
            fontWeight={"bold"}
            color={"textContrastSecondary"}
            fontSize={"lg"}
          >
            Get tickets
          </Text>
          <Flex
            flexDir={"column"}
            gap={"1rem"}
            p=".5rem 1.5rem 1.5rem"
            bg={"accentPrimaryContrast"}
            overflow={"hidden"}
            borderRadius="sm"
          >
            <Container
              as={motion.div}
              initial={"idle"}
              whileHover={"hover"}
              display={"flex"}
              pos={"relative"}
              flexDir={"column"}
              gap={".5rem"}
            >
              <Flex flexDir={"column"} gap={"1rem"} mt=".5rem" mb=".5rem">
                <Flex flexDir={"column"} ml={"4.5rem"}>
                  <Text fontWeight={"bold"} fontSize={"2xl"}>
                    Basic
                  </Text>
                  <Text
                    fontWeight={"bold"}
                    opacity={0.7}
                    lineHeight={"1em"}
                    fontSize={"sm"}
                  >
                    FOLLOW ANY PROFILE
                  </Text>
                </Flex>
                {eventMetadata?.profiles?.length ? (
                  <Flex gap=".5rem" ml={"4.5rem"} w={"fit-content"}>
                    {eventMetadata?.profiles.map((profile) => (
                      <Link
                        href={profileTypeToExternalLinkMap[
                          profile.type
                        ].profile?.(profile.handle)}
                        target="_blank"
                      >
                        <Container
                          as={Flex}
                          alignItems={"center"}
                          gap={"1rem"}
                          bg={profileTypeToStylesMap[profile.type].bg}
                          p={".5rem 1rem"}
                          borderRadius={"sm"}
                          transition={".2s"}
                          _hover={{ opacity: 0.8 }}
                        >
                          {profileTypeToStylesMap[profile.type].icon({
                            width: "1.25rem",
                            height: "1.25rem",
                          })}
                          <ExternalLinkIcon
                            color={profileTypeToStylesMap[profile.type].color}
                          />
                        </Container>
                      </Link>
                    ))}
                  </Flex>
                ) : (
                  <Skeleton h={"2.25rem"} ml={"4.5rem"} />
                )}
                <motion.div
                  style={{
                    position: "absolute",
                    left: "-3.5rem",
                    top: ".5rem",
                  }}
                  variants={{ idle: { scale: 1 }, hover: { scale: 1.05 } }}
                >
                  <BrandTicket width="7rem" height="7rem" />
                </motion.div>
              </Flex>
            </Container>
            <Divider />
            <Container
              as={motion.div}
              initial={"idle"}
              whileHover={"hover"}
              display={"flex"}
              pos={"relative"}
              flexDir={"column"}
              gap={".5rem"}
            >
              <Flex flexDir={"column"} gap={"1rem"}>
                <Flex flexDir={"column"} ml={"4.5rem"}>
                  <Text fontWeight={"bold"} fontSize={"2xl"}>
                    VIP
                  </Text>
                  <Text
                    fontWeight={"bold"}
                    opacity={0.7}
                    lineHeight={"1em"}
                    fontSize={"sm"}
                  >
                    REPOST AND COLLECT ANY POST
                  </Text>
                </Flex>
                {eventMetadata?.profiles?.length ? (
                  <Flex gap=".5rem" ml={"4.5rem"} w={"fit-content"}>
                    {eventMetadata?.profiles
                      .filter(({ type }) => type !== ProfileType.CC)
                      .map((profile) => (
                        <Link
                          href={profileTypeToExternalLinkMap[
                            profile.type
                          ].post?.(profileTypeToPostMap[profile.type]?.id)}
                          target="_blank"
                        >
                          <Container
                            as={Flex}
                            alignItems={"center"}
                            gap={"1rem"}
                            bg={profileTypeToStylesMap[profile.type].bg}
                            p={".5rem 1rem"}
                            borderRadius={"sm"}
                            transition={".2s"}
                            _hover={{ opacity: 0.8 }}
                          >
                            {profileTypeToStylesMap[profile.type].icon({
                              width: "1.25rem",
                              height: "1.25rem",
                            })}
                            <ExternalLinkIcon
                              color={profileTypeToStylesMap[profile.type].color}
                            />
                          </Container>
                        </Link>
                      ))}
                  </Flex>
                ) : (
                  <Skeleton h={"2.25rem"} ml={"4.5rem"} />
                )}
                <motion.div
                  style={{
                    position: "absolute",
                    left: "-3.5rem",
                    top: "0rem",
                  }}
                  variants={{ idle: { scale: 1 }, hover: { scale: 1.05 } }}
                >
                  <BrandTicket
                    width="7rem"
                    height="7rem"
                    filter={"hue-rotate(270deg)"}
                  />
                </motion.div>
              </Flex>
            </Container>
          </Flex>
        </Flex>
        <Button
          variant={"accent"}
          borderRadius="sm"
          color={"text"}
          onClick={() => router.push(Routes.ExpressEvent)}
        >
          Host more events
        </Button>
      </Flex>
      <AnimatePresence>
        {connectedAddress &&
          activeProcessingStageId !== undefined &&
          activeProcessingStages &&
          activeProcessingStages[activeProcessingStageId] && (
            <Container
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              w={"100%"}
              h={"100%"}
              pos={"fixed"}
              bg={"#00000078"}
              backdropFilter={"blur(10px)"}
              top={0}
              left={0}
              zIndex={9999}
              overflow="hidden"
            >
              <AnimatePresence>
                <motion.div
                  key={activeProcessingStages[activeProcessingStageId]!.id}
                  variants={{
                    default: {
                      scale: 1,
                      x: "-50%",
                      y: "-50%",
                      opacity: 1,
                      marginTop: 0,
                    },
                    qrView: {
                      scale: 1,
                      x: "-50%",
                      y: "-50%",
                      width: "350px",
                      height: "350px",
                      background: "rgba(32, 32, 32, 0)",
                      marginTop: 0,
                      opacity: 1,
                      overflow: "initial",
                      transition: {
                        overflow: {
                          delay: 1,
                        },
                      },
                    },
                  }}
                  initial={{
                    scale: 0.7,
                    x: "-50%",
                    y: "-50%",
                    opacity: 0,
                    marginTop: "5rem",
                  }}
                  animate={ticketQrData ? "qrView" : "default"}
                  exit={{
                    scale: 0.7,
                    x: "-50%",
                    y: "-50%",
                    opacity: 0,
                    marginTop: "-5rem",
                  }}
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    height: "11rem",
                    width: "22.5rem",
                    padding: ".5rem 2rem",
                    color:
                      activeProcessingStages[activeProcessingStageId].color,
                    background:
                      activeProcessingStages[activeProcessingStageId].bg,
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <Flex alignItems={"center"} gap="1.5rem">
                    <motion.div
                      variants={{
                        default: { opacity: 1 },
                        qrView: { opacity: 0 },
                      }}
                    >
                      <Flex flexDir={"column"}>
                        <Text fontWeight={"bold"} fontSize="4xl">
                          {
                            activeProcessingStages[activeProcessingStageId]
                              .label
                          }
                        </Text>
                        <Text
                          fontWeight={"semibold"}
                          fontSize="xl"
                          lineHeight={".75em"}
                        >
                          {
                            activeProcessingStages[activeProcessingStageId]
                              .subtitle
                          }
                        </Text>
                      </Flex>
                    </motion.div>
                    <motion.div
                      style={{
                        width: "10rem",
                        height: "10rem",
                        position: "fixed",
                        right: "-2.5rem",
                        bottom: "-4rem",
                      }}
                      variants={{
                        qrView: {
                          top: "1rem",
                          left: "1rem",
                          y: "0",
                          width: "20rem",
                          height: "20rem",
                          transition: {
                            width: {
                              delay: 0.2,
                            },
                            height: {
                              delay: 0.2,
                            },
                          },
                        },
                        default: {
                          y: [-10, 0, -10],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                          },
                        },
                      }}
                    >
                      <Icon
                        w={"100%"}
                        h={"100%"}
                        as={
                          activeProcessingStages[activeProcessingStageId].icon
                        }
                      />

                      <AnimatePresence>
                        {ticketQrData && (
                          <motion.div
                            animate={{
                              opacity: 1,
                              transition: {
                                delay: 0.75,
                              },
                            }}
                            style={{
                              opacity: 0,
                              top: "4rem",
                              left: "4rem",
                              position: "fixed",
                            }}
                          >
                            <QRCode
                              renderAs="canvas"
                              size={190}
                              bgColor="transparent"
                              fgColor="#222"
                              value={ticketQrData}
                            />
                            <CloseButton
                              onClick={() =>
                                setActiveProcessingStageId(undefined)
                              }
                              color={"text"}
                              pos={"fixed"}
                              left={"50%"}
                              top={"22rem"}
                              fontSize={"2rem"}
                              transform={"translateX(-50%)"}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Flex>
                </motion.div>
              </AnimatePresence>
            </Container>
          )}
      </AnimatePresence>
      <AnimatePresence>
        {isValidatingTicket && (
          <Container
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            w={"100%"}
            h={"100%"}
            pos={"fixed"}
            bg={"#00000078"}
            backdropFilter={"blur(10px)"}
            top={0}
            left={0}
            zIndex={9999}
            overflow="hidden"
          >
            <Box
              w="22rem"
              pos={"fixed"}
              left={"50%"}
              top={"50%"}
              transform={"translate(-50%, -50%)"}
            >
              <Box display={isUserMediaAvailable ? "block" : "none"}>
                <QrScanner
                  showResult={false}
                  onResult={setScannedTicketData}
                  onError={(error) =>
                    setIsUserMediaAvailable(
                      error == "Camera not found." ? false : true
                    )
                  }
                />
              </Box>
              <AnimatePresence>
                {scannedTicket && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      height: "6rem",
                      marginTop: "2.5rem",
                      width: "15.5rem",
                      padding: ".5rem 2rem",
                      color: "var(--chakra-colors-text)",
                      background: "var(--chakra-colors-bg)",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <Text fontWeight={"semibold"} fontSize="3xl">
                      {scannedTicket.title}
                    </Text>
                    <motion.div
                      style={{
                        fontSize: "5rem",
                        width: "10rem",
                        height: "10rem",
                        position: "fixed",
                        right: "-6rem",
                        bottom: "-5rem",
                      }}
                      animate={{
                        y: [-10, 0, -10],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                        },
                      }}
                    >
                      {scannedTicket.icon()}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isUserMediaAvailable && (
                <Container
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    height: "11rem",
                    width: "22.5rem",
                    padding: ".5rem 2rem",
                    color: "var(--chakra-colors-text)",
                    background: "var(--chakra-colors-bg)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <Text fontWeight={"bold"} fontSize="3xl">
                    Turn on the camera
                  </Text>
                  <Text fontWeight={"semibold"} fontSize="xl">
                    to scan tickets
                  </Text>
                  <motion.div
                    style={{
                      fontSize: "5rem",
                      width: "10rem",
                      height: "10rem",
                      position: "fixed",
                      right: "-6rem",
                      bottom: "-5rem",
                    }}
                    animate={{
                      y: [-10, 0, -10],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                      },
                    }}
                  >
                    🫣
                  </motion.div>
                </Container>
              )}
            </Box>
            <CloseButton
              onClick={() => setIsValidatingTicket(false)}
              color={"text"}
              pos={"fixed"}
              left={"50%"}
              transform={"translateX(-50%)"}
              mt={"9rem"}
              top={"50%"}
              fontSize={"2rem"}
            />
          </Container>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default EventPage;
