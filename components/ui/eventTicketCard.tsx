import React, { useEffect, useRef, useState } from "react";
import {
  Flex,
  Box,
  Image,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  IconButton,
  useDimensions,
} from "@chakra-ui/react";
import { getIPFSUri } from "helpers/hooks";
import { motion } from "framer-motion";
import { fadeRightSlideAnimation, fadeTopSlideAnimation } from "styles/theme";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { useSize } from "@chakra-ui/react-use-size";
import {
  getEventTicketNativeCurrencyPriceLabel,
  getEventTicketPriceLabel,
} from "../helpers/events";
import { CheckIcon } from "@chakra-ui/icons";

export type PropsType = {
  isAbleToBuy?: boolean;
  buyButtonLabel?: string;
  isBuyingTicket?: boolean;
  nativeCurrencyToUsdPrice?: BigNumber | undefined;
  eventDatesLabel?: string;
  eventLocationLabel?: string;
  ticketData: {
    title?: string;
    desc?: string;
    image?: string;
    imagePlaceholder?: string;
    price?: number | string;
    priceLabel?: string;
    isFree?: boolean;
    participantsLabel?: string | undefined;
    supplyLabel?: string | undefined;
    nativeCurrencyPriceLabel?: string;
    benefits?: string[];
  };
  onBuyButtonClick?: () => any;
  onShareButtonClick?: () => any;
};

const EventTicket = (props: PropsType) => {
  const [isTicketImageLoaded, setIsTicketImageLoaded] = useState(false);
  const ticketTierBenefitsContainerRef = useRef();
  const ticketTierBenefitsContainerSize = useSize(
    ticketTierBenefitsContainerRef
  );

  console.log(ticketTierBenefitsContainerRef.current);
  const {
    isOpen: isTicketImagePreviewModalOpen,
    onOpen: onOpenTicketImagePreviewModal,
    onClose: onCloseTicketImagePreviewModal,
  } = useDisclosure();
  const {
    isOpen: isTicketBenefitsContainerOpen,
    onOpen: onOpenTicketBenefitsContainer,
    onClose: onCloseTicketBenefitsContainer,
  } = useDisclosure();

  useEffect(() => {
    props.ticketData.image &&
      fetch(getIPFSUri(props.ticketData.image as string) as string).then(() =>
        setIsTicketImageLoaded(true)
      );
  }, [props.ticketData.image]);

  return (
    <Flex
      direction={"column"}
      borderRadius="md"
      overflow={"hidden"}
      w={"22rem"}
      minW={["20rem", "22rem"]}
      h={"35rem"}
      minH={"32rem"}
      bg={"accentPrimaryContrast"}
      as={motion.div}
      initial={fadeRightSlideAnimation["false"]}
      animate={fadeRightSlideAnimation["true"]}
    >
      <Flex
        justify={"center"}
        position={"relative"}
        overflow={"hidden"}
        bg={"#222"}
        height={"12rem"}
      >
        {props.onShareButtonClick && (
          <IconButton
            w="4rem"
            pos="absolute"
            right="1rem"
            top="1rem"
            zIndex="dropdown"
            borderRadius="sm"
            boxShadow="0 1px 5px var(--chakra-colors-accentPrimaryContrast)"
            opacity={0.9}
            aria-label="share"
            onClick={props.onShareButtonClick}
            icon={<Image src="/icons/share.svg" />}
          />
        )}
        <Box
          pos={"absolute"}
          mt={"0rem"}
          left={0}
          w={"100%"}
          h={"12rem"}
          zIndex={"base"}
          overflow={"hidden"}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isTicketImageLoaded ? { opacity: 1 } : { opacity: 0 }}
          >
            {props.ticketData.image && (
              <Image
                src={
                  props.ticketData.imagePlaceholder || props.ticketData.image!
                }
                w={"100%"}
                filter={"blur(40px)"}
              />
            )}
          </motion.div>
        </Box>
        <Box
          as={motion.div}
          initial={{ marginTop: "3rem" }}
          animate={
            isTicketImageLoaded && {
              marginTop: "2rem",
            }
          }
          whileHover={{ marginTop: "1rem" }}
          zIndex={"docked"}
          style={{ cursor: "pointer" }}
        >
          {props.ticketData.image && (
            <Image
              as={motion.img}
              initial={fadeTopSlideAnimation["false"]}
              animate={fadeTopSlideAnimation["true"]}
              src={getIPFSUri(props.ticketData.image)}
              borderRadius="sm"
              px={"1rem"}
              title={"show poster"}
              onClick={onOpenTicketImagePreviewModal}
              fallback={<></>}
            />
          )}
        </Box>
      </Flex>
      <Flex
        direction={"column"}
        p={[".5rem 1rem"]}
        gap={[".5rem"]}
        flex={1}
        justifyContent={"space-between"}
        borderTop="1px solid #565656"
      >
        <Flex direction={"column"} gap={[".5rem", "1rem"]}>
          <Text
            fontSize="2xl"
            lineHeight={"1.75rem"}
            color={
              props.ticketData.title ? "textContrast" : "textContrastSecondary"
            }
            fontWeight={"bold"}
          >
            {props.ticketData.title?.substring(0, 50) || "Ticket title"}
          </Text>
          <Flex
            ref={ticketTierBenefitsContainerRef}
            flexDirection={"column"}
            gap=".25rem"
            maxH={
              isTicketBenefitsContainerOpen
                ? "initial"
                : props.ticketData.participantsLabel
                ? "7rem"
                : "9rem"
            }
            paddingBottom={isTicketBenefitsContainerOpen ? "1.75rem" : "0"}
            overflow="hidden"
            pos={"relative"}
          >
            {(ticketTierBenefitsContainerRef?.current?.scrollHeight >
              ticketTierBenefitsContainerSize?.height ||
              isTicketBenefitsContainerOpen) && (
              <Flex
                pos={"absolute"}
                bottom="0"
                py=".25rem"
                justifyContent={"center"}
                boxShadow={"0 -10px 10px #2e2e2e"}
                opacity={".95"}
                cursor={"pointer"}
                color={"textContrastAccent"}
                bg={"accentPrimaryContrast"}
                width={"100%"}
                onClick={
                  isTicketBenefitsContainerOpen
                    ? onCloseTicketBenefitsContainer
                    : onOpenTicketBenefitsContainer
                }
              >
                <Text>
                  {isTicketBenefitsContainerOpen ? "hide" : "show more"}
                </Text>
              </Flex>
            )}
            {props.ticketData.benefits?.map((benefit) => (
              <Flex
                as={motion.div}
                initial={fadeTopSlideAnimation["false"]}
                animate={fadeTopSlideAnimation["true"]}
                gap=".75rem"
                alignItems={"center"}
              >
                <CheckIcon
                  mt=".25rem"
                  alignSelf={"flex-start"}
                  color={benefit ? "success" : "textContrastSecondary"}
                />
                <Text
                  color={benefit ? "textContrast" : "textContrastSecondary"}
                  fontWeight="semibold"
                  whiteSpace={"pre-wrap"}
                  overflow={"hidden"}
                >
                  {benefit.substring(0, 60) || "benefit"}
                </Text>
              </Flex>
            ))}
          </Flex>
          <Flex
            opacity={0.5}
            gap=".5rem"
            flexDir={"column"}
            display={
              props.eventDatesLabel || props.eventLocationLabel
                ? "flex"
                : "none"
            }
          >
            {props.eventDatesLabel && (
              <Flex gap=".5rem">
                <Image src="/icons/calendar.svg" />
                <Text
                  color={"textContrast"}
                  whiteSpace={"nowrap"}
                  fontSize={["sm"]}
                >
                  {props.eventDatesLabel}
                </Text>
              </Flex>
            )}
            {props.eventLocationLabel && (
              <Flex gap=".5rem">
                <Image src="/icons/location.svg" />
                <Text
                  color={"textContrast"}
                  whiteSpace={"nowrap"}
                  fontSize={["sm"]}
                  overflow="hidden"
                  textOverflow={"ellipsis"}
                  maxW="100%"
                >
                  {props.eventLocationLabel}
                </Text>
              </Flex>
            )}
          </Flex>
          {!isTicketBenefitsContainerOpen && (
            <Text
              fontSize="md"
              lineHeight={"1.25rem"}
              maxH="5rem"
              overflowY="scroll"
              color={
                props.ticketData.desc ? "textContrast" : "textContrastSecondary"
              }
              whiteSpace={"pre-wrap"}
            >
              {props.ticketData.desc?.substring(0, 300) || "ticket description"}
            </Text>
          )}
        </Flex>
        <Flex flexDir={"column"} gap=".5rem" w="100%">
          {props.ticketData.participantsLabel && (
            <Flex gap=".5rem" alignItems={"center"}>
              <Flex>
                <Image
                  src="/graphics/graphics1.png"
                  w="2rem"
                  h="2rem"
                  borderRadius={"18px"}
                  border="3px solid var(--chakra-colors-accentPrimaryContrast)"
                />
                <Image
                  src="/graphics/graphics3.png"
                  w="2rem"
                  h="2rem"
                  ml="-1rem"
                  borderRadius={"18px"}
                  border="3px solid var(--chakra-colors-accentPrimaryContrast)"
                />
                <Image
                  src="/graphics/graphics4.png"
                  w="2rem"
                  h="2rem"
                  ml="-1rem"
                  borderRadius={"18px"}
                  border="3px solid var(--chakra-colors-accentPrimaryContrast)"
                />
              </Flex>
              <Text color="bg" fontWeight={"medium"}>
                {props.ticketData.participantsLabel}
              </Text>
            </Flex>
          )}
          <Flex
            flexDir={["column", "row"]}
            gap={".75rem"}
            justifyContent={"space-between"}
          >
            <Flex direction={"column"} gap={"0"}>
              {/* <Text color="textContrast" fontSize={"sm"} fontWeight="medium">
              Minting price
            </Text> */}
              <Flex align={["center", "flex-start"]} flexDir="column">
                <Flex gap=".5rem" alignItems={"flex-end"}>
                  <Text color={"textAccent"} fontSize={"2xl"} fontWeight="bold">
                    {props.ticketData.priceLabel ||
                      getEventTicketPriceLabel({
                        price: props.ticketData.price,
                        isFree: !!props.ticketData.isFree,
                      })}
                  </Text>
                  {props.ticketData.supplyLabel && (
                    <Text color={"textContrastAccent"} lineHeight={"2rem"}>
                      {props.ticketData.supplyLabel}
                    </Text>
                  )}
                </Flex>
                {!props.ticketData.isFree && props.nativeCurrencyToUsdPrice && (
                  <Text
                    color={"textContrastSecondary"}
                    fontSize="sm"
                    lineHeight={"1em"}
                  >
                    {props.ticketData.nativeCurrencyPriceLabel ||
                      getEventTicketNativeCurrencyPriceLabel(
                        { price: props.ticketData.price },
                        props.nativeCurrencyToUsdPrice
                      )}
                  </Text>
                )}
              </Flex>
            </Flex>
            <Button
              variant={props.isAbleToBuy ? "accent" : "outlineAccent"}
              pointerEvents={props.isAbleToBuy ? "initial" : "none"}
              isDisabled={!props.isAbleToBuy || props.isBuyingTicket}
              isLoading={props.isBuyingTicket}
              onClick={props.onBuyButtonClick}
            >
              {props.buyButtonLabel}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Modal
        isOpen={isTicketImagePreviewModalOpen}
        onClose={onCloseTicketImagePreviewModal}
        portalProps={{ appendToParentPortal: false }}
      >
        <ModalOverlay></ModalOverlay>
        <ModalContent
          maxW={"calc(100vw - 4rem)"}
          bg={"transparent"}
          boxShadow="none"
          onClick={onCloseTicketImagePreviewModal}
        >
          <Image
            src={props.ticketData.image}
            maxW={"calc(100vw - 4rem)"}
            width={"fit-content"}
            margin="0 auto"
          ></Image>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

EventTicket.defaultProps = {
  isAbleToBuy: true,
  buyButtonLabel: "Buy",
} as PropsType;

export default EventTicket;
