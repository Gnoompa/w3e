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
  IconButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { fadeTopSlideAnimation } from "styles/theme";
import TwitterIcon from "../public/icons/twitter";
import TelegramIcon from "../public/icons/tg";
import LensterIcon from "../public/icons/lenster";

const Component = forwardRef((props, ref) => {
  return (
    <Flex
      m={"3rem 0"}
      {...props}
      ref={ref}
      w="100%"
      maxWidth={"calc(100vw - 2rem)"}
    >
      <Flex direction={"column"} flex={1}>
        <Container
          variant={"contrast"}
          maxWidth={"1336px"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={["column", "row"]}
          justifyContent="space-between"
          gap={"2rem"}
        >
          <Heading fontSize={"xx-large"} color={"textContrast"}>
            Web3Events
          </Heading>
          <Flex gap={"1rem"}>
            <Link href={"https://twitter.com/Web3Events_ai"} target={"_blank"}>
              <IconButton
                variant={"socialIcon"}
                aria-label={"twitter"}
                icon={<TwitterIcon />}
              />
            </Link>
            <Link
              href={"https://lenster.xyz/u/web3events.lens"}
              target={"_blank"}
            >
              <IconButton
                variant={"socialIcon"}
                aria-label={"lenster"}
                icon={<LensterIcon width="1.5rem" />}
              />
            </Link>
            <Link href={"https://t.me/web3events_eng"} target={"_blank"}>
              <IconButton
                variant={"socialIcon"}
                aria-label={"telegram"}
                icon={<TelegramIcon width="1.5rem" />}
              />
            </Link>
          </Flex>
        </Container>
      </Flex>
    </Flex>
  );
});

export default Component;
