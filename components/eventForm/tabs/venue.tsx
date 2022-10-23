import React, { useEffect, useContext } from "react";
import {
  Flex,
  Button,
  Text,
  FormLabel,
  Textarea,
  Input,
  useDisclosure,
  FormControl,
  CloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@chakra-ui/react";
import { useAppSelector } from "helpers/hooks";
import { selectInvalidFields } from "features/eventForm/eventFormSlice";
import { useAppDispatch } from "helpers/hooks";
import { AddIcon, QuestionIcon } from "@chakra-ui/icons";
import { default as TabContainer } from "./container";
import { upsertEvent } from "features/eventForm/eventPersistedFormSlice";
import { default as useEventFormValidationHook } from "../validationHook";

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
    isOpen: isEventStartTimeFieldOpen,
    onOpen: onOpenEventStartTimeField,
    onClose: onCloseEventStartTimeField,
  } = useDisclosure();
  const {
    isOpen: isEventEndDateFieldOpen,
    onOpen: onOpenEventEndDateField,
    onClose: onCloseEventEndDateField,
  } = useDisclosure();
  const {
    isOpen: isEventEndTimeFieldOpen,
    onOpen: onOpenEventEndTimeField,
    onClose: onCloseEventEndTimeField,
  } = useDisclosure();
  const {
    isOpen: isEventLocationInfoFieldOpen,
    onOpen: onOpenEventLocationInfoField,
    onClose: onCloseEventLocationInfoField,
  } = useDisclosure();

  useEffect(() => {
    eventPersistedFormData.eventAdditionalLocationInfo &&
      onOpenEventLocationInfoField();

    eventPersistedFormData.eventEndDate && onOpenEventEndDateField();
    eventPersistedFormData.eventEndTime && onOpenEventEndTimeField();
  }, [
    eventPersistedFormData.eventAdditionalLocationInfo,
    eventPersistedFormData.eventEndDate,
    eventPersistedFormData.eventEndTime,
  ]);

  return (
    <TabContainer title={"Venue"}>
      <Flex gap={"1rem"}>
        <FormControl variant="floating" id="startDate" flex={1}>
          <Input
            autoFocus
            value={eventPersistedFormData.eventStartDate}
            placeholder=" "
            min={eventPersistedFormData.eventEndDate}
            type="date"
            onChange={(event) =>
              dispatch(upsertEvent({ eventStartDate: event.target.value }))
            }
          />
          <FormLabel>Start Date</FormLabel>
        </FormControl>
        {!isEventStartTimeFieldOpen && (
          <Button
            variant={"ghost"}
            display={"flex"}
            gap={"1rem"}
            onClick={onOpenEventStartTimeField}
          >
            <AddIcon color={"accentSecondary"} />
            <Text>Add start time</Text>
          </Button>
        )}
        {isEventStartTimeFieldOpen && (
          <Flex gap={".5rem"} align="center" flex={1}>
            <FormControl variant="floating" id="longdesc">
              <Input
                autoFocus
                value={eventPersistedFormData.eventStartTime}
                placeholder=" "
                type="time"
                onChange={(event) =>
                  dispatch(upsertEvent({ eventStartTime: event.target.value }))
                }
              />
              <FormLabel>Start time</FormLabel>
            </FormControl>
            <CloseButton
              onClick={() => (
                onCloseEventStartTimeField(),
                dispatch(upsertEvent({ eventStartTime: "" }))
              )}
            />
          </Flex>
        )}
      </Flex>
      {isEventEndDateFieldOpen && (
        <Flex gap={".5rem"} align={"center"}>
          <FormControl variant="floating" id="enddate" flex={1}>
            <Input
              autoFocus
              value={eventPersistedFormData.eventEndDate}
              placeholder=" "
              type="date"
              min={eventPersistedFormData.eventStartDate}
              onChange={(event) =>
                dispatch(upsertEvent({ eventEndDate: event.target.value }))
              }
            />
            <FormLabel>End date</FormLabel>
          </FormControl>
          <CloseButton
            onClick={() => (
              onCloseEventEndDateField(),
              onCloseEventEndTimeField(),
              dispatch(upsertEvent({ eventEndDate: "", eventEndTime: "" }))
            )}
          />
          {!isEventEndTimeFieldOpen && (
            <Button
              variant={"ghost"}
              display={"flex"}
              gap={"1rem"}
              onClick={onOpenEventEndTimeField}
            >
              <AddIcon color={"accentSecondary"} />
              <Text>Add end time</Text>
            </Button>
          )}
          {isEventEndTimeFieldOpen && (
            <Flex gap={".5rem"} flex={1} align={"center"}>
              <FormControl variant="floating" id="longdesc">
                <Input
                  autoFocus
                  value={eventPersistedFormData.eventEndTime}
                  placeholder=" "
                  type="time"
                  min={eventPersistedFormData.eventStartTime}
                  onChange={(event) =>
                    dispatch(upsertEvent({ eventEndTime: event.target.value }))
                  }
                />
                <FormLabel>End time</FormLabel>
              </FormControl>
              <CloseButton
                onClick={() => (
                  onCloseEventEndTimeField(),
                  dispatch(upsertEvent({ eventStartDate: "" }))
                )}
              />
            </Flex>
          )}
        </Flex>
      )}
      {!isEventEndDateFieldOpen && (
        <Button
          variant={"ghost"}
          display={"flex"}
          gap={"1rem"}
          onClick={onOpenEventEndDateField}
        >
          <AddIcon color={"accentSecondary"} />
          <Text>Add end date</Text>
        </Button>
      )}
      <FormControl variant="floating" id="address">
        <Input
          value={eventPersistedFormData.eventLocation}
          placeholder=" "
          onChange={(event) =>
            dispatch(upsertEvent({ eventLocation: event.target.value }))
          }
        />
        <FormLabel>Address</FormLabel>
      </FormControl>
      {!isEventLocationInfoFieldOpen && (
        <Flex gap={".5rem"} align={"center"}>
          <Button
            variant={"ghost"}
            display={"flex"}
            gap={"1rem"}
            onClick={onOpenEventLocationInfoField}
          >
            <AddIcon color={"accentSecondary"} />
            <Text>Add additional location info</Text>
          </Button>
          <Popover trigger="hover">
            <PopoverTrigger>
              <QuestionIcon color={"accentPrimaryContrast"} />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                Add more info about location, like floor or building number
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      )}
      {isEventLocationInfoFieldOpen && (
        <Flex gap={".5rem"}>
          <FormControl variant="floating" id="eventAdditionalLocationInfo">
            <Textarea
              autoFocus
              value={eventPersistedFormData.eventAdditionalLocationInfo}
              placeholder=" "
              onChange={(event) =>
                dispatch(
                  upsertEvent({
                    eventAdditionalLocationInfo: event.target.value,
                  })
                )
              }
            />
            <FormLabel>Additional location info</FormLabel>
          </FormControl>
          <CloseButton
            onClick={() => (
              onCloseEventLocationInfoField(),
              dispatch(
                upsertEvent({
                  eventAdditionalLocationInfo: "",
                })
              )
            )}
          />
        </Flex>
      )}
    </TabContainer>
  );
};

export default VenueTab;
