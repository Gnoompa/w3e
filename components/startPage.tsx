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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Routes } from "helpers/routes";
import Head from "next/head";
import { useTheme } from "@emotion/react";
import NextLink from "next/link";

const StartPage: NextPage = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Container variant="padded" mt={["5rem", 0]}>
      <Flex position={"relative"}>
        <Image
          src="/startPageGraphics.png"
          filter={["blur(40px)", "none"]}
        ></Image>
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
              fontSize={["xx-large", "xx-large", "xxx-large"]}
              fontWeight={"black"}
            >
              Web3Events
            </Heading>
            <Heading
              whiteSpace={"nowrap"}
              mt={[".25em", ".25em", "1em"]}
              as="h2"
              variant="contrastFaded"
              fontSize={["lg", "2xl"]}
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
                as="h2"
                variant="contrastFaded"
                fontSize={["lg", "lg", "2xl"]}
                fontWeight={"md"}
              >
                Collab & share profit.
              </Heading>

              <Heading
                whiteSpace={["nowrap"]}
                as="h2"
                variant="contrastFaded"
                fontSize={["lg", "lg", "2xl"]}
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
                variant="contrastFaded"
                fontSize={["lg", "lg", "2xl"]}
                fontWeight={"md"}
              >
                Invest in events.
              </Heading>
            </Flex>
            <Flex mt={["4rem", "1rem", "4rem"]}>
              <Button  variant={"accent"}>
                <NextLink href={Routes.EventForm}>organize new event</NextLink>
              </Button>
              <Link></Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default StartPage;
