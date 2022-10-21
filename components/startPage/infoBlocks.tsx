import { ArrowForwardIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  Container,
  Heading,
  Image,
  Text,
  Highlight,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Link,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { fadeTopSlideAnimation } from "styles/theme";

const Component = forwardRef((props, ref) => {
  return (
    <Flex mt={"3rem"} {...props} ref={ref} w="100%">
      <Flex direction={"column"} flex={1}>
        <Container
          variant={"contrast"}
          maxWidth={"1336px"}
          px={["2rem", "2rem", "2rem", "14rem"]}
        >
          <Flex
            display={"grid"}
            gridTemplate={[
              '"1" "dominant" "2" "3" "4"',
              '"1" "dominant" "2" "3" "4"',
              '"1 dominant dominant" "2 3 4"',
            ]}
            gridGap="1rem"
          >
            <Container
              variant={"contrastAccent"}
              display="flex"
              flexDirection={"column"}
              gap={".5rem"}
            >
              <Container variant={"graphicsSmall"}>
                <Image src="/graphics/graphics4.png" />
              </Container>
              <Link href="https://dev.web3events.ai" target={"_blank"}>
                <Text
                  variant="accent"
                  fontWeight={"bold"}
                  fontSize="1.75rem"
                  mt=".5rem"
                >
                  Explore docs
                </Text>
              </Link>
              <Text
                color="textContrastAccent"
                fontSize={"lg"}
                lineHeight="1.25rem"
              >
                Get to know how to integrate our SDKs into your solution
              </Text>
            </Container>
            <Container
              variant={"contrastAccent"}
              display="flex"
              flexDirection={"column"}
              gap={".5rem"}
              bg="accentGradientSecondary"
              gridArea={"dominant"}
              justifyContent="center"
            >
              <Flex alignItems={"center"} gap="1rem">
                <Text color="#fff" fontWeight={"bold"} fontSize="1.75rem">
                  Governance Portal
                </Text>
                <Badge variant={"solid"} color={"warn"} bg={"accentPrimary"}>
                  soon
                </Badge>
              </Flex>
              <Text color="#fff" fontSize={"lg"} lineHeight="1.25rem">
                Vote on official Web3Events governance proposals and view past
                proposals
              </Text>
            </Container>
            <Container
              variant={"contrastAccent"}
              display="flex"
              flexDirection={"column"}
              gap={".5rem"}
            >
              <Container variant={"graphicsSmall"}>
                <Image src="/graphics/graphics4.png" />
              </Container>
              <Link
                href="https://roadmap.web3events.ai/b/j0x38r0q/feature-ideas"
                target={"_blank"}
              >
                <Text
                  color="textContrast"
                  fontWeight={"bold"}
                  fontSize="1.5rem"
                  mt=".5rem"
                >
                  Submit your ideas
                </Text>
              </Link>
              <Text
                color="textContrastAccent"
                fontSize={"lg"}
                lineHeight="1.25rem"
              >
                Participate by proposing features and discussing future of our
                platform
              </Text>
            </Container>
            <Container
              variant={"contrastAccent"}
              display="flex"
              flexDirection={"column"}
              gap={".5rem"}
              bg="accentGradient"
              justifyContent={"center"}
            >
              <Link
                href="https://roadmap.web3events.ai/roadmap"
                target={"_blank"}
              >
                <Text
                  color="text"
                  fontWeight={"bold"}
                  fontSize="1.75rem"
                  mt=".5rem"
                >
                  Public Roadmap
                  <ArrowForwardIcon ml={".5rem"} />
                </Text>
              </Link>
              <Text color="accent" fontSize={"lg"} lineHeight="1.25rem">
                Check out our plans ought to become reality
              </Text>
            </Container>
            <Container
              variant={"contrastAccent"}
              display="flex"
              flexDirection={"column"}
              gap={".5rem"}
            >
              <Container variant={"graphicsSmall"}>
                <Image src="/graphics/graphics4.png" />
              </Container>
              <Link href="https://test.web3events.ai/" target={"_blank"}>
                <Text
                  variant="accent"
                  fontWeight={"bold"}
                  fontSize="1.75rem"
                  mt=".5rem"
                >
                  Try demo-mode
                </Text>
              </Link>
              <Text
                color="textContrastAccent"
                fontSize={"lg"}
                lineHeight="1.25rem"
              >
                <Highlight query={["`test`"]} styles={{ color: "textAccent" }}>
                  Read how you can create and preview events using `test`
                  infrastructure
                </Highlight>
              </Text>
            </Container>
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
});

export default Component;
