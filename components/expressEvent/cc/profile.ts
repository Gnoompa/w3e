import { useEffect, useMemo, useState } from "react";
import * as chain from "@wagmi/core/chains";
import { IProfile, ProfilesHook, ProfileType } from "../types";
import { client } from "./client";
import { getProfiles as getProfilesQuery } from "./queries";
import { gql } from "@apollo/client";

const getProfile = (profile: Object | undefined): IProfile | undefined =>
  profile
    ? {
        chainID: chain.mainnet.id,
        id: profile!.profileID,
        address: profile!.owner?.address,
        handle: profile!.handle,
        isDefault: profile!.isPrimary,
        type: ProfileType.CC,
      }
    : undefined;

export const isFollowing = async (address: string, who: string) =>
  !!(
    await client.query({
      query: gql`
        query isFollower($address: AddressEVM!, $who: AddressEVM!) {
          address(address: $address, chainID: 1) {
            address
            isFollowedBy(addresses: [$who])
          }
        }
      `,
      variables: {
        address,
        who,
      },
    })
  ).data?.address?.isFollowedBy;

// isFollowing(
//   "0x5b3999bc2e8c46f75BF629DA951559D83E34FBdD",
//   "0xdE088e6CB5149C5129cd1e476c9af4709D2aeEB9"
// ).then((a) => console.log(a, 555));

export const useProfiles: ProfilesHook = (props) => {
  const [profiles, setProfiles] = useState<IProfile[]>();
  const defaultProfile = useMemo(
    () => profiles?.filter(({ isDefault }) => isDefault)[0],
    [profiles]
  );

  useEffect(() => {
    props.address &&
      getProfiles({
        address: props.address,
        chainID: chain.mainnet.id,
      }).then((response) =>
        setProfiles(
          response?.data?.address?.wallet?.profiles?.edges.map(({ node }) =>
            getProfile(node)
          )
        )
      );
  }, [props.address]);

  const getProfiles = async (request: { address: string; chainID: number }) =>
    client.query({
      query: getProfilesQuery,
      variables: { ...request },
    });

  return {
    profiles,
    defaultProfile,
  };
};

export default useProfiles;
