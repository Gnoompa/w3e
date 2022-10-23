import {
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
import { CreatableSelect } from "chakra-react-select";
import { formatWalletAddress, useAppSelector } from "helpers/hooks";
import { isAddress } from "ethers/lib/utils";
import { CalendarIcon } from "@chakra-ui/icons";
import {
  getEventTicketNativeCurrencyPriceLabel,
  getEventTicketPriceLabel,
} from "./helpers/events";
import { useAccount } from "wagmi";
import { BigNumberish } from "ethers";

export type CheckoutModalProps = Omit<ModalProps, "children"> & {
  event: {
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
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay></ModalOverlay>
      <ModalContent
        width={"30rem"}
        maxW={"calc(100vw - 1rem)"}
        bg={"accentPrimary"}
        paddingY={"2rem"}
      >
        <Flex flexDir={"column"} gap="1rem" px={"2rem"}>
          <Flex flex={1} alignItems={"center"} justify={"space-between"}>
            <Heading color="textContrast">Checkout</Heading>
            <ModalCloseButton
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
            <Flex flexDirection={"column"} gap={".5rem"}>
              <Text
                fontWeight={"bold"}
                color={"textContrast"}
                fontSize={"1.25rem"}
              >
                {props.event.name}
              </Text>
              {props.event.startDate && (
                <Flex gap={".75rem"} mt=".5rem" alignItems={"center"}>
                  <Image
                    src="/icons/calendar.svg"
                    opacity={0.8}
                    w={"1rem"}
                    h={"1rem"}
                  ></Image>
                  <Text color={"textContrastAccent"}>
                    {props.event.startDate}
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
                  ></Image>
                  <Text color={"textContrastAccent"}>
                    {props.event.location}
                  </Text>
                </Flex>
              )}
              <Flex gap={".75rem"} alignItems={"center"}>
                <Image
                  src="/icons/ticket.svg"
                  opacity={0.8}
                  w={"1rem"}
                  h={"1rem"}
                ></Image>
                <Text color={"textContrastAccent"}>
                  {props.ticketTier.name}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex justifyContent={"space-between"} alignItems={"flex-end"}>
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
              alignSelf={"flex-end"}
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
      </ModalContent>
    </Modal>
  );
};

export default Component;
