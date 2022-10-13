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
import AboutPage from "./startPage/aboutPage";
import { useEffect, useRef, useState } from "react";
import StartPageGraphicsPlaceholder from "public/startScreenGraphics/startPageGraphicsPlaceholder";
import InstructionSection from "./startPage/instruction";
import TrustedBySection from "./startPage/trustedBy";
import InfoBlocksSection from "./startPage/infoBlocks";

const StartPage: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const aboutPageRef = useRef<HTMLElement>();

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
              maxWidth: "calc(100vw - 2rem)",
            }}
            overflow="hidden"
            borderRadius={"lg"}
            position={"relative"}
          >
            <StartPageGraphicsPlaceholder
              style={{
                maxHeight: "max(35rem, calc(100vh - 15rem))",
                maxWidth: "calc(100vw - 2rem)",
                margin: "0 auto",
              }}
            ></StartPageGraphicsPlaceholder>
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
              fontSize={["1.5rem", "1.25rem", "1.5rem", "2.5rem"]}
              fontWeight={"black"}
              whiteSpace="nowrap"
            >
              <Highlight
                query={["NFT", "any"]}
                styles={{ color: "textAccent" }}
              >
                NFT tickets for any experience
              </Highlight>
            </Heading>
            <Heading
              mt={["1em"]}
              as="h2"
              textTransform="none"
              variant="contrastFaded"
              fontSize={["lg", "lg", "lg", "2xl"]}
              fontWeight={["semibold", "normal"]}
              textAlign="center"
              lineHeight={"1.5em"}
            >
              <Highlight query={["Web3Event's"]} styles={{ color: "bg" }}>
                Create, distribute and monitor tickets for events with
                Web3Event's Ticketing Platform
              </Highlight>
            </Heading>
            <Flex
              direction={["column", "row"]}
              mt={["4rem", "1rem", "4rem"]}
              gap="1rem"
            >
              <NextLink href={Routes.EventExplorer}>
                <Button variant={"outline"}>explore events</Button>
              </NextLink>
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
        bg={["transparent", "bg"]}
        border="2px solid"
        borderColor={["#fff", "textContrastSecondary"]}
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
            color={["#fff", "textContrastSecondary"]}
            w="1.5rem"
            h="1.5rem"
          />
        </motion.div>
      </Flex>
      <InstructionSection />
      <TrustedBySection />
      <AboutPage ref={aboutPageRef} />
      <InfoBlocksSection />
    </Container>
  );
};

export default StartPage;
