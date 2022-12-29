import { useProfiles as lensUseProfiles } from "@memester-xyz/lens-use";
import { useMemo } from "react";
import { IProfile, ProfilesHook, ProfileType } from "../types";

const getProfile = (profile: object | undefined): IProfile | undefined =>
  profile
    ? {
        id: profile?.id,
        handle: profile?.handle,
        isDefault: profile?.isDefault,
        type: ProfileType.LENS,
      }
    : undefined;

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
