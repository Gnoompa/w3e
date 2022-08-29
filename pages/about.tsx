import { NextPage } from "next";
import Image from "next/image";
import {
  Card,
  Heading,
  Text,
  Badge,
  Paragraph,
  Container,
  Label,
} from "theme-ui";
import { Flex, Box } from "@chakra-ui/react";

const AboutPage: NextPage = () => {
  return (
    <Flex direction={"column"} align={"center"} justify={"center"} mt="5%">
      <Container variant="layout.container.accent" sx={{ width: "1296px" }}>
        <Heading variant="text.heading.contrast" as="h1">
          About Us
        </Heading>
        <Paragraph mt="2rem" variant="text.paragraph.contrast">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus
          quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
          nihil.
        </Paragraph>
      </Container>
    </Flex>
  );
};

export default AboutPage;
