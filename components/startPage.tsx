import type { NextPage } from "next";
import {
  Flex,
  Button,
  Link,
  Image,
  Heading,
  Text,
  Highlight,
  useToken,
  Container,
  Box,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Routes } from "helpers/routes";
import Head from "next/head";
import { useTheme } from "@emotion/react";
import NextLink from "next/link";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import AboutPage from "./aboutPage";
import { useEffect, useRef, useState } from "react";
import StartPageGraphicsPlaceholder from "public/startScreenGraphics/startPageGraphicsPlaceholder";

const StartPage: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const aboutPageRef = useRef<HTMLElement>();
  const [initGraphics, setInitGraphics] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/ticket.png")]).finally(
      () => console.log(234) || setInitGraphics(true)
    );
  }, []);

  return (
    <Container
      display={"flex"}
      flexDir={"column"}
      variant="padded"
      mt={0}
      alignItems={"center"}
    >
      <Flex position={"relative"}>
        <Flex
          margin={"0 auto"}
          maxH={"max(35rem, calc(100vh - 15rem))"}
          maxW="1336px"
          filter={["blur(40px)", "none"]}
          pos={"relative"}
        >
          <Box
            w="1336px"
            h="780px"
            style={{
              maxHeight: "max(35rem, calc(100vh - 15rem))",
            }}
            maxW={["100vw", "fit-content"]}
            overflow="hidden"
            borderRadius={"lg"}
            position={"relative"}
          >
            <StartPageGraphicsPlaceholder
              style={{
                maxHeight: "max(35rem, calc(100vh - 15rem))",
                maxWidth: "fit-content",
              }}
            ></StartPageGraphicsPlaceholder>
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                right: "-300px",
                maxWidth: "20%",
              }}
              animate={
                initGraphics ? { right: 0 } : { y: "-100%", right: -300 }
              }
            >
              <Image src="/startScreenGraphics/pic1.png" />
            </motion.div>
            <motion.div
              style={{
                position: "absolute",
                bottom: 0,
                right: "-300px",
                maxWidth: "20%",
              }}
              animate={initGraphics ? { right: 0 } : { y: "100%", right: -300 }}
            >
              <Image src="/startScreenGraphics/pic2.png" />
            </motion.div>
            <motion.div
              style={{
                position: "absolute",
                bottom: "-150px",
                left: "50%",
                maxWidth: "20%",
              }}
              animate={
                initGraphics ? { x: "-50%", bottom: 0 } : { bottom: -150 }
              }
            >
              <Image src="/startScreenGraphics/pic3.png" />
            </motion.div>
            <motion.div
              style={{
                position: "absolute",
                bottom: 0,
                left: "-300px",
                maxWidth: "20%",
              }}
              animate={initGraphics ? { left: 0 } : { y: "-100%", left: -300 }}
            >
              <Image src="/startScreenGraphics/pic4.png" />
            </motion.div>
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: "-300px",
                maxWidth: "20%",
              }}
              animate={initGraphics ? { left: 0 } : { y: "100%", left: -300 }}
            >
              <Image src="/startScreenGraphics/pic5.png" />
            </motion.div>
          </Box>
        </Flex>
        <Flex direction={"column"} align={"center"}>
          <Flex
            direction={"column"}
            pos={"absolute"}
            top={"50%"}
            left={"50%"}
            transform={["translate(-50%, -25%)", "translate(-50%, -50%)"]}
            align={"center"}
          >
            <Heading
              as="h1"
              variant="contrast"
              fontSize={["xx-large", "xx-large", "xx-large", "xxx-large"]}
              fontWeight={"black"}
            >
              Web3Events
            </Heading>
            <Heading
              whiteSpace={"nowrap"}
              mt={[".25em", ".25em", "1em"]}
              as="h2"
              textTransform="none"
              variant="contrastFaded"
              fontSize={["lg", "lg", "lg", "2xl"]}
              fontWeight={"md"}
            >
              Create and receive tickets on blockchain
            </Heading>
            <Flex
              mt={["2em", ".5em"]}
              direction={["column", "column", "row"]}
              align={["center", "center", "initial"]}
              gap={".5em"}
            >
              <Heading
                whiteSpace={["nowrap"]}
                textTransform="none"
                as="h2"
                variant="contrastFaded"
                fontSize={["lg", "lg", "lg", "2xl"]}
                fontWeight={"md"}
              >
                Collab & share profit.
              </Heading>

              <Heading
                whiteSpace={["nowrap"]}
                textTransform="none"
                as="h2"
                variant="contrastFaded"
                fontSize={["lg", "lg", "lg", "2xl"]}
                fontWeight={"md"}
              >
                <Highlight
                  query={"Secondary market royalties."}
                  styles={theme.components.Highlight.baseStyle}
                >
                  Secondary market royalties.
                </Highlight>
              </Heading>
              <Heading
                whiteSpace={["nowrap"]}
                as="h2"
                textTransform="none"
                variant="contrastFaded"
                fontSize={["lg", "lg", "lg", "2xl"]}
                fontWeight={"md"}
              >
                Invest in events.
              </Heading>
            </Flex>
            <Flex mt={["4rem", "1rem", "4rem"]}>
              <NextLink href={Routes.EventForm}>
                <Button variant={"accent"}>organize new event</Button>
              </NextLink>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        onClick={(event) =>
          event.target?.scrollIntoView({ behavior: "smooth" })
        }
        align={"center"}
        justify="center"
        mt={"2.75rem"}
        bg="bg"
        border="2px solid"
        borderColor="textContrastSecondary"
        borderRadius="lg"
        w="2.5rem"
        h="3.5rem"
        style={{ cursor: "pointer" }}
      >
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          // @ts-ignore
          transition={{
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
            duration: 2,
          }}
        >
          <ArrowDownIcon
            color={"textContrastSecondary"}
            w="1.5rem"
            h="1.5rem"
          />
        </motion.div>
      </Flex>
      <AboutPage ref={aboutPageRef} />
    </Container>
  );
};

export default StartPage;
