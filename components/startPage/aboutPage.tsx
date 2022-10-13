import {
  Flex,
  Box,
  Container,
  Heading,
  Image,
  Text,
  Highlight,
} from "@chakra-ui/react";
import { forwardRef } from "react";

const AboutPage = forwardRef((props, ref) => {
  return (
    <Flex mt={"3rem"} {...props} ref={ref}>
      <Flex direction={"column"} flex={1}>
        <Container variant={"contrast"} maxWidth={"1336px"}>
          <Heading color={"textContrast"} fontSize="3rem">
            <Highlight query={["we"]} styles={{ color: "textAccent" }}>
              What do we offer
            </Highlight>{" "}
          </Heading>
          <Flex mt="4rem" gap={"2rem"} direction={"column"}>
            <Container variant={"contrastAccent"}>
              <Flex
                direction={["column", "column", "column", "row"]}
                align={"center"}
              >
                <Image src={"/about/1.png"} w={["30rem"]} />
                <Flex
                  mt={["2rem", "2rem", "2rem", 0]}
                  flex={1}
                  align={"center"}
                  justify={"center"}
                  px={["1rem", "1rem", "1rem", "5rem"]}
                >
                  <Flex
                    direction={"column"}
                    gap={"1rem"}
                    align={["center", "center", "center", "initial"]}
                  >
                    <Heading
                      color="textContrast"
                      fontSize={"1.25rem"}
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Event creation and ticketing tools
                    </Heading>
                    <Text
                      color="textContrastAccent"
                      fontSize={"lg"}
                      lineHeight="1.25rem"
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Everything you need to easily set up and sell tickets to
                      virtual and in-person events—all in one place use an
                      eco-friendly blockchain to drive transparency and
                      engagement while reducing fraud.
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Container>
            <Container variant={"contrastAccent"}>
              <Flex
                direction={["column", "column", "column", "row"]}
                align={"center"}
              >
                <Flex
                  mb={["2rem", "2rem", "2rem", 0]}
                  flex={1}
                  align={"center"}
                  justify={"center"}
                  px={["1rem", "1rem", "1rem", "5rem"]}
                >
                  <Flex
                    direction={"column"}
                    gap={"1rem"}
                    align={["center", "center", "center", "initial"]}
                  >
                    <Heading
                      color="textContrast"
                      fontSize={"1.25rem"}
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Widget integration on your website
                    </Heading>
                    <Text
                      color="textContrastAccent"
                      fontSize={"lg"}
                      lineHeight="1.25rem"
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Extend your existing flows by adding our widget to your
                      website in just couple lines of code. Customizeble by
                      default with ability to change font/colors/branding to
                      your liking.
                    </Text>
                  </Flex>
                </Flex>
                <Image src={"/about/3.png"} w={["30rem"]} />
              </Flex>
            </Container>
            {/* <Container variant={"contrastAccent"}>
              <Flex
                direction={["column", "column", "column", "row"]}
                align={"center"}
              >
                <Image src={"/about/2.png"} w={["30rem"]} />
                <Flex
                  mt={["2rem", "2rem", "2rem", 0]}
                  flex={1}
                  align={"center"}
                  justify={"center"}
                  px={["1rem", "1rem", "1rem", "5rem"]}
                >
                  <Flex
                    direction={"column"}
                    gap={"1rem"}
                    align={["center", "center", "center", "initial"]}
                  >
                    <Heading
                      color="textContrast"
                      fontSize={"1.25rem"}
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Benefits & Rewards
                    </Heading>
                    <Text
                      color="textContrastAccent"
                      fontSize={"lg"}
                      lineHeight="1.25rem"
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      VIP perks, special offers, and pre-sale purchase
                      opportunities.
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Container> */}
            <Container variant={"contrastAccent"}>
              <Flex
                direction={["column", "column", "column", "row"]}
                align={"center"}
              >
                <Image src={"/about/4.png"} w={["30rem"]} borderRadius={"md"} />
                <Flex
                  mt={["2rem", "2rem", "2rem", 0]}
                  flex={1}
                  align={"center"}
                  justify={"center"}
                  px={["1rem", "1rem", "1rem", "5rem"]}
                >
                  <Flex
                    direction={"column"}
                    gap={"1rem"}
                    align={["center", "center", "center", "initial"]}
                  >
                    <Heading
                      color="textContrast"
                      fontSize={"1.25rem"}
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Seamless Apple/Google wallet integration
                    </Heading>
                    <Text
                      color="textContrastAccent"
                      fontSize={"lg"}
                      lineHeight="1.25rem"
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Use your tickets in convinient ways with already
                      comfortable interface.
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Container>
            <Container variant={"contrastAccent"}>
              <Flex
                direction={["column", "column", "column", "row"]}
                align={"center"}
              >
                <Flex
                  mb={["2rem", "2rem", "2rem", 0]}
                  flex={1}
                  align={"center"}
                  justify={"center"}
                  px={["1rem", "1rem", "1rem", "5rem"]}
                >
                  <Flex
                    direction={"column"}
                    gap={"1rem"}
                    align={["center", "center", "center", "initial"]}
                  >
                    <Heading
                      color="textContrast"
                      fontSize={"1.25rem"}
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Dashboard for organizers
                    </Heading>
                    <Text
                      color="textContrastAccent"
                      fontSize={"lg"}
                      lineHeight="1.25rem"
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Track attendance, ticket sales, check-ins, predictions of
                      attendance - all in one place
                    </Text>
                  </Flex>
                </Flex>
                <Image src={"/about/5.png"} w={["30rem"]} borderRadius={"md"} />
              </Flex>
            </Container>
            <Container variant={"contrastAccent"}>
              <Flex
                direction={["column", "column", "column", "row"]}
                align={"center"}
              >
                <Image src={"/about/6.png"} w={["30rem"]} borderRadius={"md"} />
                <Flex
                  mt={["2rem", "2rem", "2rem", 0]}
                  flex={1}
                  align={"center"}
                  justify={"center"}
                  px={["1rem", "1rem", "1rem", "5rem"]}
                >
                  <Flex
                    direction={"column"}
                    gap={"1rem"}
                    align={["center", "center", "center", "initial"]}
                  >
                    <Heading
                      color="textContrast"
                      fontSize={"1.25rem"}
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Resale Royalties
                    </Heading>
                    <Text
                      color="textContrastAccent"
                      fontSize={"lg"}
                      lineHeight="1.25rem"
                      textAlign={["center", "center", "center", "initial"]}
                    >
                      Enable ticket issuers to receive a payment on every
                      resale.
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Container>
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
});

export default AboutPage;
