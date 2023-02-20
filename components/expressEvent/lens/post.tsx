import { gql, useMutation, useQuery } from "@apollo/client";
import { useLensHubAddress } from "@memester-xyz/lens-use/dist/context/LensContext";
import { ethers } from "ethers";
import { defaultChainId } from "helpers/contract";
import { uploadMetadata } from "helpers/hooks";
import { Routes } from "helpers/routes";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { useContractWrite, useSignTypedData } from "wagmi";
import { stables } from "../constants";
import { PostHook } from "../types";
import { hub as hubABI } from "./abi";
import client from "./client";
import { getDefaultProfile } from "./profile";
import { CREATE_POST_TYPED_DATA, GET_PUBLICATIONS } from "./queries";

export const hasCollectedPost = async (
  postCollectNftAddress: string,
  who: string /** ethereum address */
): Promise<boolean> =>
  !!(
    await client.query({
      query: gql`
        query Nfts($request: NFTsRequest!) {
          nfts(request: $request) {
            items {
              tokenId
            }
          }
        }
      `,
      variables: {
        request: {
          ownerAddress: who,
          contractAddress: postCollectNftAddress,
          limit: 1,
          chainIds: [defaultChainId],
        },
      },
    })
  )?.data?.nfts?.items?.length;

export const hasMirroredPost = async (
  publicationId: string,
  who: string /** ethereum address */
): Promise<boolean> => {
  const defaultProfile = await getDefaultProfile(who);

  return !!(
    defaultProfile &&
    (
      await client.query({
        query: gql`
          query Publications(
            $publicationId: InternalPublicationId!
            $who: ProfileId!
          ) {
            publications(
              request: { publicationIds: [$publicationId], limit: 1 }
            ) {
              items {
                __typename
                ... on Post {
                  mirrors(by: $who)
                }
              }
            }
          }
        `,
        variables: {
          publicationId,
          who: defaultProfile.id,
        },
      })
    )?.data?.publications?.items?.[0]?.mirrors?.length
  );
};

// hasCollectedPost(
//   "0xfE96AAc921140b4E99Cd3917adDC7A7CB1FdcA41",
//   "0xadfa1b280548095f91b22c4568DAae073B477689"
// ).then(a => console.log(a, 32423));

// hasMirroredPost(
//   "0x0121-0x36",
//   "0x5b3999bc2e8c46f75BF629DA951559D83E34FBdD"
// ).then(a => console.log(a, 111));

export const usePost: PostHook = ({
  profile,
  content,
  attachments,
  priceToCollect,
  eventMetadataId,
}) => {
  const address = useLensHubAddress();

  const { data: fetchedPost } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        profileId: profile?.id,
        publicationTypes: ["POST"],
        sources: ["Express_Event"],
        metadata: {
          tags: {
            oneOf: [eventMetadataId],
          },
        },
      },
    },
    skip: !profile?.id || !eventMetadataId,
  });

  const postMetadata = {
    version: "2.0.0",
    description:
      "Made with [Express Event](https://web3events.ai/#expressEvent) - single post to host an event",
    tags: [
      "event",
      "express",
      "web3events",
      "web3event",
      "events",
      "expressevent",
    ],
    mainContentFocus: "TEXT_ONLY",
    locale: "en-US",
    appId: "Express_Event",
  };

  // todo prepare transaction
  const {
    write,
    data,
    error: writeError,
    status: writeStatus,
  } = useContractWrite({
    address,
    abi: hubABI,
    chainId: defaultChainId,
    mode: "recklesslyUnprepared",
    functionName: "postWithSig",
  });

  const [status, setStatus] = useState<string>("idle");
  const [postData, setPostData] = useState<object>();
  const [getPostTypedData, { data: postTypedData, error: postTypedDataError }] =
    useMutation(CREATE_POST_TYPED_DATA, {
      variables: { request: postData },
      client: client,
    });

  const { signTypedDataAsync } = useSignTypedData();

  useEffect(() => {
    status !== "idle" && setStatus("idle");
  }, [status]);

  useEffect(() => {
    writeStatus == "error" && setStatus("error");
    writeStatus == "success" && setStatus("success");
  }, [writeStatus]);

  useEffect(() => {
    postTypedDataError && setStatus("error");
  }, [postTypedDataError]);

  useEffect(() => {
    postData && getPostTypedData();
  }, [postData]);

  useEffect(() => {
    postData && getPostTypedData();
  }, [eventMetadataId]);

  useEffect(() => {
    if (postTypedData) {
      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
        deadline,
      } = postTypedData.createPostTypedData.typedData.value;

      signTypedDataAsync({
        domain: omit(
          postTypedData.createPostTypedData.typedData.domain,
          "__typename"
        ),
        types: omit(
          postTypedData.createPostTypedData.typedData.types,
          "__typename"
        ),
        value: omit(
          postTypedData.createPostTypedData.typedData.value,
          "__typename"
        ),
      })
        .then((signature) => {
          const { v, r, s } = ethers.utils.splitSignature(signature);
          const sig = { v, r, s, deadline };

          const inputStruct = {
            profileId,
            contentURI,
            collectModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData,
            sig,
          };

          write({
            recklesslySetUnpreparedArgs: [inputStruct],
          });
        })
        .catch((e) => setStatus("error"));
    }
  }, [postTypedData]);

  const getEventLink = (eventMetadataId: string): string =>
    `${location.origin}${Routes.ExpressEvent}?id=${eventMetadataId}`;

  const sendPost = async (eventMetadataId: string) => {
    // const postNftImage =
    //   "https://arweave.net/" + (await getPlaceholderNftUrl("test title", true));

    const config = {
      profileId: profile!.id,
      contentURI:
        "https://arweave.net/" +
        (await uploadMetadata({
          ...postMetadata,
          name: `Express Event by ${profile!.handle}`,
          // metadata_id: `${profile!.id}-${+Date.now()}`,
          metadata_id: eventMetadataId,
          // image: postNftImage,
          // image:
          //   "https://ipfs.io/ipfs/QmY9dUwYu67puaWBMxRKW98LPbXCznPwHUbhX5NeWnCJbX",
          // imageMimeType: "image/svg+xml",
          // imageMimeType: "image/jpeg",
          content: `${content}\n\n🎫 Basic pass for followers\n🎟 VIP pass for repost and collect\n\n[Event Page](${getEventLink(
            eventMetadataId
          )})`,
          external_url: getEventLink(eventMetadataId),
          tags: [eventMetadataId],
        })),
      collectModule: {
        ...(priceToCollect
          ? {
              feeCollectModule: {
                amount: {
                  currency: stables[defaultChainId],
                  value: `${priceToCollect}`,
                },
                recipient: profile?.address,
                referralFee: 0,
                followerOnly: false,
              },
            }
          : {
              freeCollectModule: {
                followerOnly: false,
              },
            }),
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    setPostData(config);

    // const config = {
    //   profileId: "0x0121",
    //   contentURI:
    //     "https://arweave.net/AW5YiOxYpgb1FSJRAFua_nO867KVtOnEBDDPVY2DSTg",
    //   collectModule: "0x75fe7513709E6Ca573d017cE979F7d35192CE0d5",
    //   collectModuleInitData: "0x",
    //   referenceModule: "0x0000000000000000000000000000000000000000",
    //   referenceModuleInitData: "0x",
    //   "sig": {
    //       "v": 28,
    //       "r": "0x4ca5c2e933a7ede074426483f56638575a373dd7bfe7770c06315c6787ee1f0f",
    //       "s": "0x35211e4830826351a0e4f94cc34089890b89564d48a213d43e1e47717e597668",
    //       "deadline": 1672167661
    //   }
    // };

    // console.log(postNftImage, config);

    // console.log({
    //   profileId: profile!.id,
    //   contentURI:
    //     (await uploadMetadata({
    //       ...postMetadata,
    //       metadata_id: `${profile!.id}-${+Date.now()}`,
    //       content: `${content} \n\n [EVENT PAGE]${getEventLink(
    //         eventMetadataId
    //       )}`,
    //       external_url: getEventLink(eventMetadataId),
    //     })),
    //   collectModule,
    //   collectModuleInitData,
    //   referenceModule,
    //   referenceModuleInitData,
    // });

    // profile?.id &&
    //   content &&
    //   write({
    //     recklesslySetUnpreparedArgs: [
    //       {
    //         profileId: "0x0121",
    //         contentURI: "ipfs://QmNzhunXbCCqzZjWNXhxUKkhAeeH6TKKERNvYAKfPEPt7v",
    //         collectModule: "0x75fe7513709E6Ca573d017cE979F7d35192CE0d5",
    //         collectModuleInitData: "0x",
    //         referenceModule: "0x0000000000000000000000000000000000000000",
    //         referenceModuleInitData: "0x",
    //       },
    //     ],
    //   });
  };

  return {
    send: sendPost,
    post: fetchedPost?.publications?.items?.[0],
    response: data,
    error: writeError || undefined,
    status,
  };
};

export default usePost;
