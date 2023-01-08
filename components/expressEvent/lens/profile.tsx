import { useProfiles as lensUseProfiles } from "@memester-xyz/lens-use";
import { useMemo } from "react";
import { IProfile, ProfilesHook, ProfileType } from "../types";
import { chain } from "wagmi";
import client from "./client";
import { gql } from "@apollo/client";

const getProfile = (profile: object | undefined): IProfile | undefined =>
  profile
    ? {
        chainID: chain.polygon.id,
        id: profile?.id,
        address: profile!.ownedBy,
        handle: profile?.handle,
        isDefault: profile?.isDefault,
        type: ProfileType.LENS,
      }
    : undefined;

export const getDefaultProfile = async (address: string) =>
  (
    await client.query({
      query: gql`
        query DefaultProfile($address: EthereumAddress!) {
          defaultProfile(request: { ethereumAddress: $address }) {
            id
            handle
            ownedBy
          }
        }
      `,
      variables: {
        address,
      },
    })
  ).data?.defaultProfile;

export const isFollowing = async (
  profileId: string,
  who: string // ethereum address
): Promise<boolean> => {
  const defaultProfile = await getDefaultProfile(who);

  return defaultProfile?.id
    ? (
        await client.query({
          query: gql`
            query Profile($profileId: ProfileId!, $who: ProfileId!) {
              profile(request: { profileId: $profileId }) {
                isFollowing(who: $who)
              }
            }
          `,
          variables: {
            profileId,
            who: defaultProfile?.id,
          },
        })
      )?.data?.profile?.isFollowing
    : false;
};

// isFollowing("0x010e", "0xadfa1b280548095f91b22c4568DAae073B477689").then(console.log);

export const useProfiles: ProfilesHook = (props) => {
  const lensProfiles = lensUseProfiles(props.address);
  const profiles = useMemo(
    () =>
      lensProfiles.data?.profiles?.items
        ?.filter(Boolean)
        ?.map(getProfile) as IProfile[],
    [lensProfiles]
  );

  const defaultProfile =
    profiles?.filter(({ isDefault }) => isDefault)[0] || profiles?.[0];

  return {
    profiles,
    defaultProfile,
  };
};

export default useProfiles;
