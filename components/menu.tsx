import React from "react";
import {
  Badge,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import NextLink from "next/link";
import { Routes } from "helpers/routes";

export const MenuBreakpointValue = () =>
  useBreakpointValue(
    {
      base: (
        <Menu>
          <MenuButton
            as={IconButton}
            bg={"transparent"}
            aria-label="Menu"
            fontSize={"3xl"}
            icon={<HamburgerIcon />}
          />
          <MenuList>
            <MenuItem>
              <NextLink href={Routes.EventForm} passHref>
                <Link>Events</Link>
              </NextLink>
            </MenuItem>
            <MenuItem>
              <NextLink href={Routes.EventExplorer} passHref>
                <Link>Explore</Link>
              </NextLink>
            </MenuItem>
            <MenuItem>
              <Flex align={"center"} gap=".5rem">
                <Link>Subscriptions</Link>
                <Badge variant={"solid"} color={"warn"} bg={"accentPrimary"}>
                  soon
                </Badge>
              </Flex>
            </MenuItem>
            {/* <MenuItem>
              <NextLink href={Routes.FAQ} passHref>
                <Link>FAQ</Link>
              </NextLink>
            </MenuItem> */}
          </MenuList>
        </Menu>
      ),
      lg: (
        <Flex gap={9}>
          <Menu>
            <MenuButton>
              <Flex align={"center"} gap={".5rem"} fontWeight="medium">
                Create
                <ChevronDownIcon />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem>
                <NextLink href={Routes.EventForm}>
                  <Flex align={"center"} gap={"2rem"}>
                    <Flex direction={"column"} gap={".25rem"}>
                      <Text fontSize={"md"} fontWeight="medium">
                        Events
                      </Text>
                      <Text
                        maxW={"12rem"}
                        fontSize="sm"
                        color={"textContrastSecondary"}
                      >
                        General event creation platform, backed by NFT
                        technology
                      </Text>
                    </Flex>
                    <ChevronRightIcon w={"1.5rem"} h="1.5rem" />
                  </Flex>
                </NextLink>
              </MenuItem>
              <MenuItem>
                <Flex align={"center"} gap={"2rem"}>
                  <Flex direction={"column"} gap={".25rem"}>
                    <Flex align={"center"} gap=".5rem">
                      <Text fontSize={"md"} fontWeight="medium">
                        Subscriptions
                      </Text>
                      <Badge
                        variant={"solid"}
                        color={"warn"}
                        bg={"accentPrimary"}
                      >
                        soon
                      </Badge>
                    </Flex>
                    <Text
                      maxW={"12rem"}
                      fontSize="sm"
                      color={"textContrastSecondary"}
                    >
                      Tie physical world subscriptions to blockchain backed
                      infrastructure
                    </Text>
                  </Flex>
                  <ChevronRightIcon
                    w={"1.5rem"}
                    h="1.5rem"
                    color={"textContrastSecondary"}
                  />
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>
          <Flex align={"center"} gap=".5rem">
            <NextLink href={Routes.EventExplorer}>
              <Text fontSize={"md"} fontWeight="medium" cursor={"pointer"}>
                Explore
              </Text>
              {/* <Badge variant={"solid"} color={"warn"} bg={"accentPrimary"}>
            soon
          </Badge> */}
            </NextLink>
          </Flex>
          {/* <Link href={Routes.FAQ}>
            <NextLink href={Routes.FAQ} passHref>
              <Text fontSize={"md"} fontWeight="medium" cursor={"pointer"}>
                FAQ
              </Text>
            </NextLink>
          </Link> */}
        </Flex>
      ),
    },
    { ssr: false }
  );

export default MenuBreakpointValue;
