import type { NextPage } from "next";
import { Flex, Button, Link, Image, Heading } from "theme-ui";
import { useRouter } from "next/router";
import { Routes } from "helpers/routes";

const StartPage: NextPage = () => {
  const router = useRouter();

  return (
    <Flex
      bg="bg"
      sx={{ flexDirection: "column", maxWidth: "100%", position: "relative" }}
    >
      <Flex
        sx={{
          flexDirection: "column",
          width: "100%",
          gap: "2rem",
          maxWidth: "1280px",
          position: "relative",
          margin: "10rem auto",
          alignItems: "center",
        }}
      >
		<Heading variant="text.heading.accent" as="h1">
			Web3Events
		</Heading>
        <Image src="/startPageGraphics.png"></Image>
        <Flex
          sx={{
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Flex
            sx={{
              flexDirection: "column",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Button
              variant="accent"
              onClick={() => router.push(Routes.EventForm)}
            >
              create new event
            </Button>
          </Flex>
          <Flex sx={{ gap: "2rem" }}>
            <Link href="/about.html" target="_blank">
              about
            </Link>
            <Link href="/faq.html" target="_blank">
              FAQ
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StartPage;
