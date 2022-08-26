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
import { Flex, Box } from "@components/indexx";

const AboutPage: NextPage = () => {
  return (
    <Flex column alignItemsCenter justifyItemsCenter mt="5%">
      <Container variant="layout.container.accent" sx={{ width: "1296px" }}>
        <Heading variant="text.heading.contrast" as="h1">
          FAQ
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
