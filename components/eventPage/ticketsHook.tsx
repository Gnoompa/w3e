import { BigNumber, BigNumberish } from "ethers";
import {
  defaultChainId,
  buyEventTicket,
  prepareBuyEventTicket,
  useMainContractEvents,
  getNativeCurrencyToUsdPrice,
} from "helpers/contract";
import { useRouterQuery } from "helpers/hooks";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useProvider, useWaitForTransaction } from "wagmi";

interface IProps {
  eventTokenId?: BigNumberish;
  ticketTokenIdsToBuy?: BigNumberish[];
  enabled?: boolean;
}

interface ITicketData {
  tokenId: BigNumberish;
  price: BigNumberish;
  nativeCurrencyPrice: BigNumberish;
  supply: BigNumberish;
}

const hook = (props: IProps) => {
  const router = useRouter();
  const routerQuery = useRouterQuery(router);
  const provider = useProvider();
  const [ticketsData, setTicketsData] = useState<ITicketData[]>();
  const [ticketsPriceRange, setTicketsPriceRange] =
    useState<[string, string]>();
  const [ticketsTotalSupply, setTicketsTotalSupply] = useState<number>();
  const [ticketsTotalMinted, setTicketsTotalMinted] = useState<number>();

  const [connectedWalletTickets, setConnectedWalletTickets] =
    useState<ITicketData[]>();

  const { data: eventTicketsCreatedEvents } = useMainContractEvents({
    eventName: "TicketsCreated",
    filters: {
      [defaultChainId]: [null, BigNumber.from(routerQuery.id).toHexString()],
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
    buyEventTicket(preparedBuyEventTicketWriteConfig);

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

  // const {
  //   data: nativeCurrencyToUsdPrice,
  //   refetch: refetchNativeCurrencyToUsdPrice,
  // } = getNativeCurrencyToUsdPrice();

  useEffect(() => {
    props.enabled && refetchTicketsData();
  }, []);

  const buyTickets = useCallback(() => {}, [
    props.eventTokenId,
    props.ticketTokenIdsToBuy,
  ]);

  const refetchTicketsData = () => {};

  return {
    ticketsData,
    refetchTicketsData,
    ticketsTotalSupply,
    ticketsTotalMinted,
    ticketsPriceRange,
    connectedWalletTickets,
    buyTickets,
  };
};

hook.defaultProps = {
  enabled: true,
} as IProps;

export default hook;
