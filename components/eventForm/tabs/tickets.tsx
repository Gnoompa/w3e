import React, { useEffect, useContext, useState, ReactElement } from "react";
import {
  Flex,
  Button,
  Text,
  FormLabel,
  Textarea,
  Input,
  useDisclosure,
  FormControl,
  FormHelperText,
  Highlight,
  Select,
  CloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  InputGroup,
  InputLeftAddon,
  Spinner,
  Switch,
} from "@chakra-ui/react";
import FileUploader from "../../ui/fileUploader";
import { useAppSelector, useDebounce } from "helpers/hooks";
import {
  selectInvalidFields,
  setEventPoster,
  setTicketPosters,
} from "features/eventForm/eventFormSlice";
import { useAppDispatch } from "helpers/hooks";
import { AddIcon, QuestionIcon } from "@chakra-ui/icons";
import { default as TabContainer } from "./container";
import { setEventData as setEventPreviewData } from "features/eventForm/eventPreviewSlice";
import { upsertEvent } from "features/eventForm/eventPersistedFormSlice";
import { default as useEventFormValidationHook } from "../validationHook";
import { BigNumberish, ethers } from "ethers";
import { getNativeCurrencyToUsdPrice } from "helpers/contract";

const TicketsTab = () => {
  const dispatch = useAppDispatch();
  const { validateField, getIsFieldInvalid } = useEventFormValidationHook();
  const eventPersistedFormData = useAppSelector(
    (state) => state.eventPersistedForm
  );
  const eventFormData = useAppSelector((state) => state.eventForm);
  const eventPreviewData = useAppSelector((state) => state.eventPreview);
  const invalidEventFormFields = useAppSelector(selectInvalidFields);
  const [editingTicketIndex, setEditingTicketIndex] = useState<number>(0);

  const {
    isOpen: isEventTicketDescriptionFieldOpen,
    onOpen: onOpenEventTicketDescriptionField,
    onClose: onCloseEventTicketDescriptionField,
  } = useDisclosure();

  // const debouncedTicketPrice = useDebounce(
  //   eventPersistedFormData.ticketPrice,
  //   4000
  // );
  const [nativeCurrencyToUsdPrice, setNativeCurrencyToUsdPrice] =
    useState<BigNumberish>();
  const {
    data: nativeCurrencyToUsdPriceResponse,
    refetch: refetchNativeCurrencyToUsdPrice,
  } = getNativeCurrencyToUsdPrice();
  const [ticketNativeCurrencyPriceLabel, setTicketNativeCurrencyPriceLabel] =
    useState<string | ReactElement>();

  useEffect(() => {
    nativeCurrencyToUsdPriceResponse?.length &&
      setNativeCurrencyToUsdPrice(nativeCurrencyToUsdPriceResponse[0].answer);
  }, [nativeCurrencyToUsdPriceResponse]);

  useEffect(() => {
    setTicketNativeCurrencyPriceLabel(
      eventPersistedFormData.isFreeTicketPrice ? (
        "FREE"
      ) : eventPersistedFormData.ticketPrice && nativeCurrencyToUsdPrice ? (
        `~${(
          +ethers.utils.formatUnits(nativeCurrencyToUsdPrice, 8) *
          +eventPersistedFormData.ticketPrice
        ).toFixed(2)} MATIC`
      ) : eventPersistedFormData.ticketPrice && !nativeCurrencyToUsdPrice ? (
        <Spinner size={".75rem"} />
      ) : (
        "0 MATIC"
      )
    );
  }, [
    nativeCurrencyToUsdPrice,
    eventPersistedFormData.ticketPrice,
    eventPersistedFormData.isFreeTicketPrice,
  ]);

  // useEffect(() => {
  //   !eventPersistedFormData.isFreeTicketPrice &&
  //     debouncedTicketPrice &&
  //     refetchNativeCurrencyToUsdPrice();
  // }, [eventPersistedFormData.isFreeTicketPrice, debouncedTicketPrice]);

  return (
    <TabContainer title={"Tickets"}>
      <Popover trigger="hover">
        <PopoverTrigger>
          <QuestionIcon
            color={"accentPrimaryContrast"}
            alignSelf={"flex-end"}
            mb={"-2.75rem"}
            mr={".5rem"}
            zIndex={"overlay"}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            While it’s possible to attach imagery of any size proportions, we
            recommend upholding vertical A4(1:√2) proportions
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <FileUploader
        placeholder={
          <Highlight
            query={"upload ticket cover"}
            styles={{
              background: "accentSecondary",
              color: "textContrast",
              px: ".5rem",
              py: ".5rem",
              borderRadius: "sm",
            }}
          >
            Drad and grop or click to upload ticket cover
          </Highlight>
        }
        onChange={(files) =>
          dispatch(
            setTicketPosters({
              ...eventFormData.ticketPosters,
              [editingTicketIndex]: files[0],
            })
          )
        }
        config={{
          maxFiles: 1,
          accept: { "image/*": [], "video/*": [] },
        }}
      />
      {!isEventTicketDescriptionFieldOpen && (
        <Flex gap={".5rem"} align={"center"}>
          <Button
            variant={"ghost"}
            display={"flex"}
            gap={"1rem"}
            onClick={onOpenEventTicketDescriptionField}
          >
            <AddIcon color={"accentSecondary"} />
            <Text>Add ticket description</Text>
          </Button>
          <Popover trigger="hover">
            <PopoverTrigger>
              <QuestionIcon color={"accentPrimaryContrast"} />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                This information is going to be shown on NFT
                marketplaces/aggregators when collection is going to be deployed
                under NFT description section. If not specified, event short
                description will be used
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      )}
      {isEventTicketDescriptionFieldOpen && (
        <Flex gap={".5rem"}>
          <FormControl variant="floating" id="ticketDesc">
            <Textarea
              autoFocus
              value={
                eventPersistedFormData.eventTicketDescription[
                  editingTicketIndex
                ]
              }
              placeholder=" "
              onChange={(event) =>
                dispatch(
                  upsertEvent({
                    eventTicketDescription: {
                      ...eventPersistedFormData.eventTicketDescription,
                      [editingTicketIndex]: event.target.value,
                    },
                  })
                )
              }
            />
            <FormLabel>Ticket description</FormLabel>
          </FormControl>
          <CloseButton
            onClick={() => (
              onCloseEventTicketDescriptionField(),
              dispatch(
                upsertEvent({
                  eventTicketDescription: {
                    ...eventPersistedFormData.eventTicketDescription,
                    [editingTicketIndex]: "",
                  },
                })
              )
            )}
          />
        </Flex>
      )}
      <Flex gap={"1rem"} justifyContent={"space-between"}>
        <FormControl
          variant="floating"
          id="price"
          isRequired
          flex={0.6}
          isInvalid={getIsFieldInvalid("ticketPrice")}
        >
          <InputGroup>
            <InputLeftAddon children="$" />
            <Input
              value={eventPersistedFormData.ticketPrice[editingTicketIndex]}
              isDisabled={
                eventPersistedFormData.isFreeTicketPrice[editingTicketIndex]
              }
              type="number"
              max="99999"
              placeholder=" "
              onChange={(event) =>
                dispatch(
                  upsertEvent({
                    ticketPrice: {
                      ...eventPersistedFormData.ticketPrice,
                      [editingTicketIndex]: event.target.value,
                    },
                  })
                )
              }
              textAlign={"center"}
              onBlur={() => validateField({ fieldName: "ticketPrice" })}
            />
            <FormLabel left={"3rem !important"}>Price</FormLabel>
          </InputGroup>
          <FormHelperText textAlign={"right"}>
            {ticketNativeCurrencyPriceLabel}
          </FormHelperText>
        </FormControl>
        <FormControl
          display="flex"
          alignItems="center"
          flex={0.4}
          mt="-1.25rem"
          gap={"1rem"}
        >
          <Switch
            value={
              +eventPersistedFormData.isFreeTicketPrice[editingTicketIndex]
            }
            isChecked={
              eventPersistedFormData.isFreeTicketPrice[editingTicketIndex]
            }
            onChange={() => (
              dispatch(
                upsertEvent({
                  isFreeTicketPrice: {
                    ...eventPersistedFormData.isFreeTicketPrice,
                    [editingTicketIndex]:
                      !eventPersistedFormData.isFreeTicketPrice[
                        editingTicketIndex
                      ],
                  },
                })
              ),
              setTimeout(() =>
                validateField({
                  fieldName: "ticketPrice",
                  value: {
                    ...eventPersistedFormData,
                    isFreeTicketPrice: {
                      ...eventPersistedFormData.isFreeTicketPrice,
                      [editingTicketIndex]:
                        !eventPersistedFormData.isFreeTicketPrice[
                          editingTicketIndex
                        ],
                    },
                  },
                })
              )
            )}
            id="freeTickets"
            size={"lg"}
          />
          <FormLabel htmlFor="freeTickets" mb="0">
            free
          </FormLabel>
        </FormControl>
      </Flex>
      <Flex gap={"1rem"} justifyContent={"space-between"}>
        <FormControl
          flex={0.6}
          isDisabled={
            eventPersistedFormData.isUnlimitedTicketSupply[editingTicketIndex]
          }
          variant="floating"
          id="ticketSupply"
          isRequired
          isInvalid={getIsFieldInvalid("ticketSupply")}
        >
          <Input
            value={eventPersistedFormData.ticketSupply[editingTicketIndex]}
            placeholder=" "
            type="number"
            min={1}
            onChange={(event) =>
              dispatch(
                upsertEvent({
                  ticketSupply: {
                    ...eventPersistedFormData.ticketSupply,
                    [editingTicketIndex]: +event.target.value,
                  },
                })
              )
            }
            onBlur={() => validateField({ fieldName: "ticketSupply" })}
          />
          <FormLabel>Amount</FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" flex={0.4} gap={"1rem"}>
          <Switch
            value={
              +eventPersistedFormData.isUnlimitedTicketSupply[
                editingTicketIndex
              ]
            }
            isChecked={
              eventPersistedFormData.isUnlimitedTicketSupply[editingTicketIndex]
            }
            onChange={() => (
              dispatch(
                upsertEvent({
                  isUnlimitedTicketSupply: {
                    ...eventPersistedFormData.isUnlimitedTicketSupply,
                    [editingTicketIndex]:
                      !eventPersistedFormData.isUnlimitedTicketSupply[
                        editingTicketIndex
                      ],
                  },
                })
              ),
              setTimeout(() =>
                validateField({
                  fieldName: "ticketSupply",
                  value: {
                    ...eventPersistedFormData,
                    isUnlimitedTicketSupply: {
                      ...eventPersistedFormData.isUnlimitedTicketSupply,
                      [editingTicketIndex]:
                        !eventPersistedFormData.isUnlimitedTicketSupply[
                          editingTicketIndex
                        ],
                    },
                  },
                })
              )
            )}
            id="unlimitedTicketSupply"
            size={"lg"}
          />
          <FormLabel htmlFor="unlimitedTicketSupply" mb="0">
            unlimited
          </FormLabel>
        </FormControl>
      </Flex>
    </TabContainer>
  );
};

export default TicketsTab;
