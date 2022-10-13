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
  Link,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { fadeTopSlideAnimation } from "styles/theme";

const Component = forwardRef((props, ref) => {
  return (
    <Flex mt={"3rem"} {...props} ref={ref} width="100%">
      <Flex direction={"column"} flex={1}>
        <Container variant={"contrast"} maxWidth={"1336px"} py="2rem">
          <Heading
            color={"textContrast"}
            textAlign="center"
            textTransform={"none"}
            fontSize={["1.5rem"]}
          >
            <Highlight query={["by:"]} styles={{ color: "textContrastAccent" }}>
              Trusted by:
            </Highlight>
          </Heading>
          <Flex
            direction={["column", "column", "row"]}
            mt="2rem"
            gap="2rem"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Link target={"_blank"} href="https://www.eth-vietnam.com/">
              <Flex direction={"column"} gap="1rem" alignItems={"center"}>
                <Image src="/logo/ethvietnam.png" width={"10rem"} />
                <Text color="textContrastAccent">ETHVietnam conference</Text>
              </Flex>
            </Link>
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
});

export default Component;
