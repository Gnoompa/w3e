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
  setTicketPoster,
} from "features/eventForm/eventFormSlice";
import { useAppDispatch } from "helpers/hooks";
import { AddIcon, QuestionIcon } from "@chakra-ui/icons";
import { default as TabContainer } from "./container";
import { setEventData as setEventPreviewData } from "features/eventForm/eventPreviewSlice";
import { upsertEvent } from "features/eventForm/eventPersistedFormSlice";
import { default as useEventFormValidationHook } from "../validationHook";
import { BigNumberish, ethers } from "ethers";
import { getNativeCurrencyToUsdPrice } from "helpers/contract";

const VenueTab = () => {
  const dispatch = useAppDispatch();
  const { validateField, getIsFieldInvalid } = useEventFormValidationHook();
  const eventPersistedFormData = useAppSelector(
    (state) => state.eventPersistedForm
  );
  const eventFormData = useAppSelector((state) => state.eventForm);
  const eventPreviewData = useAppSelector((state) => state.eventPreview);
  const invalidEventFormFields = useAppSelector(selectInvalidFields);

  const {
    isOpen: isEventTicketDescriptionFieldOpen,
    onOpen: onOpenEventTicketDescriptionField,
    onClose: onCloseEventTicketDescriptionField,
  } = useDisclosure();

  const debouncedTicketPrice = useDebounce(
    eventPersistedFormData.ticketPrice,
    4000
  );
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

  useEffect(() => {
    !eventPersistedFormData.isFreeTicketPrice &&
      debouncedTicketPrice &&
      refetchNativeCurrencyToUsdPrice();
  }, [eventPersistedFormData.isFreeTicketPrice, debouncedTicketPrice]);

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
        onChange={(files) => dispatch(setTicketPoster(files[0]))}
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
              value={eventPersistedFormData.eventTicketDescription}
              placeholder=" "
              onChange={(event) =>
                dispatch(
                  upsertEvent({ eventTicketDescription: event.target.value })
                )
              }
            />
            <FormLabel>Ticket description</FormLabel>
          </FormControl>
          <CloseButton
            onClick={() => (
              onCloseEventTicketDescriptionField(),
              dispatch(upsertEvent({ eventTicketDescription: "" }))
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
              value={eventPersistedFormData.ticketPrice}
              isDisabled={eventPersistedFormData.isFreeTicketPrice}
              type="number"
              max="99999"
              placeholder=" "
              onChange={(event) =>
                dispatch(upsertEvent({ ticketPrice: event.target.value }))
              }
              textAlign={"center"}
              onBlur={() => validateField("ticketPrice")}
            />
            <FormLabel left={"3rem !important"}>Ticket price</FormLabel>
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
        >
          <FormLabel htmlFor="freeTickets" mb="0">
            free
          </FormLabel>
          <Switch
            value={+eventPersistedFormData.isFreeTicketPrice}
            isChecked={eventPersistedFormData.isFreeTicketPrice}
            onChange={() => (
              dispatch(
                upsertEvent({
                  isFreeTicketPrice: !eventPersistedFormData.isFreeTicketPrice,
                })
              ),
              setTimeout(() => validateField("ticketPrice"))
            )}
            id="freeTickets"
            size={"lg"}
          />
        </FormControl>
      </Flex>
      <Flex gap={"1rem"} justifyContent={"space-between"}>
        <FormControl
          flex={0.6}
          isDisabled={eventPersistedFormData.isUnlimitedTicketSupply}
          variant="floating"
          id="ticketSupply"
          isRequired
          isInvalid={getIsFieldInvalid("ticketSupply")}
        >
          <Input
            value={eventPersistedFormData.ticketSupply}
            placeholder=" "
            type="number"
            min={1}
            onChange={(event) =>
              dispatch(
                upsertEvent({
                  ticketSupply: +event.target.value,
                })
              )
            }
            onBlur={() => validateField("ticketSupply")}
          />
          <FormLabel>Tickets supply</FormLabel>
        </FormControl>
        <FormControl display="flex" alignItems="center" flex={0.4}>
          <FormLabel htmlFor="unlimitedTicketSupply" mb="0">
            unlimited
          </FormLabel>
          <Switch
            value={+eventPersistedFormData.isUnlimitedTicketSupply}
            isChecked={eventPersistedFormData.isUnlimitedTicketSupply}
            onChange={() => (
              dispatch(
                upsertEvent({
                  isUnlimitedTicketSupply:
                    !eventPersistedFormData.isUnlimitedTicketSupply,
                })
              ),
              setTimeout(() => validateField("ticketSupply"))
            )}
            id="unlimitedTicketSupply"
            size={"lg"}
          />
        </FormControl>
      </Flex>
    </TabContainer>
  );
};

export default VenueTab;
