import { useModal } from "connectkit";
import { BigNumber, BigNumberish, ethers, Event } from "ethers";
import {
  defaultChainId,
  buyEventTicket as buyEventTicketContractCall,
  prepareBuyEventTicket,
  useMainContractEvents,
  getEventTicketTiers,
  useTokenMetadataFetch,
} from "helpers/contract";
import { useAppSelector, useRouterQuery } from "helpers/hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useProvider, useWaitForTransaction } from "wagmi";

interface IProps {
  eventTokenId: string;
}

const TicketManager = (props: IProps) => {
  const provider = useProvider();
  const { setOpen: setWalletConnectModalOpen } = useModal();
  const nativeCurrencyToUsdPrice = useAppSelector(
    (state) => state.app.nativeCurrencyToUsdPrice
  );
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
    eventName: "TicketBought",
    filters: {
      [defaultChainId]: [
        null,
        BigNumber.from(props.eventTokenId).toHexString(),
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
    error: preparedBuyEventTicketWriteConfigError,
  } = prepareBuyEventTicket({
    ...buyEventTicketWriteConfigToPrepare,
    enabled: false,
  });

  const { data: buyEventTicketWriteResponse, write: buyEventTicketWrite } =
    buyEventTicketContractCall(preparedBuyEventTicketWriteConfig);

  const {
    isLoading: isLoadingBuyEventTicketWrite,
    data: buyEventTicketWriteData,
    isSuccess: isSuccessBuyEventTicketWrite,
    isError: isErrorBuyEventTicketWrite,
    error: buyEventTicketWriteError,
  } = useWaitForTransaction({
    hash: buyEventTicketWriteResponse?.hash,
    wait: buyEventTicketWriteResponse?.wait,
  });

  const [eventTicketTierIdToBeBought, setEventTicketTierIdToBeBought] =
    useState<number>();
  const isBuyingEventTicket = eventTicketTierIdToBeBought !== undefined;

  useEffect(() => {
    eventTicketTiers &&
      !eventTicketTiersRef.current &&
      (eventTicketTiersRef.current = eventTicketTiers[0].map(
        ({ metadataUri }) => metadataUri
      ));
  }, [props.eventTokenId, eventTicketTiers]);

  useEffect(() => {
    refetchConnectedWalletEventTicketBoughtEvents();
  }, [isSuccessBuyEventTicketWrite]);

  useEffect(() => {
    isWalletConnected &&
      isBuyingEventTicket &&
      buyEventTicket(eventTicketTierIdToBeBought);
  }, [isWalletConnected, isBuyingEventTicket]);

  useEffect(() => {
    buyEventTicketWriteConfigToPrepare &&
      (buyEventTicketWrite
        ? buyEventTicketWrite()
        : refetchPreparedBuyEventTicketWriteConfig());
  }, [buyEventTicketWriteConfigToPrepare, buyEventTicketWrite]);

  useEffect(() => {
    buyEventTicketWriteData &&
      isSuccessBuyEventTicketWrite &&
      (refetchConnectedWalletEventTicketBoughtEvents(),
      setEventTicketTierIdToBeBought(undefined));
  }, [buyEventTicketWriteData, isSuccessBuyEventTicketWrite]);

  const buyEventTicket = (ticketTierId: number) => {
    setEventTicketTierIdToBeBought(ticketTierId);

    (props.eventTokenId && eventTicketTiers && mbConnectWallet()) ||
      setBuyEventTicketWriteConfigToPrepare({
        args: [props.eventTokenId!, ticketTierId, [connectedWalletAddress!]],
        overrides: {
          value: getEventTicketPrice(ticketTierId),
        },
      });
  };

  const getEventTicketPrice = (ticketTierId: number) =>
    BigNumber.from(nativeCurrencyToUsdPrice)!
      .mul(10 ** 10)
      .mul(
        +ethers.utils.formatEther(
          eventTicketTiers[0][ticketTierId].ticketPrice.toString()
        )
      );

  const mbConnectWallet = () =>
    isWalletConnected ? false : (setWalletConnectModalOpen(true), true);

  return {
    eventTicketTiers,
    eventTicketTiersMetadata,
    isLoadingEventTicketTiers,
    connectedWalletEventTicketBoughtEvents,
    buyEventTicket,
    isSuccessBuyEventTicketWrite,
    isErrorBuyEventTicketWrite,
    buyEventTicketWriteError,
    isBuyingEventTicket,
  };
};

TicketManager.defaultProps = {};

export default TicketManager;
