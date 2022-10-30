import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  StylesProvider,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { KeyboardEventHandler, useEffect, useState } from "react";
import date from "date-and-time";
import { CreatableSelect } from "chakra-react-select";
import {
  defaultDateFormat,
  formatWalletAddress,
  useAppSelector,
} from "helpers/hooks";
import { isAddress } from "ethers/lib/utils";
import { CalendarIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  getEventTicketNativeCurrencyPriceLabel,
  getEventTicketPriceLabel,
} from "./helpers/events";
import { useAccount } from "wagmi";
import { BigNumberish } from "ethers";
import { motion } from "framer-motion";
import { fadeTopSlideAnimation } from "styles/theme";
import Link from "next/link";

export type CheckoutModalProps = Omit<ModalProps, "children"> & {
  event: {
    id?: string;
    name?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    image?: string;
  };
  ticketTier: {
    name?: string;
    price?: BigNumberish;
  };
  hasTicket?: boolean;
  isCompletingPurchase?: boolean;
  isPurchaseCompleted?: boolean;
  onCompletePurchaseButtonClick?: (ticketRecievers: string[]) => any;
};

export const Component = (props: CheckoutModalProps) => {
  const [ticketRecieversInputValue, setTicketRecieversInputValue] =
    useState<string>();
  const { address: connectedWalletAddress } = useAccount();

  const [ticketRecievers, setTicketRecievers] = useState<{}[]>([]);
  const toast = useToast();
  const nativeCurrencyToUsdPrice = useAppSelector(
    (state) => state.app.nativeCurrencyToUsdPrice
  );

  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false);

  useEffect(() => {
    setTicketRecievers([]);
  }, [props.isOpen]);

  const onKeyDownTicketRecieversInput: KeyboardEventHandler<HTMLDivElement> = (
    event
  ) => {
    if (!ticketRecieversInputValue) return;

    switch (event.key) {
      case "Enter":
      case "Tab":
        setTicketRecieversInputValue("");

        if (
          props.hasTicket &&
          connectedWalletAddress != ticketRecieversInputValue &&
          isAddress(ticketRecieversInputValue) &&
          !ticketRecievers.filter(
            ({ value }) => value == ticketRecieversInputValue
          ).length
        ) {
          setTicketRecievers([
            ...ticketRecievers,
            {
              label: formatWalletAddress(ticketRecieversInputValue),
              value: ticketRecieversInputValue,
            },
          ]);
        } else {
          toast({
            title: "invalid address",
            status: "error",
            isClosable: true,
          });
        }

        event.preventDefault();
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      closeOnEsc={!props.isCompletingPurchase}
      closeOnOverlayClick={!props.isCompletingPurchase}
    >
      <ModalOverlay></ModalOverlay>
      <ModalContent
        width={"30rem"}
        minH={"29rem"}
        maxW={"calc(100vw - 1rem)"}
        bg={"accentPrimary"}
        paddingY={"2rem"}
        pos={"relative"}
      >
        <Flex
          as={motion.div}
          flexDir={"column"}
          gap="1rem"
          px={"2rem"}
          transition={".2s"}
          justify={"space-between"}
          flex={1}
          pointerEvents={props.isPurchaseCompleted ? "none" : "initial"}
          animate={props.isPurchaseCompleted ? { filter: "blur(20px)" } : {}}
        >
          <Flex flexDir={"column"} gap="1rem">
            <Flex flex={1} alignItems={"center"} justify={"space-between"}>
              <Heading color="textContrast">Checkout</Heading>
              <ModalCloseButton
                isDisabled={props.isCompletingPurchase}
                pos={"relative"}
                top={0}
                right={0}
                color={"textContrastSecondary"}
                size={"lg"}
              />
            </Flex>
            <Flex flexDir={"column"} gap=".25rem" maxW={"100%"}>
              <Flex gap="1rem">
                <CreatableSelect
                  chakraStyles={{
                    control: (style) => ({
                      ...style,
                      border: "1px",
                      borderRadius: "md",
                      padding: ".5rem .25rem",
                    }),
                    multiValue: (style) => ({
                      ...style,
                      bg: "accentSecondary",
                      color: "bg",
                      padding: ".25rem 1rem",
                      height: "20px",
                      marginRight: ".5rem",
                      fontWeight: "semibold",
                    }),
                    inputContainer: (style) => ({
                      ...style,
                      maxWidth: "5rem",
                    }),
                    container: () => ({
                      background: "transparent",
                      borderRadius: "sm",
                      color: "#fff",
                      flex: 1,
                    }),
                    placeholder: () => ({
                      color: "textContrastSecondary",
                    }),
                    clearIndicator: () => ({
                      color: "#fff",
                      mt: "-.25rem",
                      mr: "1rem",
                    }),
                  }}
                  placeholder="Buy tickets for..."
                  components={{ DropdownIndicator: null }}
                  isClearable
                  isMulti
                  menuIsOpen={false}
                  inputValue={ticketRecieversInputValue}
                  onChange={(value) => setTicketRecievers(value)}
                  onInputChange={setTicketRecieversInputValue}
                  onKeyDown={onKeyDownTicketRecieversInput}
                  value={ticketRecievers}
                />
                {!props.hasTicket && (
                  <Button
                    variant={"accent"}
                    isDisabled={
                      !!ticketRecievers?.filter(
                        ({ value }) => value == connectedWalletAddress
                      ).length
                    }
                    onClick={() =>
                      setTicketRecievers([
                        ...ticketRecievers,
                        { label: "me", value: connectedWalletAddress },
                      ])
                    }
                  >
                    Me
                  </Button>
                )}
              </Flex>
              <Text color={"textContrastSecondary"} fontSize="sm">
                type in wallet address and press enter
              </Text>
              {props.hasTicket && (
                <Text color={"textContrast"} fontSize="sm">
                  you already have a ticket and can only buy tickets for others
                </Text>
              )}
            </Flex>
            <Flex gap={"1rem"}>
              <Flex flexDirection={"column"} gap={".5rem"} maxW={"100%"}>
                <Text
                  fontWeight={"bold"}
                  color={"textContrast"}
                  fontSize={"1.25rem"}
                >
                  {props.event.name}
                </Text>
                <Flex mt={"1rem"} gap={".5rem"} alignItems={"center"}>
                  <Image
                    src="/icons/ticket.svg"
                    opacity={0.8}
                    w={"1rem"}
                    h={"1rem"}
                    mt=".25rem"
                    alignSelf={"flex-start"}
                  ></Image>
                  <Text color={"textContrastAccent"}>
                    {props.ticketTier.name}
                  </Text>
                </Flex>
                {props.event.startDate && (
                  <Flex gap={".75rem"} alignItems={"center"}>
                    <Image
                      src="/icons/calendar.svg"
                      opacity={0.8}
                      w={"1rem"}
                      h={"1rem"}
                      mt=".25rem"
                      alignSelf={"flex-start"}
                    ></Image>
                    <Text color={"textContrastAccent"}>
                      {date.format(
                        new Date(props.event.startDate),
                        defaultDateFormat
                      )}
                    </Text>
                  </Flex>
                )}
                {props.event.location && (
                  <Flex gap={".75rem"} alignItems={"center"}>
                    <Image
                      src="/icons/location.svg"
                      opacity={0.8}
                      w={"1rem"}
                      h={"1rem"}
                      mt=".25rem"
                      alignSelf={"flex-start"}
                    ></Image>
                    <Text color={"textContrastAccent"}>
                      {props.event.location}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex
            flexDirection={["column", "row"]}
            justifyContent={["space-between"]}
            gap={"1rem"}
            alignItems={["center", "flex-end"]}
          >
            <Flex direction={"column"} mt=".5rem">
              <Flex align={"flex-start"} flexDir="column">
                <Text color={"textAccent"} fontSize={"2xl"} fontWeight="bold">
                  {getEventTicketPriceLabel({
                    price: props.ticketTier.price,
                    isFree: !+props.ticketTier.price,
                  })}
                </Text>
                {!!+props.ticketTier.price && nativeCurrencyToUsdPrice && (
                  <Text
                    color={"textContrastSecondary"}
                    fontSize="sm"
                    lineHeight={"1em"}
                  >
                    {getEventTicketNativeCurrencyPriceLabel(
                      { price: props.ticketTier.price },
                      nativeCurrencyToUsdPrice
                    )}
                  </Text>
                )}
              </Flex>
            </Flex>
            <Button
              variant={"accent"}
              alignSelf={["center", "flex-end"]}
              isLoading={props.isCompletingPurchase}
              isDisabled={!ticketRecievers.length}
              onClick={() =>
                props.onCompletePurchaseButtonClick(
                  ticketRecievers?.map(({ value }) => value)
                )
              }
            >
              Complete Purchase
            </Button>
          </Flex>
        </Flex>
        {props.isPurchaseCompleted && (
          <Flex
            as={motion.div}
            pos={"absolute"}
            top={"50%"}
            left={"50%"}
            flexDir={"column"}
            align={"center"}
            gap={"2rem"}
            initial={{ opacity: 0, x: "-50%", y: "0%" }}
            animate={{ opacity: 1, x: "-50%", y: "-50%" }}
          >
            <Box h="9rem" paddingTop={"4rem"}>
              <motion.img
                src="/startScreenGraphics/pic3.png"
                style={{
                  position: "fixed",
                  width: "5rem",
                }}
                initial={{ left: "40%", top: "-100%", rotate: 60 }}
                animate={{ top: ["13%", "14%", "13%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                  duration: 2,
                }}
              ></motion.img>
              <motion.img
                src="/startScreenGraphics/pic1.png"
                style={{
                  position: "fixed",
                  width: "8rem",
                }}
                initial={{ left: "-10%", top: "-100%", rotate: 280 }}
                animate={{ top: ["0%", "-2%", "0%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                  duration: 3,
                }}
              ></motion.img>
              <motion.img
                src="/startScreenGraphics/pic5.png"
                style={{
                  position: "fixed",
                  width: "15rem",
                }}
                initial={{ left: "0", top: "-100%" }}
                animate={{ top: ["-25%", "-23%", "-25%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                  duration: 4,
                }}
              ></motion.img>
            </Box>
            <Text color="textContrast" fontSize={"2xl"} fontWeight={"bold"}>
              All done!
            </Text>
            <Link
              href={`${global.location.origin}/#event?id=${props.event.id}`}
            >
              <Button variant={"accent"}>
                See My Tickets
                <ExternalLinkIcon ml={".5rem"} />
              </Button>
            </Link>
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Component;
