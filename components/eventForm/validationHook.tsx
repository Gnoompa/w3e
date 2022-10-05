import { useAppDispatch, useAppSelector } from "helpers/hooks";
import React, { useEffect, useRef } from "react";
import yup, { array, object, string } from "yup";
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

  const validationSchema = (value: Partial<typeof eventPersistedForm>) =>
    object({
      eventTitle: string().required(),
      eventShortDescription: string().required(),
      ticketPrice: object().test(
        (ticketPrice) =>
          ((result) => result.length && !result.includes(false))(
            Object.keys({ ...ticketPrice, ...value.isFreeTicketPrice }).map(
              (ticketIndex) =>
                value.isFreeTicketPrice?.[+ticketIndex] ||
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
                value.isUnlimitedTicketSupply?.[+ticketIndex] ||
                +ticketSupply[ticketIndex] > 0
            )
          ) as boolean
      ),
      eventTicketName: object().test(
        (eventTicketName) =>
          ((result) => result.length && !result.includes(false))(
            Object.keys(eventTicketName).map(
              (ticketIndex) => eventTicketName[ticketIndex]?.trim()?.length >= 3
            )
          ) as boolean
      ),
      beneficiary: string().required(),
      addedTickets: array().min(1),
    } as { [key in keyof IEventFormState]: any });

  const validateField = ({
    fieldName,
    value,
    tabId,
    invalidateFields = true,
  }: {
    fieldName: keyof typeof eventPersistedForm;
    tabId?: number;
    value?: Partial<typeof eventPersistedForm>;
    invalidateFields?: boolean;
  }) =>
    validationSchema(value || eventPersistedForm)
      .validateAt(fieldName, value || eventPersistedForm)
      .then(() =>
        dispatch(
          setFields(eventForm.fields.filter((field) => field.name != fieldName))
        )
      )
      .catch((error) => {
        invalidateFields &&
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

        if (tabId !== undefined) {
          // todo refactor optional error propagation
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
