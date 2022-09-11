import { useAppDispatch, useAppSelector } from "helpers/hooks";
import React, { useRef } from "react";
import { object, string, number, InferType, TypeOf, ObjectSchema } from "yup";
import { State as IEventFormState } from "features/eventForm/eventPersistedFormSlice";
import {
  selectInvalidFields,
  setFields,
} from "features/eventForm/eventFormSlice";

export default () => {
  const dispatch = useAppDispatch();
  const eventForm = useAppSelector((state) => state.eventForm);
  const invalidEventFormField = useAppSelector(selectInvalidFields);
  const eventPersistedForm = useAppSelector(
    (state) => state.eventPersistedForm
  );
  const eventFormFieldsRef = useRef(eventForm.fields);

  const validationSchema = object({
    eventTitle: string().required(),
    eventShortDescription: string().required(),
    ticketPrice: number().when("isFreeTicketPrice", {
      is: true,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required(),
    }),
    ticketSupply: number().when("isUnlimitedTicketSupply", {
      is: true,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required(),
    }),
    beneficiary: string().required(),
  } as { [key in keyof IEventFormState]: any });

  const validateField = (
    fieldName: keyof typeof eventPersistedForm,
    tabId?: number
  ) =>
    validationSchema
      .validateAt(fieldName, eventPersistedForm)
      .then(() =>
        dispatch(
          setFields(eventForm.fields.filter((field) => field.name != fieldName))
        )
      )
      .catch((error) => {
        dispatch(
          setFields(
            (eventFormFieldsRef.current = [
              ...eventFormFieldsRef.current,
              {
                name: fieldName,
                tabId: tabId || eventPersistedForm.tabIndex,
                isInvalid: true,
              },
            ])
          )
        );

        if (tabId) {
          throw error;
        }
      });

  const getIsFieldInvalid = (fieldName: string) =>
    invalidEventFormField.filter(({ name }) => name == fieldName)[0]?.isInvalid;

  return {
    validateField,
    getIsFieldInvalid,
  };
};
