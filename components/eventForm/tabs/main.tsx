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
  FormHelperText,
  Highlight,
  Select,
  CloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  FormErrorMessage,
} from "@chakra-ui/react";
import FileUploader from "../../ui/fileUploader";
import { useAppSelector } from "helpers/hooks";
import {
  selectInvalidFields,
  setEventPoster,
} from "features/eventForm/eventFormSlice";
import { useAppDispatch } from "helpers/hooks";
import { AddIcon, QuestionIcon } from "@chakra-ui/icons";
import { default as TabContainer } from "./container";
import { setEventData as setEventPreviewData } from "features/eventForm/eventPreviewSlice";
import { upsertEvent } from "features/eventForm/eventPersistedFormSlice";
import { default as useEventFormValidationHook } from "../validationHook";

const MainTab = () => {
  const dispatch = useAppDispatch();
  const { validateField, getIsFieldInvalid } = useEventFormValidationHook();
  const eventPersistedFormData = useAppSelector(
    (state) => state.eventPersistedForm
  );
  const eventFormData = useAppSelector((state) => state.eventForm);
  const eventPreviewData = useAppSelector((state) => state.eventPreview);
  const invalidEventFormFields = useAppSelector(selectInvalidFields);
  const {
    isOpen: isLongEventDescriptionFieldOpen,
    onOpen: onOpenLongEventDescriptionField,
    onClose: onCloseLongEventDescriptionField,
  } = useDisclosure();

  useEffect(() => {
    dispatch(
      setEventPreviewData({
        ...eventPreviewData,
        image: eventFormData.eventPoster
          ? URL.createObjectURL(eventFormData.eventPoster)
          : undefined,
      })
    );
  }, [eventFormData.eventPoster]);

  useEffect(() => {
    eventPersistedFormData.eventLongDescription &&
      onOpenLongEventDescriptionField();
  }, [eventPersistedFormData.eventLongDescription]);

  return (
    <TabContainer title={"Main Info"}>
      <FormControl
        variant="floating"
        id="title"
        isRequired
        isInvalid={getIsFieldInvalid("eventTitle")}
      >
        <Input
          value={eventPersistedFormData.eventTitle}
          autoFocus
          placeholder=" "
          maxLength={50}
          onChange={(event) =>
            dispatch(upsertEvent({ eventTitle: event.target.value }))
          }
          onBlur={() => validateField({ fieldName: "eventTitle" })}
        />
        <FormLabel>Event title</FormLabel>
        <FormHelperText>Min 3, Max 50 symbols</FormHelperText>
      </FormControl>
      {/* <FormControl variant="floating" id="type" isRequired>
        <Select defaultValue={"offline"} isRequired>
          <option value={"offline"}>Offline</option>
          <option value={"online"}>Online</option>
        </Select>
        <FormLabel>Event type</FormLabel>
      </FormControl> */}
      <FormControl variant="floating" id="shortdesc" isRequired>
        <Textarea
          value={eventPersistedFormData.eventShortDescription}
          placeholder=" "
          maxLength={200}
          onChange={(event) =>
            dispatch(upsertEvent({ eventShortDescription: event.target.value }))
          }
          onBlur={() => validateField({ fieldName: "eventShortDescription" })}
          isInvalid={getIsFieldInvalid("eventShortDescription")}
        />
        <FormLabel>Short description</FormLabel>
        <FormHelperText>
          Max 200 symbols. Description will be shown on the event explorer page
        </FormHelperText>
      </FormControl>
      <FileUploader
        placeholder={
          <Highlight
            query={"upload event cover"}
            styles={{
              background: "accentSecondary",
              color: "textContrast",
              px: ".5rem",
              py: ".5rem",
              borderRadius: "sm",
            }}
          >
            Drad & drop or click to upload event cover
          </Highlight>
        }
        onChange={(files) => dispatch(setEventPoster(files[0]))}
        config={{
          maxFiles: 1,
          accept: { "image/*": [], "video/*": [] },
        }}
      />
      {!isLongEventDescriptionFieldOpen && (
        <Flex align={"center"} gap={".5rem"}>
          <Button
            variant={"ghost"}
            display={"flex"}
            gap={"1rem"}
            onClick={onOpenLongEventDescriptionField}
          >
            <AddIcon color={"accentSecondary"} />
            <Text>Add long description</Text>
          </Button>
          <Popover trigger="hover">
            <PopoverTrigger>
              <QuestionIcon color={"accentPrimaryContrast"} />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                Long description, if present, is shown on events’ details page
                and short description on events listing page. Otherwise short
                description is used on both pages.
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      )}
      {isLongEventDescriptionFieldOpen && (
        <Flex gap={".5rem"}>
          <FormControl variant="floating" id="longdesc">
            <Textarea
              autoFocus
              value={eventPersistedFormData.eventLongDescription}
              placeholder=" "
              rows={6}
              onChange={(event) =>
                dispatch(
                  upsertEvent({ eventLongDescription: event.target.value })
                )
              }
            />
            <FormLabel>Long description</FormLabel>
          </FormControl>
          <CloseButton
            onClick={() => (
              onCloseLongEventDescriptionField(),
              dispatch(upsertEvent({ eventLongDescription: "" }))
            )}
          />
        </Flex>
      )}
    </TabContainer>
  );
};

export default MainTab;
