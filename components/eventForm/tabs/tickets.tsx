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
  Box,
  Container,
  IconButton,
} from "@chakra-ui/react";
import FileUploader from "../../ui/fileUploader";
import { useAppSelector, useDebounce } from "helpers/hooks";
import {
  selectInvalidFields,
  setEventPoster,
  setTicketPosters,
  setEditingTicketIndex as setEditingTicketIndexAction,
} from "features/eventForm/eventFormSlice";
import { useAppDispatch } from "helpers/hooks";
import {
  AddIcon,
  CheckCircleIcon,
  DeleteIcon,
  QuestionIcon,
} from "@chakra-ui/icons";
import EditIcon from "../../../public/icons/edit";
import { default as TabContainer } from "./container";
import { setEventData as setEventPreviewData } from "features/eventForm/eventPreviewSlice";
import {
  upsertEvent,
  setAddedTickets,
} from "features/eventForm/eventPersistedFormSlice";
import { default as useEventFormValidationHook } from "../validationHook";
import { BigNumberish, ethers } from "ethers";
import { getNativeCurrencyToUsdPrice } from "helpers/contract";
import { motion } from "framer-motion";
import { fadeRightSlideAnimation, fadeTopSlideAnimation } from "styles/theme";

const TicketsTab = () => {
  const dispatch = useAppDispatch();
  const { validateField, getIsFieldInvalid } = useEventFormValidationHook();
  const eventPersistedFormData = useAppSelector(
    (state) => state.eventPersistedForm
  );
  const eventFormData = useAppSelector((state) => state.eventForm);
  const eventPreviewData = useAppSelector((state) => state.eventPreview);
  const invalidEventFormFields = useAppSelector(selectInvalidFields);
  const [editingTicketIndex, setEditingTicketIndex] = useState<
    number | undefined
  >(undefined);
  const [isTicketFormValid, setIsTicketFormValid] = useState(false);
  const ticketFormFieldsToValidate = [
    "ticketPrice",
    "ticketSupply",
    "eventTicketName",
  ] as (keyof typeof eventPersistedFormData)[];
  const [shouldShowTicketCarousel, setShouldShowTicketCarousel] =
    useState(false);

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
    !eventPersistedFormData.addedTickets?.length && setEditingTicketIndex(0);
  }, []);

  useEffect(() => {
    dispatch(setEditingTicketIndexAction(editingTicketIndex));
  }, [editingTicketIndex]);

  useEffect(() => {
    eventPersistedFormData.addedTickets?.length
      ? setEditingTicketIndex(undefined)
      : setEditingTicketIndex(0);

    eventPersistedFormData.tabIndex == 2
      ? setTimeout(() => setShouldShowTicketCarousel(true), 300)
      : setShouldShowTicketCarousel(false);
  }, [eventPersistedFormData.tabIndex]);

  useEffect(() => {
    !eventPersistedFormData.addedTickets?.length && setEditingTicketIndex(0);
  }, [!eventPersistedFormData.addedTickets]);

  useEffect(() => {
    nativeCurrencyToUsdPriceResponse?.length &&
      setNativeCurrencyToUsdPrice(nativeCurrencyToUsdPriceResponse[0].answer);
  }, [nativeCurrencyToUsdPriceResponse]);

  useEffect(() => {
    editingTicketIndex !== undefined &&
      setTicketNativeCurrencyPriceLabel(
        eventPersistedFormData.isFreeTicketPrice[editingTicketIndex!] ? (
          "FREE"
        ) : eventPersistedFormData.ticketPrice[editingTicketIndex] &&
          nativeCurrencyToUsdPrice ? (
          `~${(
            +(eventPersistedFormData.ticketPrice[editingTicketIndex] || 0) /
            +ethers.utils.formatUnits(nativeCurrencyToUsdPrice, 8)
          ).toFixed(2)} MATIC`
        ) : eventPersistedFormData.ticketPrice[editingTicketIndex] &&
          !nativeCurrencyToUsdPrice ? (
          <Spinner size={".75rem"} />
        ) : (
          "0 MATIC"
        )
      );
  }, [
    editingTicketIndex,
    nativeCurrencyToUsdPrice,
    eventPersistedFormData.ticketPrice,
    eventPersistedFormData.isFreeTicketPrice,
  ]);

  useEffect(() => {
    Promise.all(validateTicketForm())
      .then(() => setIsTicketFormValid(true))
      .catch(() => setIsTicketFormValid(false));
  }, [
    ...ticketFormFieldsToValidate.map(
      (fieldName) => eventPersistedFormData[fieldName]
    ),
    eventPersistedFormData.isFreeTicketPrice,
    eventPersistedFormData.isUnlimitedTicketSupply,
    editingTicketIndex,
  ]);

  const validateTicketForm = () =>
    ticketFormFieldsToValidate.map(
      (fieldName: keyof typeof eventPersistedFormData) =>
        validateField({
          fieldName,
          tabId: eventPersistedFormData.tabIndex,
          value: {
            ...eventPersistedFormData,
            [fieldName]: {
              //@ts-ignore
              ...eventPersistedFormData[fieldName],
              //@ts-ignore
              [editingTicketIndex]:
                //@ts-ignore
                eventPersistedFormData[fieldName]?.[editingTicketIndex],
            },
          },
          invalidateFields: false,
        })
    );

  // useEffect(() => {
  //   !eventPersistedFormData.isFreeTicketPrice &&
  //     debouncedTicketPrice &&
  //     refetchNativeCurrencyToUsdPrice();
  // }, [eventPersistedFormData.isFreeTicketPrice, debouncedTicketPrice]);

  const addEditingTicket = () => {
    dispatch(
      setAddedTickets([
        ...eventPersistedFormData.addedTickets,
        editingTicketIndex as number,
      ])
    );

    setEditingTicketIndex(undefined);
  };

  const removeAddedTicket = (ticketIndex: number) => {
    confirm("Are you sure?") &&
      (dispatch(
        setAddedTickets(
          eventPersistedFormData.addedTickets.filter(
            (ticket) => ticket !== ticketIndex
          )
        )
      ),
      dispatch(
        upsertEvent(
          (
            [
              "ticketPrice",
              "ticketSupply",
              "eventTicketDescription",
              "eventTicketName",
              "isFreeTicketPrice",
              "isUnlimitedTicketSupply",
            ] as (keyof typeof eventPersistedFormData)[]
          )
            .map((ticketField) => ({
              [ticketField]: Object.keys(eventPersistedFormData[ticketField]!)
                .map(
                  (key) =>
                    key != ticketIndex && {
                      [key]: eventPersistedFormData[ticketField]![key]!,
                    }
                )
                .reduce((a, b) => ({ ...a, ...b }), {}),
            }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        )
      ),
      dispatch(
        setTicketPosters(
          Object.keys(eventFormData.ticketPosters)
            .filter((key) => key != ticketIndex)
            .map((key) => ({ [key]: eventFormData.ticketPosters[key] }))
            .reduce((a, b) => ({ ...a, ...b }), {})
        )
      ),
      setEditingTicketIndex(
        eventPersistedFormData.addedTickets.length - 1 > 0 ? undefined : 0
      ));
  };

  const addTicketTypeBenefits = () => {
    dispatch(
      upsertEvent({
        ticketBenefits: {
          ...eventPersistedFormData.ticketBenefits,
          [editingTicketIndex!]: [
            ...(eventPersistedFormData.ticketBenefits[editingTicketIndex!] ||
              []),
            "",
          ],
        },
      })
    );
  };

  const removeTicketTypeBenefit = (benefitIndex: number) => {
    dispatch(
      upsertEvent({
        ticketBenefits: {
          ...eventPersistedFormData.ticketBenefits,
          [editingTicketIndex!]: eventPersistedFormData.ticketBenefits[
            editingTicketIndex!
          ]?.filter((_, i) => i != benefitIndex),
        },
      })
    );
  };

  return (
    <TabContainer title={"Tickets"}>
      {editingTicketIndex !== undefined && (
        <>
          <FormControl
            variant="floating"
            id="ticket type"
            isRequired
            isInvalid={getIsFieldInvalid("eventTicketName")}
          >
            <Input
              maxLength={45}
              value={
                eventPersistedFormData.eventTicketName[editingTicketIndex] || ""
              }
              autoFocus
              placeholder=" "
              onChange={(event) =>
                dispatch(
                  upsertEvent({
                    eventTicketName: {
                      ...eventPersistedFormData.eventTicketName,
                      [editingTicketIndex]: event.target.value,
                    },
                  })
                )
              }
              onBlur={() => validateField({ fieldName: "eventTicketName" })}
            />
            <FormLabel>Ticket type</FormLabel>
            <FormHelperText>Min 3, Max 45 symbols</FormHelperText>
          </FormControl>
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
                  value={
                    eventPersistedFormData.ticketPrice[editingTicketIndex] || ""
                  }
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
                      ticketPrice: {
                        ...eventPersistedFormData.ticketPrice,
                        [editingTicketIndex]: !eventPersistedFormData
                          .isFreeTicketPrice[editingTicketIndex]
                          ? 0
                          : eventPersistedFormData.ticketPrice[
                              editingTicketIndex
                            ],
                      },
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
                eventPersistedFormData.isUnlimitedTicketSupply[
                  editingTicketIndex
                ]
              }
              variant="floating"
              id="ticketSupply"
              isRequired
              isInvalid={getIsFieldInvalid("ticketSupply")}
            >
              <Input
                value={
                  eventPersistedFormData.ticketSupply[editingTicketIndex] || ""
                }
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
            <FormControl
              display="flex"
              alignItems="center"
              flex={0.4}
              gap={"1rem"}
            >
              <Switch
                value={
                  eventPersistedFormData.isUnlimitedTicketSupply &&
                  +eventPersistedFormData.isUnlimitedTicketSupply[
                    editingTicketIndex
                  ]
                }
                isChecked={
                  eventPersistedFormData.isUnlimitedTicketSupply &&
                  eventPersistedFormData.isUnlimitedTicketSupply[
                    editingTicketIndex
                  ]
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
          {eventPersistedFormData.ticketBenefits?.[editingTicketIndex]?.map(
            (manager, managerIndex) => (
              <Flex gap={"1rem"} key={managerIndex} align={"center"}>
                <CheckCircleIcon color={"success"} />
                <FormControl variant="floating" id="longdesc">
                  <Input
                    autoFocus
                    value={
                      eventPersistedFormData.ticketBenefits?.[
                        editingTicketIndex
                      ]?.[managerIndex]
                    }
                    placeholder=" "
                    onChange={(event) => {
                      let eventManagers = [
                        ...(eventPersistedFormData.ticketBenefits[
                          editingTicketIndex
                        ] || []),
                      ];
                      eventManagers.splice(managerIndex, 1, event.target.value);
                      dispatch(
                        upsertEvent({
                          ticketBenefits: {
                            ...eventPersistedFormData.ticketBenefits,
                            [editingTicketIndex]: eventManagers,
                          },
                        })
                      );
                    }}
                  />
                </FormControl>
                <CloseButton
                  onClick={() => removeTicketTypeBenefit(managerIndex)}
                />
              </Flex>
            )
          )}
          <Button
            variant={"ghost"}
            display={"flex"}
            gap={"1rem"}
            disabled={
              eventPersistedFormData.ticketBenefits?.[editingTicketIndex]
                ?.length >= 8
            }
            onClick={addTicketTypeBenefits}
          >
            <AddIcon color={"accentSecondary"} />
            <Text>Add ticket benefits</Text>
          </Button>
          <Flex gap={"1rem"} align={"center"} justify={"center"}>
            <Box flex={1}>
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
                    drop a file or click to upload ticket cover
                  </Highlight>
                }
                value={
                  eventFormData.ticketPosters &&
                  eventFormData.ticketPosters?.[editingTicketIndex]
                    ? [eventFormData.ticketPosters?.[editingTicketIndex]]
                    : undefined
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
            </Box>
            <Popover trigger="hover">
              <PopoverTrigger>
                <QuestionIcon
                  color={"accentPrimaryContrast"}
                  zIndex={"overlay"}
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                  While it’s possible to attach imagery of any size proportions,
                  we recommend upholding vertical A4(1:√2) proportions
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
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
                    marketplaces/aggregators when collection is going to be
                    deployed under NFT description section. If not specified,
                    event short description will be used
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
                  maxLength={300}
                  value={
                    eventPersistedFormData.eventTicketDescription[
                      editingTicketIndex
                    ] || ""
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
                <FormHelperText>Max 300 symbols</FormHelperText>
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
          <Flex
            mt={"1rem"}
            justifyContent={
              eventPersistedFormData.addedTickets?.length
                ? "space-between"
                : "flex-end"
            }
            gap={"2rem"}
          >
            <Flex gap=".5rem">
              {!!eventPersistedFormData.addedTickets?.length && (
                <Button
                  variant={"solid"}
                  onClick={() => setEditingTicketIndex(undefined)}
                >
                  Cancel
                </Button>
              )}
              {!!eventPersistedFormData.addedTickets?.length &&
                eventPersistedFormData.addedTickets?.includes(
                  editingTicketIndex
                ) && (
                  <Button
                    variant={"solid"}
                    onClick={() => removeAddedTicket(editingTicketIndex)}
                  >
                    <DeleteIcon />
                  </Button>
                )}
            </Flex>
            <Button
              variant={"accent"}
              isDisabled={!isTicketFormValid}
              onClick={() =>
                eventPersistedFormData.addedTickets?.includes(
                  editingTicketIndex
                )
                  ? setEditingTicketIndex(undefined)
                  : addEditingTicket()
              }
            >
              {eventPersistedFormData.addedTickets?.includes(editingTicketIndex)
                ? "Save"
                : "Add ticket"}
            </Button>
          </Flex>
        </>
      )}
      {editingTicketIndex == undefined &&
        !!eventPersistedFormData.addedTickets?.length && (
          <Flex direction="column" gap={"1rem"} overflowX={"hidden"}>
            <Container
              as={Flex}
              variant={"scrollableOverlap"}
              gap={"1rem"}
              transition={".2s"}
              opacity={shouldShowTicketCarousel ? 1 : 0}
              style={{
                position: "fixed",
                maxWidth: "100%",
                left: 0,
                paddingRight: "2rem",
                paddingLeft: "2rem",
              }}
            >
              {eventPersistedFormData.addedTickets.map((ticketIndex) => (
                <Flex
                  onClick={() => setEditingTicketIndex(ticketIndex)}
                  minW={"17rem"}
                  maxW={"17rem"}
                  p={"1rem"}
                  bg={"accentPrimary"}
                  borderRadius="md"
                  color="textContrast"
                  align={"center"}
                  justifyContent={"space-between"}
                  gap={".5rem"}
                  cursor={"pointer"}
                  _hover={{ bg: "accentPrimaryContrast" }}
                  as={motion.div}
                  initial={fadeRightSlideAnimation["false"]}
                  animate={fadeRightSlideAnimation["true"]}
                >
                  <Flex direction={"column"} gap={".5rem"}>
                    <Text
                      fontWeight={"bold"}
                      maxW="13rem"
                      overflow={"hidden"}
                      textOverflow="ellipsis"
                    >
                      {eventPersistedFormData.eventTicketName[ticketIndex]}
                    </Text>
                    <Flex gap={".25rem"}>
                      <Flex>
                        <Text fontSize={"sm"} whiteSpace={"nowrap"}>
                          Price:{" "}
                          {+(
                            eventPersistedFormData.ticketPrice[ticketIndex] || 0
                          )
                            ? `$${+eventPersistedFormData.ticketPrice[
                                ticketIndex
                              ]!}`
                            : "FREE"}
                          ,
                        </Text>
                      </Flex>
                      <Flex>
                        <Text fontSize={"sm"} whiteSpace={"nowrap"}>
                          tickets:{" "}
                          {eventPersistedFormData.ticketSupply[ticketIndex] ||
                            "UNLIMITED"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  <EditIcon></EditIcon>
                </Flex>
              ))}
            </Container>
            <Button
              as={motion.div}
              initial={fadeTopSlideAnimation["false"]}
              animate={fadeTopSlideAnimation["true"]}
              variant={"ghost"}
              display={"flex"}
              gap={"1rem"}
              mt={"7rem"}
              onClick={() =>
                setEditingTicketIndex(
                  eventPersistedFormData.addedTickets.length
                )
              }
            >
              <AddIcon color={"accentSecondary"} />
              <Text>Add ticket type</Text>
            </Button>
          </Flex>
        )}
    </TabContainer>
  );
};

export default TicketsTab;
