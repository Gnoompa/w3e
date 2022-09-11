import React, { useEffect, useContext } from "react";
import { Flex, Input, useDisclosure, Container } from "@chakra-ui/react";
import { SocialMediaIds, useAppSelector } from "helpers/hooks";
import { selectInvalidFields } from "features/eventForm/eventFormSlice";
import { useAppDispatch } from "helpers/hooks";
import { default as TabContainer } from "./container";
import { setEventData as setEventPreviewData } from "features/eventForm/eventPreviewSlice";
import { upsertEvent } from "features/eventForm/eventPersistedFormSlice";
import { default as useEventFormValidationHook } from "../validationHook";
import TwitterIcon from "../../../public/icons/twitter";
import FacebookIcon from "../../../public/icons/facebook";
import InstagramIcon from "../../../public/icons/insta";
import TelegramIcon from "../../../public/icons/tg";
import SiteIcon from "../../../public/icons/site";

const SocialsTab = () => {
  const dispatch = useAppDispatch();
  const { validateField, getIsFieldInvalid } = useEventFormValidationHook();
  const eventPersistedFormData = useAppSelector(
    (state) => state.eventPersistedForm
  );
  const eventFormData = useAppSelector((state) => state.eventForm);
  const eventPreviewData = useAppSelector((state) => state.eventPreview);
  const invalidEventFormFields = useAppSelector(selectInvalidFields);

  return (
    <TabContainer title={"Social"}>
      <Flex gap={"1rem"} align={"center"}>
        <Container variant={"icon"} flex={0}>
          <TelegramIcon width={16} />
        </Container>
        <Input
          value={
            eventPersistedFormData?.eventMediaLinks?.hasOwnProperty(
              SocialMediaIds.Telegram
            )
              ? eventPersistedFormData?.eventMediaLinks?.[
                  SocialMediaIds.Telegram
                ]
              : ""
          }
          flex={1}
          onChange={(event) =>
            dispatch(
              upsertEvent({
                eventMediaLinks: {
                  ...eventPersistedFormData.eventMediaLinks,
                  [SocialMediaIds.Telegram]: event.target.value,
                },
              })
            )
          }
          placeholder="f.e https://t.me/web3events_eng"
        />
      </Flex>
      <Flex gap={"1rem"} align={"center"}>
        <Container variant={"icon"} flex={0}>
          <TwitterIcon />
        </Container>
        <Input
          value={
            eventPersistedFormData?.eventMediaLinks?.hasOwnProperty(
              SocialMediaIds.Twitter
            )
              ? eventPersistedFormData?.eventMediaLinks?.[
                  SocialMediaIds.Twitter
                ]
              : ""
          }
          flex={1}
          onChange={(event) =>
            dispatch(
              upsertEvent({
                eventMediaLinks: {
                  ...eventPersistedFormData.eventMediaLinks,
                  [SocialMediaIds.Twitter]: event.target.value,
                },
              })
            )
          }
          placeholder="f.e https://twitter.com/VitalikButerin"
        />
      </Flex>
      <Flex gap={"1rem"} align={"center"}>
        <Container variant={"icon"} flex={0}>
          <InstagramIcon />
        </Container>
        <Input
          value={
            eventPersistedFormData?.eventMediaLinks?.hasOwnProperty(
              SocialMediaIds.Instagram
            )
              ? eventPersistedFormData?.eventMediaLinks?.[
                  SocialMediaIds.Instagram
                ]
              : ""
          }
          flex={1}
          onChange={(event) =>
            dispatch(
              upsertEvent({
                eventMediaLinks: {
                  ...eventPersistedFormData.eventMediaLinks,
                  [SocialMediaIds.Instagram]: event.target.value,
                },
              })
            )
          }
          placeholder="f.e https://instagram.com/buterin_vitalik.eth"
        />
      </Flex>
      <Flex gap={"1rem"} align={"center"}>
        <Container variant={"icon"} flex={0}>
          <FacebookIcon />
        </Container>
        <Input
          value={
            eventPersistedFormData?.eventMediaLinks?.hasOwnProperty(
              SocialMediaIds.Facebook
            )
              ? eventPersistedFormData?.eventMediaLinks?.[
                  SocialMediaIds.Facebook
                ]
              : ""
          }
          flex={1}
          onChange={(event) =>
            dispatch(
              upsertEvent({
                eventMediaLinks: {
                  ...eventPersistedFormData.eventMediaLinks,
                  [SocialMediaIds.Facebook]: event.target.value,
                },
              })
            )
          }
          placeholder="f.e https://facebook.com/VitalikButerinCa"
        />
      </Flex>
      <Flex gap={"1rem"} align={"center"}>
        <Container variant={"icon"} flex={0}>
          <SiteIcon width={16} />
        </Container>
        <Input
          value={
            eventPersistedFormData?.eventMediaLinks?.hasOwnProperty(
              SocialMediaIds.Site
            )
              ? eventPersistedFormData?.eventMediaLinks?.[SocialMediaIds.Site]
              : ""
          }
          flex={1}
          onChange={(event) =>
            dispatch(
              upsertEvent({
                eventMediaLinks: {
                  ...eventPersistedFormData.eventMediaLinks,
                  [SocialMediaIds.Site]: event.target.value,
                },
              })
            )
          }
          placeholder="f.e https://web3events.ai/"
        />
      </Flex>
    </TabContainer>
  );
};

export default SocialsTab;
