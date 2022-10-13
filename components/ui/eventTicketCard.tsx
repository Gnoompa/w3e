import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { getIPFSUri } from "helpers/hooks";
import { motion } from "framer-motion";
import { fadeRightSlideAnimation, fadeTopSlideAnimation } from "styles/theme";
import { BigNumber, BigNumberish, ethers } from "ethers";
import {
  getEventTicketNativeCurrencyPriceLabel,
  getEventTicketPriceLabel,
} from "../helpers/events";

export type PropsType = {
  isAbleToBuy?: boolean;
  isBuyingTicket?: boolean;
  nativeCurrencyToUsdPrice?: BigNumber;
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
    nativeCurrencyPriceLabel?: string;
  };
  onBuyButtonClick?: () => any;
};

const EventTicket = (props: PropsType) => {
  const [isTicketImageLoaded, setIsTicketImageLoaded] = useState(false);
  const {
    isOpen: isTicketImagePreviewModalOpen,
    onOpen: onOpenTicketImagePreviewModal,
    onClose: onCloseTicketImagePreviewModal,
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
              src={props.ticketData.image}
              borderRadius="lg"
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
        p={"1rem 1.5rem"}
        gap={"1rem"}
        flex={1}
        justifyContent={"space-between"}
        borderTop="1px solid #565656"
      >
        <Flex direction={"column"} gap={"1rem"}>
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
          <Text
            fontSize="md"
            lineHeight={"1.25rem"}
            color={
              props.ticketData.desc ? "textContrast" : "textContrastSecondary"
            }
          >
            {props.ticketData.desc?.substring(0, 300) || "ticket description"}
          </Text>
        </Flex>
        <Flex justifyContent={"space-between"} align={"flex-end"}>
          <Flex direction={"column"} gap={".5rem"}>
            <Text color="textContrast" fontSize={"sm"} fontWeight="medium">
              Minting price
            </Text>
            <Flex gap={".25rem"} align={"flex-end"}>
              <Text color={"textAccent"} fontSize={"2xl"} fontWeight="bold">
                {props.ticketData.priceLabel ||
                  getEventTicketPriceLabel({
                    price: props.ticketData.price,
                    isFree: !!props.ticketData.isFree,
                  })}
              </Text>
              {!props.ticketData.isFree && (
                <Text color={"textContrastSecondary"} fontSize="sm">
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
            Buy
          </Button>
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
} as PropsType;

export default EventTicket;
