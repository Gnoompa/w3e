import { useChallenge, useAuthenticate } from "@memester-xyz/lens-use";
import { useEffect, useMemo, useState } from "react";
import { useSignMessage } from "wagmi";

export const useAuth = (address: string | undefined) => {
  const { data: challengeData, refetch: refetchChallenge } =
    useChallenge(address);
  const {
    data: signedChallenge,
    isError,
    isLoading,
    isSuccess,
    signMessage,
  } = useSignMessage({
    message: challengeData?.challenge.text,
  });
  const [lensAuthenticate, { data: authData }] = useAuthenticate(
    address,
    signedChallenge
  );

  useEffect(() => {
    signedChallenge && lensAuthenticate();
  }, [signedChallenge]);

  useEffect(() => {
    authData &&
      (localStorage.setItem(
        "lensAccessToken",
        authData.authenticate.accessToken
      ),
      localStorage.setItem(
        "lensRefreshToken",
        authData.authenticate.refreshToken
      ));
  }, [authData]);

  const auth = () => signMessage();

  return {
    auth,
    isAuthed: authData || !!localStorage.getItem("lensAccessToken"),
    isError,
    isLoading,
    isSuccess,
  };
};

export default useAuth;
