import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  Input,
  Link,
  Select,
  Spinner,
  Switch,
  Text,
  Textarea,
  useColorMode,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  WarningIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import React, { useEffect, useMemo, useState } from "react";
import LensIcon from "public/icons/lens";
import CyberConnectIcon from "public/icons/cyberConnect";
import PublishIcon from "public/icons/publish";
import { useAccount } from "wagmi";
import { useProfiles as useCCProfiles } from "./expressEvent/cc/profile";
import { useProfiles as useLensProfiles } from "./expressEvent/lens/profile";
import { useAuth as useLensAuth } from "./expressEvent/lens/auth";
import { useAuth as useCCAuth } from "./expressEvent/cc/auth";
import { usePost as useLensPost } from "./expressEvent/lens/post";
import Snowfall from "react-snowfall";
import { useModal } from "connectkit";
import {
  ExpressEventConfig,
  ExpressEventMetadata,
  IProfile,
  PostHook,
  ProfileType,
} from "./expressEvent/types";
import { xor } from "lodash";
import TwitterIcon from "public/icons/twitter";
import TicketIcon from "public/icons/brandTicket";
import UsdcIcon from "public/icons/usdc";
import { motion, AnimatePresence } from "framer-motion";
import { getRouterQuery, uploadMetadata, useRouterQuery } from "helpers/hooks";
import { useRouter } from "next/router";
import { Routes } from "helpers/routes";
import dynamic from "next/dynamic";

const EventPage = dynamic(() => import("./expressEvent/eventPage"), {
  ssr: false,
});

// {profileId:"0x012c7d",contentURI:"https://arweave.net/y7zoJyuy1prGC5wNqAQzk4NWQELskw2YnOjiL3NfIRU",collectModule:"0x23b9467334bEb345aAa6fd1545538F3d54436e96",collectModuleInitData:"0x0000000000000000000000000000000000000000000000000000000000000000",referenceModule:"0x0000000000000000000000000000000000000000",referenceModuleInitData:"0x0"}

export const ExpressEvent: React.FC = (): JSX.Element => {
  const { setColorMode } = useColorMode();
  const router = useRouter();
  const queryEventId = useRouterQuery(router).id;
  const [eventId, setEventId] = useState<string>(queryEventId);
  const { address: connectedAddress } = useAccount();
  const { setOpen: setOpenWalletConnectModal } = useModal();
  const [eventProfiles, setEventProfiles] = useState<IProfile[]>();
  const [eventTitle, setEventTitle] = useState<string>();
  const [eventDetails, setEventDetails] = useState<string>();
  const [eventConfigId, setEventConfigId] = useState<string>();
  const postContent = `${eventTitle || "Express Event"}\n\n${
    eventDetails || "Single post to host an event 🎉"
  }`;
  const [postPayload, setPostPayload] = useState<Parameters<PostHook>[0]>();

  useEffect(() => {
    setEventId(getRouterQuery(router.asPath).id);

    eventId &&
      eventId !== queryEventId &&
      router.push(`${Routes.ExpressEvent}?id=${eventId}`);
  }, [eventId, router.query]);

  useEffect(() => {
    setPostPayload({ ...postPayload, content: postContent });
  }, [postContent]);

  // Lens
  const { isAuthed: isLensAuthed, auth: lensAuth } =
    useLensAuth(connectedAddress);
  const { profiles: lensProfiles, defaultProfile: lensDefaultProfile } =
    useLensProfiles({
      address: connectedAddress,
    });
  const {
    send: lensPost,
    response: lensPostResponse,
    error: lensPostData,
    status: lensPostStatus,
  } = useLensPost({ ...postPayload, profile: lensDefaultProfile });

  // CyberConnect
  const { isAuthed: isCCAuthed, auth: CCAuth } = useCCAuth(connectedAddress);
  const { profiles: CCProfiles, defaultProfile: CCDefaultProfile } =
    useCCProfiles({
      address: connectedAddress,
    });

  const canCompleteEventCreation = eventProfiles?.length;
  const [eventProcessingStageId, setEventProcessingStageId] =
    useState<number>();
  const [eventProcessingStages, setEventProcessingStages] =
    useState<typeof profileTypeToEventProcessingStage[ProfileType.LENS][]>();
  const profileTypeToEventProcessingStage = {
    [ProfileType.LENS]: {
      id: ProfileType.LENS,
      label: "Processing",
      subtitle: "Lens",
      bg: "var(--chakra-colors-lensGradient)",
      color: "var(--chakra-colors-lensText)",
      icon: LensIcon,
      process: lensPost,
      // isComplete: true,
      // process: (configId) => {},
      isComplete: lensPostStatus == "success",
    },
    [ProfileType.CC]: {
      id: ProfileType.CC,
      label: "Processing",
      subtitle: "CyberConnect",
      bg: "var(--chakra-colors-cyberConnectGradient)",
      color: "#222",
      icon: CyberConnectIcon,
      process: (configId) => {},
      isComplete: true,
    },
    [ProfileType.TWITTER]: {
      id: ProfileType.CC,
      label: "Processing",
      subtitle: "CyberConnect",
      bg: "var(--chakra-colors-cyberConnectGradient)",
      color: "#222",
      icon: CyberConnectIcon,
      process: (configId) => {},
      isComplete: true,
    },
  } as {
    [key in ProfileType]: {
      id: number;
      label: string;
      subtitle: string;
      bg: string;
      color: string;
      icon: React.FC;
      process: (configId: string) => any;
      isComplete: boolean;
    };
  };

  const finalEventProcessingStage = {
    id: "final",
    label: "All done",
    subtitle: "enjoy 😊",
    bg: "var(--chakra-colors-bg)",
    color: "var(--chakra-colors-text)",
    icon: TicketIcon,
    isComplete: true,
    process: (eventConfigId) =>
      setTimeout(
        () => (
          setEventProcessingStageId(undefined),
          router.push(`${Routes.ExpressEvent}?id=${eventConfigId}`),
          setEventTitle(""),
          setEventDetails(""),
          setEventConfigId(undefined)
        ),
        2000
      ),
  };

  const faultyEventProcessingStage = {
    id: "error",
    label: "Oops",
    subtitle: "smth went wrong 😅",
    bg: "var(--chakra-colors-bg)",
    color: "var(--chakra-colors-text)",
    icon: (props) => (
      <WarningTwoIcon
        {...props}
        color={"#e91e63 !important"}
        transform={"scale(12)!important"}
      />
    ),
    isComplete: true,
    process: () =>
      setTimeout(
        () => (
          setEventProcessingStageId(undefined), setEventConfigId(undefined)
        ),
        3000
      ),
  };

  const publishingProfileTypes = [
    {
      type: ProfileType.LENS,
      requiresWalletConnection: true,
      externalLink: "https://www.lens.xyz/",
      label: "Lens",
      icon: LensIcon,
      bg: "lensGradient",
      color: "lensText",
      defaultProfile: lensDefaultProfile,
      profiles: lensProfiles,
      auth: lensAuth,
      isAuthed: isLensAuthed,
    },
    {
      type: ProfileType.CC,
      requiresWalletConnection: true,
      externalLink: "https://cyberconnect.me/",
      label: "CyberConnect",
      subtitle: "for followers only",
      icon: CyberConnectIcon,
      bg: "cyberConnectGradient",
      color: "#222",
      defaultProfile: CCDefaultProfile,
      profiles: CCProfiles,
      auth: CCAuth,
      isAuthed: isCCAuthed,
    },
    {
      type: ProfileType.TWITTER,
      requiresWalletConnection: false,
      externalLink: "https://twitter.com/",
      label: "Twitter",
      subtitle: "soon",
      icon: (props) => <TwitterIcon {...props} fill={"#fff"} />,
      bg: "twitterGradient",
      color: "#fff",
      defaultProfile: { handle: "Twitter" },
      profiles: [],
      auth: CCAuth,
      isAuthed: false,
    },
  ] as {
    type: ProfileType;
    requiresWalletConnection?: boolean;
    externalLink: string;
    label: string;
    subtitle?: string;
    icon: React.FC;
    bg: string;
    color: string;
    defaultProfile: IProfile | undefined;
    profiles: IProfile[] | undefined;
    auth: () => void;
    isAuthed: boolean;
  }[];

  const defaultProfiles = useMemo(
    () =>
      ((defaultProfiles) =>
        defaultProfiles.length ? defaultProfiles : undefined)(
        [lensDefaultProfile, CCDefaultProfile].filter(Boolean)
      ) as IProfile[] | undefined,
    [lensProfiles, CCProfiles]
  );

  useEffect(() => {
    setColorMode("dark");
  }, []);

  useEffect(() => {
    lensDefaultProfile &&
      isLensAuthed &&
      setEventProfiles(
        [...(eventProfiles || []), lensDefaultProfile].filter(Boolean)
      );
  }, [isLensAuthed, lensDefaultProfile]);

  useEffect(() => {
    isCCAuthed &&
      setEventProfiles(
        [...(eventProfiles || []), CCDefaultProfile].filter(Boolean)
      );
  }, [isCCAuthed]);

  useEffect(() => {
    eventProcessingStages &&
      eventProcessingStages[eventProcessingStageId]?.id == ProfileType.LENS &&
      (lensPostStatus == "success" &&
        setEventProcessingStageId(eventProcessingStageId + 1),
      lensPostStatus == "error" &&
        setEventProcessingStageId(eventProcessingStages.length - 1));
  }, [lensPostStatus, eventProcessingStages, eventProcessingStageId]);

  useEffect(() => {
    eventConfigId &&
      eventProcessingStageId !== undefined &&
      eventProcessingStages &&
      (eventProcessingStages[eventProcessingStageId]?.isComplete &&
      eventProcessingStages[eventProcessingStageId + 2]
        ? setTimeout(
            () => setEventProcessingStageId(eventProcessingStageId + 1),
            2500
          )
        : eventProcessingStages![eventProcessingStageId!]?.process(
            eventConfigId!
          ));
  }, [eventProcessingStageId, eventConfigId]);

  const getEventConfigId = async () =>
    (
      await uploadMetadata({
        v: "0.1",
        profiles: eventProfiles,
        title: eventTitle || "Express Event",
        details: eventDetails || "Single post to host an event 🎉",
      } as ExpressEventMetadata)
    ).replace("ipfs://", "");

  const completeEventCreation = async () => {
    setEventProcessingStages([
      ...eventProfiles?.map(
        ({ type }) => profileTypeToEventProcessingStage[type]
      ),
      finalEventProcessingStage,
      faultyEventProcessingStage,
    ]);

    setEventProcessingStageId(0);

    setEventConfigId(await getEventConfigId());
  };

  return (
    <>
      {/* <Snowfall snowflakeCount={35} color={"#ffffffbb"} /> */}
      {eventId ? (
        <EventPage />
      ) : (
        <>
          <Flex
            flexDir={"column"}
            gap={"3rem"}
            mt={[0, 0, "1rem"]}
            px={["1rem", "1rem", 0]}
            maxW={"calc(100vw)"}
            w={["27rem"]}
            margin={"0 auto"}
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
            <Flex flexDir={"column"} gap="1rem" zIndex={1}>
              <Flex flexDir={"column"} gap=".5rem">
                <Text
                  fontWeight={"bold"}
                  color={"textContrastSecondary"}
                  fontSize={"lg"}
                >
                  Post content
                </Text>
                <Container
                  as={Flex}
                  flexDir={"column"}
                  gap={".5rem"}
                  bg={"accentPrimaryContrast"}
                  borderRadius="sm"
                  p=".5rem 2rem"
                >
                  <Input
                    value={eventTitle}
                    onChange={(event) => setEventTitle(event.target.value)}
                    variant={"unstyled"}
                    placeholder="event title"
                    fontSize="3xl"
                    fontWeight={"bold"}
                    p={0}
                    borderRadius={0}
                  />
                  <Divider />
                  <Textarea
                    value={eventDetails}
                    onChange={(event) => setEventDetails(event.target.value)}
                    variant={"unstyled"}
                    placeholder="event details"
                    border={"none"}
                    fontSize="xl"
                    minH={"7rem"}
                    fontWeight={"bold"}
                    borderRadius={0}
                    p={0}
                  />
                </Container>
              </Flex>
              <Flex flexDir={"column"} gap=".5rem">
                <Text
                  fontWeight={"bold"}
                  color={"textContrastSecondary"}
                  fontSize={"lg"}
                >
                  Publish from
                </Text>
                <Flex flexDir={"column"} borderRadius="sm" overflow={"hidden"}>
                  {publishingProfileTypes.map((publishingProfileType) => (
                    <Container
                      as={Flex}
                      p="0 2rem"
                      h="4rem"
                      bg={publishingProfileType.bg}
                    >
                      <Flex
                        w="100%"
                        justifyContent={"space-between"}
                        align="center"
                        alignSelf={"center"}
                      >
                        <Flex gap="1.25rem" align={"center"}>
                          <Icon
                            as={publishingProfileType.icon}
                            transform={"scale(1.75)"}
                          />
                          <Flex flexDir={"column"} gap={".25rem"}>
                            <Text
                              lineHeight={"1.1rem"}
                              color={publishingProfileType.color}
                              fontWeight="bold"
                              fontSize={["sm", "md"]}
                              maxW={["7rem", "10rem"]}
                              overflow="hidden"
                              textOverflow={"ellipsis"}
                              whiteSpace={"nowrap"}
                            >
                              {publishingProfileType.profiles
                                ? publishingProfileType.defaultProfile
                                  ? publishingProfileType.defaultProfile.handle
                                  : publishingProfileType.label
                                : publishingProfileType.label}
                            </Text>
                            {publishingProfileType.subtitle && (
                              <Text
                                opacity={0.7}
                                fontSize={["xs", "sm"]}
                                color={publishingProfileType.color}
                                lineHeight={".75rem"}
                              >
                                {publishingProfileType.subtitle}
                              </Text>
                            )}
                          </Flex>
                        </Flex>
                        {(
                          publishingProfileType.requiresWalletConnection ===
                          false
                            ? true
                            : connectedAddress
                        ) ? (
                          publishingProfileType.profiles ? (
                            publishingProfileType.defaultProfile ? (
                              publishingProfileType.isAuthed ? (
                                <Switch
                                  isChecked={eventProfiles?.includes(
                                    publishingProfileType.defaultProfile
                                  )}
                                  onChange={() =>
                                    setEventProfiles(
                                      xor(eventProfiles, [
                                        publishingProfileType.defaultProfile!,
                                      ])
                                    )
                                  }
                                />
                              ) : (
                                <Button
                                  disabled={
                                    publishingProfileType.type ==
                                    ProfileType.TWITTER
                                  }
                                  variant={"secondary"}
                                  bg={"transparentOverlay"}
                                  _hover={{ bg: "transparentOverlay" }}
                                  onClick={publishingProfileType.auth}
                                >
                                  Authenticate
                                </Button>
                              )
                            ) : (
                              <Link
                                target={"_blank"}
                                color={"text"}
                                href={publishingProfileType.externalLink}
                              >
                                <Button
                                  rightIcon={<ExternalLinkIcon />}
                                  variant={"secondary"}
                                  bg={"transparentOverlay"}
                                >
                                  Get Profile
                                </Button>
                              </Link>
                            )
                          ) : (
                            <Spinner color="#222" />
                          )
                        ) : (
                          <Button
                            variant={"secondary"}
                            bg={"transparentOverlay"}
                            onClick={() => setOpenWalletConnectModal(true)}
                          >
                            Connect Wallet
                          </Button>
                        )}
                      </Flex>
                    </Container>
                  ))}
                </Flex>
              </Flex>
              <Flex flexDir={"column"} gap=".5rem">
                <Text
                  fontWeight={"bold"}
                  color={"textContrastSecondary"}
                  fontSize={"lg"}
                >
                  Ticket types
                </Text>
                <Container
                  as={Flex}
                  flexDir={"column"}
                  gap={".5rem"}
                  bg={"accentPrimaryContrast"}
                  borderRadius="sm"
                  p="1rem 2rem"
                >
                  <Flex gap="1rem" alignItems={"center"}>
                    <TicketIcon width={"2.25rem"} height={"2.25rem"} />
                    <Flex flexDir={"column"}>
                      <Text fontSize={"lg"} fontWeight="bold">
                        BASIC
                      </Text>
                      <Text fontWeight={"bold"} fontSize={"xs"} opacity={0.7}>
                        FOR FOLLOWERS
                      </Text>
                    </Flex>
                  </Flex>
                  <Divider />
                  <Flex gap="1rem" flexDir={"column"}>
                    <Flex gap="1rem" alignItems={"center"}>
                      <TicketIcon
                        width={"2.25rem"}
                        height={"2.25rem"}
                        filter={"hue-rotate(270deg)"}
                      />
                      <Flex flexDir={"column"}>
                        <Text fontSize={"lg"} fontWeight="bold">
                          VIP
                        </Text>
                        <Text fontWeight={"bold"} fontSize={"xs"} opacity={0.7}>
                          FOR REPOST AND COLLECT
                        </Text>
                      </Flex>
                    </Flex>
                    <Container
                      as={Flex}
                      bg={"bg"}
                      p=".5rem 1rem"
                      h={"3rem"}
                      borderRadius={"sm"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Text
                        fontWeight={"bold"}
                        color="text"
                        fontSize={"sm"}
                        whiteSpace={"nowrap"}
                      >
                        PRICE TO COLLECT
                      </Text>
                      <Flex alignItems={"center"} gap=".5rem">
                        <Input
                          value={postPayload?.priceToCollect}
                          onChange={(event) =>
                            setPostPayload({
                              ...postPayload,
                              priceToCollect: +event.target.value || 0,
                            })
                          }
                          type={"number"}
                          p={0}
                          w={"4rem"}
                          placeholder="0"
                          textAlign={"center"}
                          fontWeight={"bold"}
                          fontSize={"xl"}
                        />
                        <UsdcIcon width={"1.5rem"} height={"1.5rem"} />
                      </Flex>
                    </Container>
                  </Flex>
                </Container>
              </Flex>
              <Button
                variant={"accent"}
                disabled={!canCompleteEventCreation}
                leftIcon={<PublishIcon stroke={"var(--chakra-colors-text)"} />}
                borderRadius="sm"
                color={"text"}
                onClick={completeEventCreation}
              >
                Publish
              </Button>
            </Flex>
          </Flex>
          <AnimatePresence>
            {eventProcessingStageId !== undefined &&
              eventProcessingStages &&
              eventProcessingStages[eventProcessingStageId] && (
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
                      key={eventProcessingStages[eventProcessingStageId]!.id}
                      initial={{
                        scale: 0.7,
                        x: "-50%",
                        y: "-50%",
                        opacity: 0,
                        marginTop: "5rem",
                      }}
                      animate={{
                        scale: 1,
                        x: "-50%",
                        y: "-50%",
                        opacity: 1,
                        marginTop: 0,
                      }}
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
                        height: "10rem",
                        width: "22.5rem",
                        maxWidth: "calc(100vw - 2rem)",
                        padding: ".5rem 2rem",
                        color:
                          eventProcessingStages[eventProcessingStageId].color,
                        background:
                          eventProcessingStages[eventProcessingStageId].bg,
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Flex alignItems={"center"} gap="1.5rem">
                        <Flex flexDir={"column"}>
                          <Text fontWeight={"bold"} fontSize="4xl">
                            {
                              eventProcessingStages[eventProcessingStageId]
                                .label
                            }
                          </Text>
                          <Text
                            fontWeight={"semibold"}
                            fontSize="xl"
                            lineHeight={".75em"}
                          >
                            {
                              eventProcessingStages[eventProcessingStageId]
                                .subtitle
                            }
                          </Text>
                        </Flex>
                        <Box pos={"absolute"} right={"1.5rem"} bottom={"1rem"}>
                          <motion.div
                            animate={{
                              y: [-10, 0, -10],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Icon
                              as={
                                eventProcessingStages[eventProcessingStageId]
                                  .icon
                              }
                              transform={"scale(10)"}
                            />
                          </motion.div>
                        </Box>
                      </Flex>
                    </motion.div>
                  </AnimatePresence>
                </Container>
              )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default ExpressEvent;
