import {
  usePrepareContractWrite,
  useContractWrite,
  chain,
  useSignTypedData,
} from "wagmi";
import { hub as hubABI } from "./abi";
import { useLensHubAddress } from "@memester-xyz/lens-use/dist/context/LensContext";
import { useContractPost } from "@memester-xyz/lens-use";
import { CurrencyTypes, PostHook } from "../types";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { uploadMediaToIpfs, uploadMetadata } from "../../../helpers/hooks";
import { Routes } from "helpers/routes";
import getPlaceholderNftUrl from "../getPlaceholderNftUrl";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_POST_TYPED_DATA } from "./queries";
import client from "./client";
import { omit } from "lodash";
import { uploadFileToArweave, uploadToArweave } from "../uploadToArweave";

export const usePost: PostHook = ({
  profile,
  content,
  attachments,
  priceToCollect,
  priceToCollectCurrencyType,
}) => {
  const addressOrName = useLensHubAddress();
  const collectModule = ethers.constants.AddressZero;
  // const collectModule = "0x11C45Cbc6fDa2dbe435C0079a2ccF9c4c7051595";
  const collectModuleInitData = ethers.constants.HashZero;
  const referenceModule = ethers.constants.AddressZero;
  const referenceModuleInitData = "0x";

  const postMetadata = {
    version: "2.0.0",
    description:
      "Made with [Express Event](https://web3events.ai/#expressEvent) - single post to host an event",
    name: "Post by @gnoompa.lens",
    tags: ["event", "express"],
    mainContentFocus: "TEXT_ONLY",
    locale: "en-US",
    appId: "Express_Event",
  };

  // todo prepare transaction
  const {
    write,
    data,
    error: writeError,
    status,
  } = useContractWrite({
    addressOrName,
    contractInterface: hubABI,
    chainId: chain.polygonMumbai.id,
    mode: "recklesslyUnprepared",
    functionName: "postWithSig",
  });

  const [postData, setPostData] = useState<object>();
  const [getPostTypedData, { data: postTypedData }] = useMutation(
    CREATE_POST_TYPED_DATA,
    {
      variables: { request: postData },
      client: client,
    }
  );

  const { signTypedDataAsync } = useSignTypedData();

  useEffect(() => {
    postData && getPostTypedData();
  }, [postData]);

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
      }).then((signature) => {
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
      });
    }
  }, [postTypedData]);

  const getEventLink = (eventMetadataId: string): string =>
    `${location.origin}${Routes.ExpressEvent}?id=${eventMetadataId}`;

  const sendPost = async () => {
    const eventMetadataId = (
      await uploadMetadata({
        v: "0.1",
        publishingProfile: profile,
      })
    ).replace("ipfs://", "");

    const postNftImage =
      "https://arweave.net/" + (await getPlaceholderNftUrl("test title", true));

    const config = {
      profileId: profile!.id,
      contentURI:
        "https://arweave.net/" +
        (await uploadToArweave({
          ...postMetadata,
          // metadata_id: `${profile!.id}-${+Date.now()}`,
          metadata_id: eventMetadataId,
          // image: postNftImage,
          // image:
          //   "https://ipfs.io/ipfs/QmY9dUwYu67puaWBMxRKW98LPbXCznPwHUbhX5NeWnCJbX",
          // imageMimeType: "image/svg+xml",
          // imageMimeType: "image/jpeg",
          content: `${content} \n\n [EVENT PAGE](${getEventLink(
            eventMetadataId
          )})`,
          external_url: getEventLink(eventMetadataId),
          attributes: [
            {
              traitType: "string",
              displayType: "string",
              value: eventMetadataId,
            },
          ],
        })),
      collectModule: {
        freeCollectModule: {
          followerOnly: true,
        },
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
    response: data,
    error: writeError || undefined,
    status,
  };
};

export default usePost;
