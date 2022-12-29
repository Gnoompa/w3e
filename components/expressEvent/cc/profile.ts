import { useEffect, useMemo, useState } from "react";
import { chain } from "wagmi";
import { IProfile, ProfilesHook, ProfileType } from "../types";
import { client } from "./client";
import { getProfiles as getProfilesQuery } from "./queries";

const getProfile = (profile: Object | undefined): IProfile | undefined =>
  profile
    ? {
        id: profile!.id,
        handle: profile!.handle,
        isDefault: profile!.isPrimary,
        type: ProfileType.CC,
      }
    : undefined;

export const useProfiles: ProfilesHook = (props) => {
  const [profiles, setProfiles] = useState<IProfile[]>();
  const defaultProfile = useMemo(
    () =>
      getProfile(
        profiles?.data?.address?.wallet?.profiles?.edges.filter(
          ({ node }) => node?.isPrimary
        )[0]?.node
      ),
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
