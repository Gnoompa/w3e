import React, { RefObject, useEffect, useRef } from "react";
import {
  Flex,
  Box,
  Image,
  Text,
  Container,
  Heading,
  IconButton,
  Link,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";
import { ArrowForwardIcon, LinkIcon } from "@chakra-ui/icons";
import { SocialMediaIds, socialMediaIdToComponentMap } from "helpers/hooks";
import TwitterIcon from "../public/icons/twitter";
import FacebookIcon from "../public/icons/facebook";
import InstagramIcon from "../public/icons/insta";
import TelegramIcon from "../public/icons/tg";
import SiteIcon from "../public/icons/site";
import { fadeRightSlideAnimation } from "styles/theme";
import { motion } from "framer-motion";
import EventTicket, { PropsType } from "./ui/eventTicketCard";

export type EventProps = {
  name?: string | JSX.Element;
  shortDescription?: string | JSX.Element;
  longDescription?: string | JSX.Element;
  image?: string | JSX.Element;
  location?: string | JSX.Element;
  date?: (string | JSX.Element)[];
  time?: (string | JSX.Element)[];
  mediaLinks?: { [key in SocialMediaIds]?: string };
  eventTicketPriceLabel?: string | JSX.Element;
  eventTicketsSupplyLabel?: string | number | JSX.Element;
  ticket?: PropsType["ticketData"];
};

const EventPreview = ({ eventData = {} }: { eventData?: EventProps }) => {
  const previewContainerRef = useRef() as RefObject<HTMLDivElement>;

  return (
    <Container
      variant={"contrast"}
      px={0}
      py={0}
      pos={"relative"}
      w={["auto", "30rem", "38rem", "38rem", "45rem"]}
      bg={"accentPrimary"}
      minW={"35rem"}
      minH={"41rem"}
      overflow={"hidden"}
      h={"100%"}
      ref={previewContainerRef}
    >
      <Box
        w={"4rem"}
        h={"4rem"}
        pos={"absolute"}
        top={0}
        left={"50%"}
        transform={"translate(-50%,-50%)"}
        bg={"bg"}
        zIndex={"overlay"}
        borderRadius={"100%"}
      ></Box>
      <Modal
        isOpen={!!eventData.ticket}
        onClose={() => {}}
        portalProps={{ containerRef: previewContainerRef }}
        blockScrollOnMount={false}
        trapFocus={false}
      >
        <ModalOverlay
          w={"100%"}
          h={"100%"}
          pos={"absolute"}
          zIndex={"banner"}
        />
        <ModalContent
          w={"auto"}
          h={"100%"}
          bg={"transparent"}
          position={"fixed"}
          left={"50%"}
          top={"10%"}
          boxShadow={"none"}
          transform={"translateX(-50%) !important"}
        >
          <ModalBody>
            <EventTicket isAbleToBuy={false} ticketData={eventData.ticket!} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Container
        h={"20rem"}
        pos={"relative"}
        overflow={"hidden"}
        zIndex={"base"}
        bg={"#000"}
      >
        {!eventData?.image && (
          <Text
            color={"textContrastSecondary"}
            pos={"absolute"}
            top={"50%"}
            left={"50%"}
            transform={"translate(-50%,-50%)"}
          >
            Your cover will be here
          </Text>
        )}
        {eventData?.image && (
          <Flex justify={"center"}>
            <Box
              position={"absolute"}
              mt={"0rem"}
              left={0}
              h={"20rem"}
              zIndex={"base"}
              overflow={"hidden"}
            >
              <Image src={eventData?.image} w={"100vw"} filter={"blur(40px)"} />
            </Box>
            <Image
              src={eventData?.image}
              zIndex={"docked"}
              mt={"5rem"}
              px={"1rem"}
            />
          </Flex>
        )}
        <Box pos={"absolute"} top={"2rem"} zIndex={"overlay"}>
          <Text
            pos={"absolute"}
            top={"50%"}
            left={"45%"}
            color={"textContrast"}
            fontWeight={"bold"}
            fontSize={"sm"}
            transform={"translate(-50%,-50%)"}
          >
            Preview
          </Text>
          <Image src={"/icons/tag.svg"} />
        </Box>
        {eventData.mediaLinks && (
          <Flex
            pos={"absolute"}
            top={"2rem"}
            right={"2rem"}
            zIndex={"overlay"}
            direction={"column"}
            gap={".5rem"}
          >
            {Object.keys(eventData.mediaLinks).map(
              (mediaLinkId) =>
                mediaLinkId != SocialMediaIds.Site &&
                eventData.mediaLinks?.[mediaLinkId as SocialMediaIds] &&
                socialMediaIdToComponentMap[mediaLinkId as SocialMediaIds] && (
                  <Link
                    href={eventData.mediaLinks[mediaLinkId]!}
                    target={"_blank"}
                  >
                    <IconButton
                      variant={"icon"}
                      as={motion.div}
                      aria-label={mediaLinkId}
                      initial={fadeRightSlideAnimation["false"]}
                      animate={fadeRightSlideAnimation["true"]}
                      icon={socialMediaIdToComponentMap[mediaLinkId]!}
                    />
                  </Link>
                )
            )}
          </Flex>
        )}
      </Container>
      <Container
        variant={"undersceen"}
        pos={"absolute"}
        bg={"accentPrimary"}
        zIndex={"docked"}
        px={"2rem"}
      >
        <Flex
          paddingTop={"2rem"}
          direction={"column"}
          pos={"relative"}
          gap={"2rem"}
        >
          <Container pos={"absolute"} top={"-.5rem"} zIndex={"overlay"}>
            <Flex
              pos={"absolute"}
              bottom={"1rem"}
              gap={"3rem"}
              zIndex={"overlay"}
            >
              <Flex gap={".5rem"} align={"center"}>
                <Image src="/icons/calendar.svg"></Image>
                <Text
                  color={"textContrast"}
                  whiteSpace={"nowrap"}
                  fontSize={["sm"]}
                >
                  {eventData?.date?.[0] || "date"}
                  {eventData?.time?.[0] && (
                    <Text
                      color={"textContrast"}
                      whiteSpace={"nowrap"}
                      lineHeight={".5rem"}
                      fontSize={["xs"]}
                    >
                      {eventData?.time?.[0]}
                    </Text>
                  )}
                </Text>
                {eventData?.date?.[1] && (
                  <Flex gap={".5rem"} align={"center"}>
                    <ArrowForwardIcon color={"textContrast"} />
                    <Text
                      color={"textContrast"}
                      whiteSpace={"nowrap"}
                      fontSize={["sm"]}
                    >
                      {eventData?.date?.[1]}
                      {eventData?.time?.[1] && (
                        <Text
                          color={"textContrast"}
                          whiteSpace={"nowrap"}
                          lineHeight={".5rem"}
                          fontSize={["xs"]}
                        >
                          {eventData?.time?.[1]}
                        </Text>
                      )}
                    </Text>
                  </Flex>
                )}
              </Flex>

              <Popover>
                <PopoverTrigger>
                  <Flex gap={".5rem"} align={"center"} cursor={"pointer"}>
                    <Image src="/icons/location.svg"></Image>
                    <Text
                      color={"textContrast"}
                      maxW={["13rem", "13rem", "13rem", "13rem", "19rem"]}
                      fontSize={["sm"]}
                      whiteSpace={"nowrap"}
                      overflow={"hidden"}
                      textOverflow={"ellipsis"}
                    >
                      {eventData?.location || "location"}
                    </Text>
                  </Flex>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverCloseButton />
                  <PopoverBody>{eventData?.location || "location"}</PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
            <Flex
              pos={"absolute"}
              bottom={"3rem"}
              zIndex={"docked"}
              w={"100%"}
              left={"50%"}
              transform={"translateX(-50%)"}
            >
              <Heading
                color={"textContrast"}
                maxW={"100%"}
                overflow={"hidden"}
                fontSize="3xl"
                textOverflow={"ellipsis"}
              >
                {eventData?.name || "event title"}
              </Heading>
            </Flex>
          </Container>
          <Container variant="contrastAccent">
            <Flex justify={"space-between"} align={"center"}>
              <Flex gap={"2rem"}>
                <Flex
                  direction={"column"}
                  justify={"space-between"}
                  gap={".5rem"}
                >
                  <Heading color={"textContrast"} fontSize={"md"}>
                    minting price
                  </Heading>
                  <Flex align={"flex-end"} gap={".5rem"}>
                    <Text
                      color={"textAccent"}
                      fontSize={"3xl"}
                      fontWeight="bold"
                    >
                      {eventData?.eventTicketPriceLabel}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  direction={"column"}
                  justify={"space-between"}
                  gap={".5rem"}
                >
                  <Heading color={"textContrast"} fontSize={"md"}>
                    Total supply
                  </Heading>
                  <Text
                    color={"textContrast"}
                    fontSize={"3xl"}
                    fontWeight="bold"
                  >
                    {eventData?.eventTicketsSupplyLabel}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Container>
          <Flex
            flexDir={"column"}
            gap={"2rem"}
            maxH={"18rem"}
            overflowY={"scroll"}
          >
            <Flex direction={"column"} px={"1rem"}>
              <Heading
                fontSize={"md"}
                color={"textContrastSecondary"}
                fontWeight={"md"}
              >
                Short Description
              </Heading>
              <Text color={"textContrast"} mt={".5rem"} whiteSpace={"pre-wrap"}>
                {eventData?.shortDescription || "-"}
              </Text>
            </Flex>
            <Flex direction={"column"} px={"1rem"}>
              <Heading
                fontSize={"md"}
                color={"textContrastSecondary"}
                fontWeight={"md"}
              >
                Long Description
              </Heading>
              <Text color={"textContrast"} mt={".5rem"} whiteSpace={"pre-wrap"}>
                {eventData?.longDescription || "-"}
              </Text>
            </Flex>
            <Flex direction={"column"} px={"1rem"}>
              <Heading
                fontSize={"md"}
                color={"textContrastSecondary"}
                fontWeight={"md"}
              >
                Contact Information
              </Heading>
              {eventData?.mediaLinks?.[SocialMediaIds.Site] ? (
                <Link
                  mt="1rem"
                  href={eventData.mediaLinks[SocialMediaIds.Site]!}
                  target={"_blank"}
                >
                  <Button
                    variant={"icon"}
                    p={"1rem"}
                    as={motion.div}
                    initial={fadeRightSlideAnimation["false"]}
                    animate={fadeRightSlideAnimation["true"]}
                  >
                    {eventData.mediaLinks[SocialMediaIds.Site]}
                    <LinkIcon ml=".5rem" />
                  </Button>
                </Link>
              ) : (
                <Text color={"textContrast"} mt={".5rem"}>
                  -
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Container>
  );
};

export default EventPreview;
