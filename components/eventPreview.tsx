import React from "react";
import { Flex, Box, Image, Text, Container, Heading } from "@chakra-ui/react";

export type EventProps = {
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  image?: string;
  location?: string;
  date?: string;
  eventTicketPriceLabel?: string;
  eventTicketsTotalSupply?: string;
};

const EventPreview = ({ eventData = {} }: { eventData?: EventProps }) => {
  return (
    <Container
      variant={"contrast"}
      px={0}
      py={0}
      pos={"relative"}
      w={"45rem"}
      minW={"35rem"}
      overflow={"hidden"}
      h={"100%"}
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
      <Container
        h={"20rem"}
        pos={"relative"}
        overflow={"hidden"}
        zIndex={"base"}
      >
        <Text
          color={"textContrastSecondary"}
          pos={"absolute"}
          top={"50%"}
          left={"50%"}
          transform={"translate(-50%,-50%)"}
        >
          Your cover will be here
        </Text>
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
      </Container>
      <Container
        variant={"undersceen"}
        pos={"absolute"}
        bg={"accentPrimary"}
        zIndex={"docked"}
        px={"2rem"}
      >
        <Container pos={"absolute"} top={"-.5 rem"} left={"2rem"} zIndex={"overlay"}>
          <Flex
            pos={"absolute"}
            bottom={"1rem"}
            gap={"3rem"}
            zIndex={"overlay"}
          >
            <Flex gap={".5rem"}>
              <Image src="/icons/calendar.svg"></Image>
              <Text color={"textContrast"} whiteSpace={"nowrap"}>
                {eventData?.date || "date"}
              </Text>
            </Flex>
            <Flex gap={".5rem"}>
              <Image src="/icons/location.svg"></Image>
              <Text color={"textContrast"} whiteSpace={"nowrap"}>
                {eventData?.location || "location"}
              </Text>
            </Flex>
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
              whiteSpace={"nowrap"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
            >
              {eventData?.name || "event title"}
            </Heading>
          </Flex>
        </Container>

        <Flex
          paddingTop={"2rem"}
          direction={"column"}
          pos={"relative"}
          gap={"2rem"}
        >
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
                      {eventData?.eventTicketPriceLabel || "-"}
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
                    {eventData?.eventTicketsTotalSupply || "-"}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Container>
          <Flex direction={"column"} px={"1rem"}>
            <Heading
              fontSize={"md"}
              color={"textContrastSecondary"}
              fontWeight={"md"}
            >
              Short Description
            </Heading>
            <Text color={"textContrast"} mt={".5rem"}>
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
            <Text color={"textContrast"} mt={".5rem"}>
              {eventData?.longDescription || "-"}
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Container>
  );
};

export default EventPreview;
