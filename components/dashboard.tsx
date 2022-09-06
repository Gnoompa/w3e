import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useContext,
  ReactElement,
  RefObject,
} from "react";
import { Global, css } from "@emotion/react";
import QRCode from "qrcode.react";
import {
  Flex,
  Box,
  Image,
  Button,
  Text,
  Container,
  Spinner,
  useTheme,
  Heading,
  IconButton,
  useClipboard,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Highlight,
  Icon,
  AlertIcon,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import {
  getIPFSUri,
  getMetadataAttribute,
  SocialMediaIds,
  useRouterQuery,
} from "helpers/hooks";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { BigNumber, BigNumberish, ethers } from "ethers";
import {
  chain,
  useAccount,
  useProvider,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";
import {
  buyEventTicket,
  getBalanceOfToken,
  getEventManagers,
  getEvents,
  getEventTickets,
  getNativeCurrencyToUsdPrice,
  getOwnerOfToken,
  getTokenMetadataUris,
  prepareBuyEventTicket,
  useMainContractEvents,
  useTokenMetadataFetch,
} from "helpers/contract";
import {
  ArrowForwardIcon,
  CheckIcon,
  ExternalLinkIcon,
  LinkIcon,
} from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { fadeTopSlideAnimation } from "styles/theme";

const Dashboard = () => {
  const provider = useProvider();
  const router = useRouter();
  const [copiedValue, setCopiedValue] = useState<string>("");
  const { hasCopied, onCopy } = useClipboard(copiedValue);
  const { address: connectedWalletAddress } = useAccount();
  const {
    data: eventCreatedEvents,
    refetch: refetchEventCreatedEvents,
    isLoading: isLoadingEventCreatedEvents,
  } = useMainContractEvents({
    eventName: "EventCreated",
    filters: {
      [chain.polygonMumbai.id]: [null, connectedWalletAddress],
    },
    provider,
  });

  const {
    data: eventTicketBoughtEvents,
    refetch: refetchEventTicketBoughtEvents,
    isLoading: isLoadingEventTicketBoughtEvents,
  } = useMainContractEvents({
    eventName: "TicketBought",
    filters: {
      [chain.polygonMumbai.id]: [null, null, connectedWalletAddress],
    },
    provider,
  });

  const [eventIds, setEventIds] = useState<BigNumberish[]>([]);
  const [ticketIds, setTicketIds] = useState<BigNumberish[]>([]);
  const [ownedTicketEventIds, setOwnedTicketEventIds] = useState<
    BigNumberish[]
  >([]);

  const {
    data: eventMetadataUris,
    refetch: refetchEventMetadataUris,
    isLoading: isLoadingEventMetadataUris,
  } = getTokenMetadataUris([
    {
      args: [eventIds],
      enabled: false,
    },
  ]);

  const {
    data: ownedTicketEventMetadataUris,
    refetch: refetchOwnedTicketEventMetadataUris,
    isLoading: isLoadingOwnedTicketEventMetadataUris,
  } = getTokenMetadataUris([
    {
      args: [ownedTicketEventIds],
      enabled: false,
    },
  ]);

  const { data: eventMetadatas, isLoading: isLoadingEventMetadatas } =
    useTokenMetadataFetch<EventMetadata>({
      dids: eventMetadataUris?.[0],
    });

  const {
    data: ownedTicketEventMetadatas,
    isLoading: isLoadingOwnedTicketEventMetadatas,
  } = useTokenMetadataFetch<EventMetadata>({
    dids: ownedTicketEventMetadataUris?.[0],
  });

  const isLoadingOwnedTicketEvents =
    isLoadingEventTicketBoughtEvents ||
    isLoadingOwnedTicketEventMetadataUris ||
    isLoadingOwnedTicketEventMetadatas;
  const isLoadingEvents =
    isLoadingEventCreatedEvents ||
    isLoadingEventMetadataUris ||
    isLoadingEventMetadatas;

  useEffect(() => {
    eventCreatedEvents &&
      setEventIds(eventCreatedEvents[0].map((event) => event?.args?.tokenId));
  }, [eventCreatedEvents]);

  useEffect(() => {
    eventTicketBoughtEvents &&
      (setOwnedTicketEventIds(
        eventTicketBoughtEvents[0].map((event) => event?.args?.tokenId)
      ),
      setOwnedTicketEventIds(
        eventTicketBoughtEvents[0].map((event) => event?.args?.eventTokenId)
      ));
  }, [eventTicketBoughtEvents]);

  useEffect(() => {
    eventIds.length && refetchEventMetadataUris();
  }, [eventIds]);

  useEffect(() => {
    ownedTicketEventIds.length && refetchOwnedTicketEventMetadataUris();
  }, [ownedTicketEventIds]);

  const [mainTabIndex, setMainTabIndex] = useState<number>(0);

  const goToEventPage = (eventTokenId: BigNumberish) =>
    router.push("/#event?id=" + eventTokenId);

  return (
    <Container
      variant={"padded"}
      w={"1440px"}
      maxWidth={"100vw"}
      minHeight={"calc(100vh - 15rem)"}
    >
      <Container variant={"contrast"} w={"100%"} minH={"35rem"}>
        <Flex
          direction={["column", "column", "row"]}
          gap="2rem"
          justify={"space-between"}
          mt="1rem"
          align={"center"}
        >
          <Heading color={"textContrast"} fontSize="5xl">
            Dashboard
          </Heading>
          <Tabs onChange={setMainTabIndex} variant="switch">
            <TabList pos={"relative"}>
              <Tab>My Events</Tab>
              <Tab>My Tickets</Tab>
              <Box
                as={motion.div}
                className="switchTabIndicator"
                ml={mainTabIndex ? "-.25rem" : ".25rem"}
                width="calc(50%)"
                animate={{ left: `${(mainTabIndex / 2) * 100}%` }}
              ></Box>
            </TabList>
          </Tabs>
        </Flex>
        <Tabs index={mainTabIndex} mt={"4rem"}>
          <TabPanels>
            <TabPanel
              as={motion.div}
              animate={fadeTopSlideAnimation[`${mainTabIndex == 0}`]}
              display={"flex"}
              w={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {isLoadingEvents ? (
                <Spinner color="textContrast" alignSelf={"center"} />
              ) : !eventCreatedEvents?.[0].length ? (
                <Text color="textContrastSecondary">no events created yet</Text>
              ) : (
                <Flex
                  maxH={"20rem"}
                  flexDir={"column"}
                  overflowY={"scroll"}
                  flex={1}
                  w={"100%"}
                  gap={"1rem"}
                  px={"2rem"}
                >
                  {eventMetadatas &&
                    eventCreatedEvents?.[0].map(
                      (event, index) =>
                        eventMetadatas[index] && (
                          <Container variant={"contrastAccent"} key={index}>
                            <Flex align={"center"} justify={"space-between"}>
                              <Flex gap={"5rem"}>
                                <Text
                                  color={"textContrast"}
                                  fontWeight="bold"
                                  fontSize={"lg"}
                                >
                                  {eventMetadatas[index].name}
                                </Text>
                                <Text
                                  color={"textContrast"}
                                  fontWeight="medium"
                                  fontSize={"lg"}
                                  maxW={"15rem"}
                                  overflow={"hidden"}
                                  textOverflow={"ellipsis"}
                                >
                                  {eventMetadatas[index].description}
                                </Text>
                                <Text
                                  color={"textContrast"}
                                  fontWeight="medium"
                                  fontSize={"lg"}
                                  maxW={"15rem"}
                                  overflow={"hidden"}
                                  textOverflow={"ellipsis"}
                                >
                                  {getMetadataAttribute(
                                    eventMetadatas[index],
                                    "Event Start Date"
                                  )}
                                </Text>
                              </Flex>
                              <IconButton
                                variant={"unstyled"}
                                onClick={() => goToEventPage(eventIds[index])}
                                aria-label="go to event page"
                                icon={
                                  <ArrowForwardIcon color={"textContrast"} />
                                }
                              />
                            </Flex>
                          </Container>
                        )
                    )}
                </Flex>
              )}
            </TabPanel>
            <TabPanel
              as={motion.div}
              animate={fadeTopSlideAnimation[`${mainTabIndex == 1}`]}
              display={"flex"}
              w={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {isLoadingOwnedTicketEvents ? (
                <Spinner color="textContrast" alignSelf={"center"} />
              ) : !eventTicketBoughtEvents?.[0].length ? (
                <Text color="textContrastSecondary">no tickets bought yet</Text>
              ) : (
                <Flex
                  maxH={"20rem"}
                  flexDir={"column"}
                  overflowY={"scroll"}
                  flex={1}
                  w={"100%"}
                  gap={"1rem"}
                  px={"2rem"}
                >
                  {ownedTicketEventMetadatas?.map(
                    (_, index) =>
                      ownedTicketEventMetadatas[index] && (
                        <Container variant={"contrastAccent"} key={index}>
                          <Flex align={"center"} justify={"space-between"}>
                            <Flex gap={"5rem"}>
                              <Text
                                color={"textContrast"}
                                fontWeight="bold"
                                fontSize={"lg"}
                              >
                                {ownedTicketEventMetadatas[index].name}
                              </Text>
                              <Text
                                color={"textContrast"}
                                fontWeight="medium"
                                fontSize={"lg"}
                                maxW={"15rem"}
                                overflow={"hidden"}
                                textOverflow={"ellipsis"}
                              >
                                {ownedTicketEventMetadatas[index].description}
                              </Text>
                              <Text
                                color={"textContrast"}
                                fontWeight="medium"
                                fontSize={"lg"}
                                maxW={"15rem"}
                                overflow={"hidden"}
                                textOverflow={"ellipsis"}
                              >
                                {getMetadataAttribute(
                                  ownedTicketEventMetadatas[index],
                                  "Event Start Date"
                                )}
                              </Text>
                            </Flex>
                            <IconButton
                              variant={"unstyled"}
                              onClick={() =>
                                goToEventPage(ownedTicketEventIds[index])
                              }
                              aria-label="go to event page"
                              icon={<ArrowForwardIcon color={"textContrast"} />}
                            />
                          </Flex>
                        </Container>
                      )
                  )}
                </Flex>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Container>
  );
};

export default Dashboard;
