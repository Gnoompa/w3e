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
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import LensIcon from "public/icons/lens";
import { useAccount } from "wagmi";
import { useProfiles as useCCProfiles } from "./cc/profile";
import {
  getProfileExternalLink,
  useProfiles as useLensProfiles,
} from "./lens/profile";
import { useAuth as useLensAuth } from "./lens/auth";
import { useAuth as useCCAuth } from "./cc/auth";
import { useModal } from "connectkit";
import { ExpressEventMetadata, ProfileType } from "./types";
import { motion } from "framer-motion";
import { getIPFSUri, useRouterQuery } from "helpers/hooks";
import { useRouter } from "next/router";
import BrandTicket from "public/icons/brandTicket";
import { Routes } from "helpers/routes";
import { usePost as useLensPost } from "./lens/post";
import {
  profileTypeToExternalLinkMap,
  profileTypeToStylesMap,
} from "./constants";

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

  const profileTypeToPostMap = {
    [ProfileType.LENS]: lensPost,
  };

  useEffect(() => {
    setColorMode("dark");
  }, []);

  useEffect(() => {
    queryEventId && getEventMetadata();
  }, [queryEventId]);

  const getEventMetadata = () =>
    queryEventId &&
    fetch(getIPFSUri(`ipfs://${queryEventId}`))
      .then((res) => res.json())
      .then((json) => setEventMetadata(json));

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
    </Flex>
  );
};

export default EventPage;
