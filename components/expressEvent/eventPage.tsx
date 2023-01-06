import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Input,
  Link,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Text,
  Textarea,
  useColorMode,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import React, { useEffect, useMemo, useState } from "react";
import LensIcon from "public/icons/lens";
import CyberConnectIcon from "public/icons/cyberConnect";
import PublishIcon from "public/icons/publish";
import { useAccount } from "wagmi";
import { useProfiles as useCCProfiles } from "./cc/profile";
import { useProfiles as useLensProfiles } from "./lens/profile";
import { useAuth as useLensAuth } from "./lens/auth";
import { useAuth as useCCAuth } from "./cc/auth";
import Snowfall from "react-snowfall";
import { useModal } from "connectkit";
import {
  ExpressEventConfig,
  ExpressEventMetadata,
  IProfile,
  PostHook,
  ProfileType,
} from "./types";
import { xor } from "lodash";
import TwitterIcon from "public/icons/twitter";
import TicketIcon from "public/icons/brandTicket";
import UsdcIcon from "public/icons/usdc";
import { motion, AnimatePresence } from "framer-motion";
import { getIPFSUri, uploadMetadata, useRouterQuery } from "helpers/hooks";
import { useRouter } from "next/router";
import { getTokenMetadataUris } from "helpers/contract";
import BrandTicket from "public/icons/brandTicket";

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
            p=".5rem 1.5rem"
            cursor={"pointer"}
          >
            <Text
              fontWeight={"bold"}
              fontSize={"2xl"}
              overflowWrap={"initial"}
              lineHeight="1em"
              w={"5rem"}
            >
              Show ticket
            </Text>
            <motion.div
              style={{
                position: "absolute",
                bottom: "-1rem",
                right: "-1rem",
              }}
              variants={{ idle: { scale: 1 }, hover: { scale: 1.1 } }}
            >
              <BrandTicket width="5rem" height="5rem" />
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
            p=".5rem 1.5rem"
            cursor={"pointer"}
          >
            <Text
              fontWeight={"bold"}
              fontSize={"2xl"}
              overflowWrap={"initial"}
              lineHeight="1em"
              w="5rem"
            >
              Validate ticket
            </Text>
            <motion.div
              style={{
                position: "absolute",
                bottom: "-1rem",
                right: "-1rem",
              }}
              variants={{ idle: { scale: 1 }, hover: { scale: 1.1 } }}
            >
              <Image src="/icons/qr.png" width="5rem" height="5rem" />
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
              cursor={"pointer"}
            >
              <Flex flexDir={"column"} gap={"1rem"} mt="1rem">
                <Flex flexDir={"column"} ml={"4.5rem"}>
                  <Text fontWeight={"bold"} fontSize={"xl"}>
                    Basic
                  </Text>
                  <Text
                    fontWeight={"bold"}
                    opacity={0.7}
                    lineHeight={"1em"}
                    fontSize={"sm"}
                  >
                    SUBSCRIBE OR FOLLOW ANY PROFILE
                  </Text>
                </Flex>
                <Flex gap=".5rem" ml={"4.5rem"} w={"fit-content"}>
                  <Container
                    as={Flex}
                    alignItems={"center"}
                    gap={"1rem"}
                    bg={"lensGradient"}
                    p={".5rem 1rem"}
                    borderRadius={"sm"}
                  >
                    <LensIcon width={"1.25rem"} height={"1.25rem"} />
                    <ExternalLinkIcon color={"lensText"} />
                  </Container>
                </Flex>
                <motion.div
                  style={{
                    position: "absolute",
                    left: "-3rem",
                    top: "1rem",
                  }}
                  variants={{ idle: { scale: 1 }, hover: { scale: 1.1 } }}
                >
                  <BrandTicket width="6rem" height="6rem" />
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
              cursor={"pointer"}
            >
              <Flex flexDir={"column"} gap={"1rem"}>
                <Flex flexDir={"column"} ml={"4.5rem"}>
                  <Text fontWeight={"bold"} fontSize={"xl"}>
                    VIP
                  </Text>
                  <Text
                    fontWeight={"bold"}
                    opacity={0.7}
                    lineHeight={"1em"}
                    fontSize={"sm"}
                  >
                    REPOST OR COLLECT ANY POST
                  </Text>
                </Flex>
                <Flex gap=".5rem" ml={"4.5rem"} w={"fit-content"}>
                  <Container
                    as={Flex}
                    alignItems={"center"}
                    gap={"1rem"}
                    bg={"lensGradient"}
                    p={".5rem 1rem"}
                    borderRadius={"sm"}
                  >
                    <LensIcon width={"1.25rem"} height={"1.25rem"} />
                    <ExternalLinkIcon color={"lensText"} />
                  </Container>
                </Flex>
                <motion.div
                  style={{
                    position: "absolute",
                    left: "-3rem",
                    top: "0rem",
                  }}
                  variants={{ idle: { scale: 1 }, hover: { scale: 1.1 } }}
                >
                  <BrandTicket
                    width="6rem"
                    height="6rem"
                    filter={"hue-rotate(270deg)"}
                  />
                </motion.div>
              </Flex>
            </Container>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default EventPage;
