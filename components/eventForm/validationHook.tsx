import { useAppDispatch, useAppSelector } from "helpers/hooks";
import React, { useEffect, useRef } from "react";
import yup, {
  object,
  string,
  number,
  InferType,
  TypeOf,
  ObjectSchema,
  array,
} from "yup";
import { State as IEventFormState } from "features/eventForm/eventPersistedFormSlice";
import {
  selectInvalidFields,
  setFields,
} from "features/eventForm/eventFormSlice";

export default () => {
  const dispatch = useAppDispatch();
  const eventForm = useAppSelector((state) => state.eventForm);
  const invalidEventFormFields = useAppSelector(selectInvalidFields);
  const eventPersistedForm = useAppSelector(
    (state) => state.eventPersistedForm
  );
  const eventFormFieldsRef = useRef(eventForm.fields);

  const validationSchema = (value: typeof eventPersistedForm) =>
    object({
      eventTitle: string().required(),
      eventShortDescription: string().required(),
      ticketPrice: object().test(
        (ticketPrice) =>
          ((result) => result.length && !result.includes(false))(
            Object.keys({ ...ticketPrice, ...value.isFreeTicketPrice }).map(
              (ticketIndex) =>
                value.isFreeTicketPrice[+ticketIndex] ||
                +ticketPrice[ticketIndex] > 0
            )
          ) as boolean
      ),
      ticketSupply: object().test(
        (ticketSupply) =>
          ((result) => result.length && !result.includes(false))(
            Object.keys({
              ...ticketSupply,
              ...value.isUnlimitedTicketSupply,
            }).map(
              (ticketIndex) =>
                value.isUnlimitedTicketSupply[+ticketIndex] ||
                +ticketSupply[ticketIndex] > 0
            )
          ) as boolean
      ),
      beneficiary: string().required(),
    } as { [key in keyof IEventFormState]: any });

  const validateField = ({
    fieldName,
    value,
    tabId,
  }: {
    fieldName: keyof typeof eventPersistedForm;
    tabId?: number;
    value?: typeof eventPersistedForm;
  }) =>
    validationSchema(value || eventPersistedForm)
      .validateAt(fieldName, value || eventPersistedForm)
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
                tabId:
                  tabId !== undefined
                    ? tabId
                    : (value || eventPersistedForm).tabIndex,
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
    eventForm.fields.filter(({ name }) => name == fieldName)[0]?.isInvalid;

  useEffect(() => {
    eventFormFieldsRef.current = eventForm.fields;
  }, [eventForm.fields]);

  return {
    validateField,
    getIsFieldInvalid,
  };
};
