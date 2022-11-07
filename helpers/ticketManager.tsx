import { useModal } from "connectkit";
import { BigNumber, BigNumberish, ethers, Event } from "ethers";
import {
  defaultChainId,
  buyEventTicket as buyEventTicketContractCall,
  prepareBuyEventTicket,
  useMainContractEvents,
  getEventTicketTiers,
  useTokenMetadataFetch,
  getNativeCurrencyToUsdPrice,
} from "helpers/contract";
import { useAppSelector, useRouterQuery } from "helpers/hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useAccount,
  useNetwork,
  useProvider,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";

interface IProps {
  eventTokenId: string;
}

const useTicketManager = (props: IProps) => {
  const provider = useProvider();
  const { setOpen: setWalletConnectModalOpen } = useModal();
  const { chain: connectedChain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const {
    data: nativeCurrencyToUsdPrice,
    refetch: refetchNativeCurrencyToUsdPrice,
  } = getNativeCurrencyToUsdPrice();
  const { address: connectedWalletAddress, isConnected: isWalletConnected } =
    useAccount();

  const { data: eventTicketTiers, isLoading: isLoadingEventTicketTiers } =
    getEventTicketTiers([{ args: [props.eventTokenId] }]);
  const eventTicketTiersRef = useRef<string[]>();
  const { data: eventTicketTiersMetadata } = useTokenMetadataFetch({
    dids: eventTicketTiersRef.current,
  }) as { data: EventTicketMetadata[] | undefined };

  const {
    data: connectedWalletEventTicketBoughtEvents,
    refetch: refetchConnectedWalletEventTicketBoughtEvents,
    isLoading: isLoadingConnectedWalletEventTicketBoughtEvents,
  } = useMainContractEvents({
    enabled: false,
    eventName: "TicketBought",
    filters: {
      [defaultChainId]: [
        props.eventTokenId && BigNumber.from(props.eventTokenId).toHexString(),
        null,
        connectedWalletAddress,
      ],
    },
    provider,
  });

  const [
    buyEventTicketWriteConfigToPrepare,
    setBuyEventTicketWriteConfigToPrepare,
  ] = useState<{
    args: Parameters<typeof prepareBuyEventTicket>[0]["args"];
    overrides: Parameters<typeof prepareBuyEventTicket>[0]["overrides"];
  }>();

  const {
    config: preparedBuyEventTicketWriteConfig,
    refetch: refetchPreparedBuyEventTicketWriteConfig,
    isError: isErrorPrepareBuyEventTicketWrite,
    error: preparedBuyEventTicketWriteConfigError,
  } = prepareBuyEventTicket({
    ...buyEventTicketWriteConfigToPrepare,
  });

  const {
    data: buyEventTicketWriteResponse,
    isError: isErrorBuyEventTicketWrite,
    error: buyEventTicketWriteError,
    write: buyEventTicketWrite,
  } = buyEventTicketContractCall(preparedBuyEventTicketWriteConfig);

  const {
    isLoading: isLoadingBuyEventTicketWrite,
    data: buyEventTicketWriteData,
    isSuccess: isSuccessBuyEventTicketWrite,
    isError: isErrorWaitForBuyEventTicketWrite,
    error: waitForBuyEventTicketWriteError,
  } = useWaitForTransaction({
    hash: buyEventTicketWriteResponse?.hash,
    wait: buyEventTicketWriteResponse?.wait,
  });

  const [buyEventTicketPayload, setBuyEventTicketPayload] = useState<{
    ticketTierId: number;
    _for: string[];
  }>();
  const isBuyingEventTicket = buyEventTicketPayload !== undefined;

  useEffect(() => {
    isErrorBuyEventTicketWrite ||
      (isErrorPrepareBuyEventTicketWrite &&
        setBuyEventTicketPayload(undefined));
  }, [isErrorBuyEventTicketWrite, isErrorPrepareBuyEventTicketWrite]);

  useEffect(() => {
    refetchConnectedWalletEventTicketBoughtEvents();
  }, []);

  useEffect(() => {
    eventTicketTiers?.[0] &&
      !eventTicketTiersRef.current &&
      (eventTicketTiersRef.current = eventTicketTiers[0].map(
        ({ metadataUri }) => metadataUri
      ));
  }, [props.eventTokenId, eventTicketTiers]);

  useEffect(() => {
    refetchConnectedWalletEventTicketBoughtEvents();
  }, [isSuccessBuyEventTicketWrite]);

  // useEffect(() => {
  //   isWalletConnected &&
  //     isBuyingEventTicket &&
  //     buyEventTicket(eventTicketTierIdToBeBought);
  // }, [isWalletConnected, isBuyingEventTicket]);

  useEffect(() => {
    buyEventTicketWriteConfigToPrepare &&
      (buyEventTicketWrite
        ? buyEventTicketWrite()
        : refetchPreparedBuyEventTicketWriteConfig());
  }, [buyEventTicketWriteConfigToPrepare, buyEventTicketWrite]);

  useEffect(() => {
    connectedChain?.id == defaultChainId &&
      buyEventTicketPayload !== undefined &&
      buyEventTicket(
        buyEventTicketPayload.ticketTierId,
        buyEventTicketPayload._for
      );
  }, [connectedChain]);

  useEffect(() => {
    buyEventTicketWriteData &&
      isSuccessBuyEventTicketWrite &&
      (refetchConnectedWalletEventTicketBoughtEvents(),
      setBuyEventTicketPayload(undefined));
  }, [buyEventTicketWriteData, isSuccessBuyEventTicketWrite]);

  const buyEventTicket = (ticketTierId: number, _for: string[]) => {
    setBuyEventTicketPayload({ ticketTierId, _for });

    (props.eventTokenId && eventTicketTiers && mbConnectWallet()) ||
      mbSwitchChain() ||
      setBuyEventTicketWriteConfigToPrepare({
        args: [
          props.eventTokenId!,
          ticketTierId,
          _for || [connectedWalletAddress!],
        ],
        overrides: {
          value: getEventTicketPrice(ticketTierId),
        },
      });
  };

  const getEventTicketPrice = (ticketTierId: number) =>
    eventTicketTiers[0][ticketTierId].ticketPrice
      .div(nativeCurrencyToUsdPrice?.[0].answer)
      .mul(10 ** 8);

  const mbSwitchChain = () =>
    connectedChain?.id == defaultChainId
      ? false
      : (switchNetwork?.(defaultChainId), true);

  const mbConnectWallet = () =>
    isWalletConnected ? false : (setWalletConnectModalOpen(true), true);

  return {
    eventTicketTiers,
    eventTicketTiersMetadata,
    isLoadingEventTicketTiers,
    connectedWalletEventTicketBoughtEvents,
    buyEventTicket,
    isSuccessBuyEventTicketWrite,
    isErrorPrepareBuyEventTicketWrite,
    isErrorBuyEventTicketWrite,
    buyEventTicketWriteError,
    isBuyingEventTicket,
  };
};

export default useTicketManager;
