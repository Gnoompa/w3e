import { useEffect, useMemo, useState } from "react";
import { chain, useSignMessage } from "wagmi";
import { IProfile } from "../types";
import { client } from "./client";
import { loginGetMessage, loginVerify } from "./queries";
import { useMutation, useLazyQuery } from "@apollo/client";

export const useAuth = (address: string | undefined) => {
  const [getMessageToSign, { data: messageToSignData }] = useMutation(
    loginGetMessage,
    {
      variables: {
        domain: "web3events.ai",
        address: address,
        chainID: chain.mainnet.id,
      },
      client: client,
    }
  );
  const {
    data: signedMessage,
    isError,
    isLoading,
    isSuccess,
    signMessage,
  } = useSignMessage({
    message: messageToSignData?.loginGetMessage?.message,
  });
  const [getUserToken, { data: userToken }] = useMutation(loginVerify, {
    variables: {
      domain: "web3events.ai",
      address: address,
      chainID: chain.mainnet.id,
      signature: signedMessage,
    },
    client: client,
  });
  useEffect(() => {
    messageToSignData?.loginGetMessage?.message && signMessage();
  }, [messageToSignData]);

  useEffect(() => {
    signedMessage && getUserToken();
  }, [signedMessage]);

  useEffect(() => {
    userToken?.loginVerify?.accessToken &&
      localStorage.setItem(
        "cyberConnectAccessToken",
        userToken?.loginVerify?.accessToken
      );
  }, [userToken]);

  const auth = () => getMessageToSign();

  return {
    auth,
    isAuthed: userToken || !!localStorage.getItem("cyberConnectAccessToken"),
    isError,
    isLoading,
    isSuccess,
  };
};

export default useAuth;
