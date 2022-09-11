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
import { useAccount } from "wagmi";
import { useModal } from "connectkit";

const PaymentTab = () => {
  const dispatch = useAppDispatch();
  const { validateField, getIsFieldInvalid } = useEventFormValidationHook();
  const eventPersistedFormData = useAppSelector(
    (state) => state.eventPersistedForm
  );
  const eventFormData = useAppSelector((state) => state.eventForm);
  const eventPreviewData = useAppSelector((state) => state.eventPreview);
  const invalidEventFormFields = useAppSelector(selectInvalidFields);

  const { address: connectedWalletAddress, isConnected: isWalletConnected } =
    useAccount();
  const { setOpen: setWalletConnectModalOpen } = useModal();

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

  const addEventManager = () => {
    dispatch(
      upsertEvent({
        eventManagers: [...(eventPersistedFormData.eventManagers || []), ""],
      })
    );
  };

  const removeEventManager = (managerIndex: number) => {
    dispatch(
      upsertEvent({
        eventManagers: eventPersistedFormData.eventManagers?.filter(
          (_, i) => i != managerIndex
        ),
      })
    );
  };

  return (
    <TabContainer title={"Payment"}>
      <FormControl
        variant="floating"
        id="beneficiary"
        isRequired
        display={"flex"}
        gap={"1rem"}
        isInvalid={getIsFieldInvalid("beneficiary")}
      >
        <Input
          value={eventPersistedFormData.beneficiary}
          placeholder=" "
          onChange={(event) =>
            dispatch(upsertEvent({ beneficiary: event.target.value }))
          }
          onBlur={() => validateField("beneficiary")}
        />
        <FormLabel>Beneficiary wallet address</FormLabel>
        <Button
          variant={"accent"}
          onClick={() =>
            isWalletConnected
              ? (dispatch(upsertEvent({ beneficiary: connectedWalletAddress })),
                setTimeout(() => validateField("beneficiary")))
              : setWalletConnectModalOpen(true)
          }
        >
          Me
        </Button>
      </FormControl>
      {eventPersistedFormData.eventManagers?.map((manager, managerIndex) => (
        <Flex gap={"1rem"} key={managerIndex} align={"center"}>
          <FormControl variant="floating" id="longdesc">
            <Input
              autoFocus
              value={eventPersistedFormData.eventManagers?.[managerIndex]}
              placeholder=" "
              onChange={(event) => {
                let eventManagers = [
                  ...(eventPersistedFormData.eventManagers || []),
                ];
                eventManagers.splice(managerIndex, 1, event.target.value);
                dispatch(upsertEvent({ eventManagers }));
              }}
            />
            <FormLabel>Manager #{managerIndex + 1} wallet address</FormLabel>
          </FormControl>
          <CloseButton onClick={() => removeEventManager(managerIndex)} />
        </Flex>
      ))}
      <Button
        variant={"ghost"}
        display={"flex"}
        gap={"1rem"}
        onClick={addEventManager}
      >
        <AddIcon color={"accentSecondary"} />
        <Text>Add event manager</Text>
      </Button>
    </TabContainer>
  );
};

export default PaymentTab;
