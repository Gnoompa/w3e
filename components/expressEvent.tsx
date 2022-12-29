import {
  Box,
  Button,
  Container,
  DarkMode,
  Divider,
  Flex,
  GlobalStyle,
  Heading,
  Icon,
  Input,
  Link,
  Spinner,
  Switch,
  Text,
  Textarea,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import TwitterIcon from "public/icons/twitter";
import LensIcon from "public/icons/lens";
import PublishIcon from "public/icons/publish";
import { chain, useAccount } from "wagmi";
import { useProfiles as useCCProfiles } from "./expressEvent/cc/profile";
import { useProfiles as useLensProfiles } from "./expressEvent/lens/profile";
import { useAuth as useLensAuth } from "./expressEvent/lens/auth";
import { usePublications } from "@memester-xyz/lens-use";
import { usePost as useLensPost } from "./expressEvent/lens/post";
import Snowfall from "react-snowfall";
import { ethers } from "ethers";
import { useModal } from "connectkit";
import { IProfile, ProfileType } from "./expressEvent/types";
import { xor } from "lodash";
import { uploadMetadata } from "../helpers/hooks";
import { GET_PUBLICATIONS } from "./expressEvent/lens/queries";
import { useQuery } from "@apollo/client";
import { setEventTitle } from "features/eventPage/eventPageSlice";

// {profileId:"0x012c7d",contentURI:"https://arweave.net/y7zoJyuy1prGC5wNqAQzk4NWQELskw2YnOjiL3NfIRU",collectModule:"0x23b9467334bEb345aAa6fd1545538F3d54436e96",collectModuleInitData:"0x0000000000000000000000000000000000000000000000000000000000000000",referenceModule:"0x0000000000000000000000000000000000000000",referenceModuleInitData:"0x0"}

export const ExpressEvent: React.FC = (): JSX.Element => {
  const { setColorMode } = useColorMode();
  const { address: connectedAddress } = useAccount();
  const { setOpen: setOpenWalletConnectModal } = useModal();
  const [publishingProfiles, setPublishingProfiles] = useState<IProfile[]>();
  const [eventTitle, setEventTitle] = useState<string>();
  const [eventDetails, setEventDetails] = useState<string>();
  const postContent = `${eventTitle} \n ${eventDetails}`;
  const [postPayload, setPostPayload] =
    useState<Parameters<typeof useLensPost>[0]>();

  useEffect(() => {
    setPostPayload({ ...postPayload, content: postContent });
  }, [postContent]);

  // Lens
  const { isAuthed: isLensAuthed, auth: lensAuth } =
    useLensAuth(connectedAddress);
  const { profiles: lensProfiles, defaultProfile: lensDefaultProfile } =
    useLensProfiles({
      address: connectedAddress,
    });
  const {
    send: lensPost,
    response: lensPostResponse,
    error: lensPostData,
    status: lensPostStatus,
  } = useLensPost({ ...postPayload, profile: lensDefaultProfile });

  // CyberConnect
  const { profiles: CCProfiles, defaultProfile: CCDefaultProfile } =
    useCCProfiles({
      address: connectedAddress,
    });

  // console.log(useQuery(GET_PUBLICATIONS, {
  //   variables: {
  //     request: {
  //       profileId: lensDefaultProfile?.id,
  //       publicationTypes: ["POST"],
  //       sources: ["ExpressEvent"],
  //     },
  //   },
  //   skip: !lensDefaultProfile?.id,
  // }));

  const defaultProfiles = useMemo(
    () =>
      ((defaultProfiles) =>
        defaultProfiles.length ? defaultProfiles : undefined)(
        [lensDefaultProfile, CCDefaultProfile].filter(Boolean)
      ) as IProfile[] | undefined,
    [lensProfiles, CCProfiles]
  );

  const profileTypeToPostActionMap = {
    [ProfileType.LENS]: lensPost,
  } as { [key in ProfileType]: () => Awaited<void> };

  useEffect(() => {
    setColorMode("dark");
  }, []);

  useEffect(() => {
    defaultProfiles && setPublishingProfiles(defaultProfiles);
  }, [defaultProfiles]);

  const publishPosts = () =>
    publishingProfiles &&
    Promise.all(
      publishingProfiles!.map(({ type }) =>
        profileTypeToPostActionMap[type]?.()
      )
    ).then(() => alert("sent"));

  return (
    <>
      <Snowfall snowflakeCount={35} color={"#ffffffbb"} />
      <Flex
        flexDir={"column"}
        gap={"3rem"}
        mt={[0, 0, "1rem"]}
        px={["2rem", "2rem", 0]}
      >
        <Flex flexDir={"column"} gap={"1rem"}>
          <Flex flexDir={"column"}>
            <Heading as={"h2"} textTransform={"uppercase"} fontSize={"4xl"}>
              express
            </Heading>
            <Heading
              as={"h2"}
              textTransform={"uppercase"}
              fontSize={"xl"}
              lineHeight="1rem"
            >
              event
            </Heading>
          </Flex>
          <Heading
            as={"h3"}
            color="textContrastAccent"
            fontWeight={"medium"}
            fontSize={"lg"}
            textTransform={"lowercase"}
            _after={{ content: "'🎉'", px: ".5rem" }}
          >
            single post to host an event
          </Heading>
        </Flex>
        <Flex flexDir={"column"} gap="1rem" zIndex={1}>
          <Flex flexDir={"column"} gap=".5rem">
            <Text
              fontWeight={"bold"}
              color={"textContrastSecondary"}
              fontSize={"lg"}
            >
              post content
            </Text>
            <Container
              as={Flex}
              flexDir={"column"}
              gap={".5rem"}
              bg={"accentPrimaryContrast"}
              borderRadius="sm"
              p=".5rem 2rem"
            >
              <Input
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                variant={"unstyled"}
                placeholder="event title"
                fontSize="3xl"
                fontWeight={"bold"}
                p={0}
                borderRadius={0}
              />
              <Divider />
              <Textarea
                value={eventDetails}
                onChange={(event) => setEventDetails(event.target.value)}
                variant={"unstyled"}
                placeholder="event details"
                border={"none"}
                fontSize="xl"
                minH={"7rem"}
                fontWeight={"bold"}
                borderRadius={0}
                p={0}
              />
            </Container>
          </Flex>
          <Flex flexDir={"column"} gap=".5rem">
            <Text
              fontWeight={"bold"}
              color={"textContrastSecondary"}
              fontSize={"lg"}
            >
              publish from
            </Text>
            <Flex flexDir={"column"} borderRadius="sm" overflow={"hidden"}>
              <Container as={Flex} p="0 2rem" h="4rem" bg={"lensGradient"}>
                <Flex
                  w="100%"
                  justifyContent={"space-between"}
                  align="center"
                  alignSelf={"center"}
                >
                  <Flex gap="1.25rem" align={"center"}>
                    <Icon as={LensIcon} transform={"scale(1.75)"} />
                    <Text color={"lensText"} fontWeight="bold" fontSize={"md"}>
                      {lensProfiles
                        ? lensDefaultProfile
                          ? lensDefaultProfile.handle
                          : "Lens"
                        : "Lens"}
                    </Text>
                  </Flex>
                  {connectedAddress ? (
                    lensProfiles ? (
                      lensDefaultProfile ? (
                        isLensAuthed ? (
                          <Switch
                            isChecked={publishingProfiles?.includes(
                              lensDefaultProfile
                            )}
                            onChange={() =>
                              setPublishingProfiles(
                                xor(publishingProfiles, [lensDefaultProfile])
                              )
                            }
                          />
                        ) : (
                          <Button
                            variant={"secondary"}
                            bg={"transparentOverlay"}
                            onClick={lensAuth}
                          >
                            Authenticate
                          </Button>
                        )
                      ) : (
                        <Link target={"_blank"} href="https://www.lens.xyz/">
                          <Button>Get Profile</Button>
                        </Link>
                      )
                    ) : (
                      <Spinner color="bg" />
                    )
                  ) : (
                    <Button
                      variant={"secondary"}
                      bg={"transparentOverlay"}
                      onClick={() => setOpenWalletConnectModal(true)}
                    >
                      Connect Wallet
                    </Button>
                  )}
                </Flex>
              </Container>
              {/* <Container p="1 2">CyberConnect</Container>
              <Container>twitter</Container> */}
            </Flex>
          </Flex>
          <Button
            variant={"accent"}
            disabled={!connectedAddress}
            leftIcon={<PublishIcon stroke={"var(--chakra-colors-text)"} />}
            borderRadius="sm"
            color={"text"}
            onClick={publishPosts}
          >
            Publish
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default ExpressEvent;
