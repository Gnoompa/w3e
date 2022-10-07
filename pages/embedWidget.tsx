import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount, useProvider } from "wagmi";
import { useModal } from "connectkit";
import { defaultChainId, useMainContractEvents } from "helpers/contract";
import { BigNumber } from "ethers";

export const EmbedWidget = () => {
  const router = useRouter();
  const provider = useProvider();

  return <>test</>;
};

export default EmbedWidget;
