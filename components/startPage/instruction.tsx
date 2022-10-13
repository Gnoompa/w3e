import { CheckCircleIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { fadeTopSlideAnimation } from "styles/theme";

const Component = forwardRef((props, ref) => {
  const [mainTabIndex, setMainTabIndex] = useState<number>(0);
  const tabIndexToInstructionsMap = [
    [
      {
        title: "Create your event",
        text: "Add a description, upload some photos, make your event the place to be. Customize ticket types and access tiers",
      },
      {
        title: "Publish it",
        text: "As soon as you are ready to move forward, publish your event and start promoting it",
      },
      {
        title: "Promote & sell on different platforms",
        text: "Use our widgets so you can implement ticket sales on your website in a matter of minutes. We are also working on integrating our solution into multiple popular aggregators, so this is coming soon",
      },
      {
        title: "Drive community engagement",
        text: "Airdrop or raffle unique content to ticket-holders, give prior attendees access to perks",
      },
    ],

    [
      {
        title: "Find something cool to do",
        text: "Check-out viral events happening near you, or just search for the specific category you're interested in",
      },
      {
        title: "Easily purchase NFT tickets",
        text: "Connect a wallet, purchase tickets and get access to ticket-gated content",
      },
      {
        title: "Validate ticket on arrival",
        text: "Just go to our website and generate a unique QR code to show at check-in. Or hold your NFT ticket in your favorite mobile wallet",
      },
      {
        title: "Never lose access to your tickets",
        text: "Since all tickets on our platform are NFTs, you will never lose access to your ticket.",
      },
    ],
  ];

  return (
    <Flex mt={"3rem"} {...props} ref={ref}>
      <Flex direction={"column"} flex={1}>
        <Container variant={"contrast"} maxWidth={"1336px"}>
          <Heading
            color={"textContrast"}
            textAlign="center"
            fontSize={["3rem"]}
          >
            <Highlight query={["?"]} styles={{ color: "textAccent" }}>
              How it works?
            </Highlight>
          </Heading>
          <Tabs
            onChange={setMainTabIndex}
            variant="switch"
            zIndex={1}
            m="4rem auto"
            maxW={"20rem"}
          >
            <TabList pos={"relative"}>
              <Tab w={"50%"} gap="1rem">
                <Flex>Host</Flex>
              </Tab>
              <Tab w={"50%"}>Participant</Tab>
              <Box
                as={motion.div}
                className="switchTabIndicator"
                ml={mainTabIndex ? "-.25rem" : ".25rem"}
                width="calc(50%)"
                animate={{ left: `${(mainTabIndex / 2) * 100}%` }}
              ></Box>
            </TabList>
          </Tabs>
          <Tabs index={mainTabIndex} mt={"5rem"} pos={"relative"}>
            <TabPanels>
              {tabIndexToInstructionsMap.map((tab, tabIndex) => (
                <TabPanel
                  as={motion.div}
                  animate={fadeTopSlideAnimation[`${mainTabIndex == tabIndex}`]}
                  display="grid"
                  gridTemplateAreas={[
                    '"tab_0" "tab_1" "tab_2" "tab_3"',
                    '"tab_0" "tab_1" "tab_2" "tab_3"',
                    '". tab_0" "tab_1 ." ". tab_2" "tab_3 ."',
                  ]}
                  gridColumnGap="6rem"
                  gridRowGap={["2rem", "2rem", 0]}
                  gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]}
                >
                  {tabIndexToInstructionsMap[mainTabIndex].map(
                    (instruction, index) => (
                      <Flex
                        direction={"column"}
                        gridArea={"tab_" + index}
                        gap="1rem"
                        alignItems={[
                          "center",
                          "center",
                          index % 2 ? "flex-end" : "flex-start",
                        ]}
                        marginTop={[0, 0, index != 0 ? "-2rem" : 0]}
                      >
                        <Container variant={"graphics"}>
                          <Image src={`/graphics/graphics${index + 1}.png`} />
                        </Container>
                        <Container
                          variant={"contrastAccent"}
                          display={"flex"}
                          flexDirection="column"
                          gap=".5rem"
                        >
                          <Text
                            fontSize={"1.25rem"}
                            fontWeight="semibold"
                            color="textContrast"
                          >
                            {instruction.title}
                          </Text>
                          <Text
                            color="textContrastAccent"
                            fontSize={"lg"}
                            lineHeight="1.25rem"
                          >
                            {instruction.text}
                          </Text>
                        </Container>
                      </Flex>
                    )
                  )}
                </TabPanel>
              ))}
            </TabPanels>
            <Box
              display={["none", "none", "block"]}
              position={"absolute"}
              bg="accentGradient"
              bottom={"-3rem"}
              height={"calc(100% + 5rem)"}
              left="50%"
              w={"1px"}
            ></Box>
          </Tabs>
        </Container>
      </Flex>
    </Flex>
  );
});

export default Component;
