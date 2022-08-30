import {
  chain,
  Chain,
  useContractRead,
  useContractWrite,
  useContractReads,
  usePrepareContractWrite,
  useProvider,
} from "wagmi";
import { Provider } from "@wagmi/core";
import { Main as MainContractTypechain } from "types/typechain/Main";
import { ERC1155MixedFungibleMintable as TokenContractTypechain } from "types/typechain/ERC1155MixedFungibleMintable";
import MainContractABI from "../abi/Main.sol/Main.json";
import TokenContractABI from "../abi/ERC1155MixedFungibleMintable.sol/ERC1155MixedFungibleMintable.json";
import { Log } from "@ethersproject/abstract-provider/src.ts";
import { Interface, LogDescription } from "ethers/lib/utils";
import { Contract, ethers, Event, Transaction } from "ethers";
import { useEffect, useState } from "react";
import { config } from "process";
import { AggregatorV3Interface } from "types/typechain";
import { getIPFSUri, defaulyIPFSgateway } from "./hooks";

const chainlinkPriceOracleABI =
  '[{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"},{"internalType":"address","name":"_accessController","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"updatedAt","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accessController","outputs":[{"internalType":"contract AccessControllerInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aggregator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"confirmAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"","type":"uint16"}],"name":"phaseAggregators","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phaseId","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"proposeAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"proposedAggregator","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"proposedGetRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposedLatestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_accessController","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]';

const defaultChainId = chain.polygonMumbai.id;

const chainIdToChainlinkPriceOracleContractAddressMap = {
  [chain.polygon.id]: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
  [chain.polygonMumbai.id]: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
};

const chainIdToMainContractAddressMap = {
  [chain.polygonMumbai.id]: "0xC152e19e564E1AC8b3D316F09A369B3e8e503062",
};

const chainIdToTokenContractAddressMap = {
  [chain.polygonMumbai.id]: "0x040d0E3eD07D1b963752d7dfce0D5995d67a1d97",
};

const chainIdToMainContractMap = {
  [chain.polygonMumbai.id]: (provider?: Provider) =>
    new ethers.Contract(
      chainIdToMainContractAddressMap[chain.polygonMumbai.id],
      MainContractABI.abi,
      provider
    ),
};

const chainIdToTokenContractMap = {
  [chain.polygonMumbai.id]: (provider?: Provider) =>
    new ethers.Contract(
      chainIdToTokenContractAddressMap[chain.polygonMumbai.id],
      TokenContractABI.abi,
      provider
    ),
};

type getContractEventsArgs = {
  chainIdToContractMap: {
    [chainId: Chain["id"]]: (provider: Provider) => Contract;
  };
  eventName: string;
  provider: Provider;
  filters?: Record<Chain["id"], any>;
  enabled?: boolean;
  chainIds?: Chain["id"][];
};

export const getContractEvents = ({
  chainIdToContractMap,
  chainIds = [defaultChainId],
  provider,
  eventName,
  filters,
}: getContractEventsArgs) =>
  Promise.all(
    chainIds.map((chainId) => {
      const contract = chainIdToContractMap[chainId]?.(provider);

      return contract?.filters[eventName]
        ? contract.queryFilter(
            contract?.filters[eventName]?.(...(filters?.[chainId] || []))
          )
        : [];
    })
  );

type useContractEventsProps = getContractEventsArgs;

export const useContractEvents = ({
  chainIdToContractMap,
  enabled = true,
  provider,
  ...config
}: useContractEventsProps) => {
  const [data, setData] = useState<Event[][]>();
  const [isLoading, setIsLoading] = useState(false);

  const refetch = () => {
    setIsLoading(true);

    return getContractEvents({
      chainIdToContractMap,
      provider,
      ...config,
    })
      .then(setData)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    enabled && refetch();
  }, [enabled]);

  return {
    data,
    refetch,
    isLoading,
  };
};

// todo create common typings
// todo create dynamic event typings if possible

export const useMainContractEvents = ({
  ...args
}: Omit<useContractEventsProps, "chainIdToContractMap">) =>
  useContractEvents({
    chainIdToContractMap: chainIdToMainContractMap,
    ...args,
  });

export const useTokenContractEvents = ({
  ...args
}: Omit<useContractEventsProps, "chainIdToContractMap">) =>
  useContractEvents({
    chainIdToContractMap: chainIdToTokenContractMap,
    ...args,
  });

export const getEventTickets = (
  configs: (Omit<Partial<Parameters<typeof useContractRead>[0]>, "args"> & {
    args: Parameters<
      typeof MainContractTypechain.prototype.getEventTickets
    >[0][];
  })[],
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId, i) => ({
      addressOrName: chainIdToMainContractAddressMap[chainId],
      contractInterface: MainContractABI.abi,
      functionName: "getEventTickets",
      chainId,
      ...configs[i],
    })),
  }) as ReturnType<typeof useContractReads> & {
    data: Awaited<
      ReturnType<typeof MainContractTypechain.prototype.getEventTickets>[]
    >;
  };

export const getEvents = (
  configs: (Partial<Parameters<typeof useContractRead>[0]> & {
    args: Parameters<typeof MainContractTypechain.prototype.getEvents>[0];
  })[],
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId, i) => ({
      addressOrName: chainIdToMainContractAddressMap[chainId],
      contractInterface: MainContractABI.abi,
      functionName: "events",
      chainId,
      ...configs[i],
    })),
  }) as ReturnType<typeof useContractReads> & {
    data: Awaited<ReturnType<typeof MainContractTypechain.prototype.events>>[];
  };

export const prepareCreateEvent = ({
  chainId = defaultChainId,
  ...config
}: Omit<Partial<Parameters<typeof usePrepareContractWrite>[0]>, "args"> & {
  args:
    | Parameters<typeof MainContractTypechain.prototype.createEvent>[0]
    | undefined;
}) =>
  usePrepareContractWrite({
    addressOrName: chainIdToMainContractAddressMap[chainId],
    contractInterface: MainContractABI.abi,
    functionName: "createEvent",
    chainId,
    ...config,
  });

export const createEvent = ({
  chainId = defaultChainId,
  ...config
}:
  | ReturnType<typeof usePrepareContractWrite>["config"]
  | (Parameters<typeof useContractWrite>[0] & {
      args: Parameters<typeof MainContractTypechain.prototype.createEvent>[0];
    })) => useContractWrite(config);

export const prepareBuyEventTicket = ({
  chainId = defaultChainId,
  ...config
}: Omit<Partial<Parameters<typeof usePrepareContractWrite>[0]>, "args"> & {
  args?:
    | Parameters<typeof MainContractTypechain.prototype.buyTickets>
    | undefined;
}) =>
  usePrepareContractWrite({
    addressOrName: chainIdToMainContractAddressMap[chainId],
    contractInterface: MainContractABI.abi,
    functionName: "buyTickets",
    chainId,
    ...config,
  });

export const buyEventTicket = ({
  chainId = defaultChainId,
  ...config
}:
  | ReturnType<typeof usePrepareContractWrite>["config"]
  | (Parameters<typeof useContractWrite>[0] & {
      args: Parameters<typeof MainContractTypechain.prototype.buyTickets>;
    })) => useContractWrite(config);

export const getEventManagers = (
  configs: (Omit<Partial<Parameters<typeof useContractRead>[0]>, "args"> & {
    args: Parameters<
      typeof MainContractTypechain.prototype.getEventManagers
    >[0][];
  })[],
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId, i) => ({
      addressOrName: chainIdToMainContractAddressMap[chainId],
      contractInterface: MainContractABI.abi,
      chainId,
      functionName: "getEventManagers",
      ...configs[i],
    })),
  }) as ReturnType<typeof useContractReads> & {
    data: Awaited<
      ReturnType<typeof MainContractTypechain.prototype.getEventManagers>
    >[];
  };

export const getTokenMetadataUris = (
  configs: (Omit<Partial<Parameters<typeof useContractRead>[0]>, "args"> & {
    args: Parameters<typeof TokenContractTypechain.prototype.uriOfBatch>[0][];
  })[],
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId, i) => ({
      addressOrName: chainIdToTokenContractAddressMap[chainId],
      contractInterface: TokenContractABI.abi,
      functionName: "uriOfBatch",
      chainId,
      ...configs[i],
    })),
  }) as ReturnType<typeof useContractReads> & {
    data: Awaited<
      ReturnType<typeof TokenContractTypechain.prototype.uriOfBatch>
    >[];
  };

export const getOwnerOfToken = (
  configs: (Omit<Partial<Parameters<typeof useContractRead>[0]>, "args"> & {
    args: (
      | Parameters<typeof TokenContractTypechain.prototype.ownerOf>[0]
      | undefined
    )[];
  })[],
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId, i) => ({
      addressOrName: chainIdToTokenContractAddressMap[chainId],
      contractInterface: TokenContractABI.abi,
      functionName: "ownerOf",
      chainId,
      ...configs[i],
    })),
  }) as ReturnType<typeof useContractReads> & {
    data: Awaited<
      ReturnType<typeof TokenContractTypechain.prototype.ownerOf>
    >[];
  };

export const getNativeCurrencyToUsdPrice = (
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId) => ({
      addressOrName: chainIdToChainlinkPriceOracleContractAddressMap[chainId],
      contractInterface: JSON.parse(chainlinkPriceOracleABI),
      functionName: "latestRoundData",
      chainId,
    })),
  }) as ReturnType<typeof useContractReads> & {
    data: Awaited<
      ReturnType<typeof AggregatorV3Interface.prototype.latestRoundData>
    >[];
  };

type useTokenMetadataFetchProps = {
  did: string | undefined;
  gateway?: string;
  enabled?: boolean;
};

export const useTokenMetadataFetch = ({
  did,
  gateway = defaulyIPFSgateway,
  enabled = true,
}: useTokenMetadataFetchProps) => {
  const [data, setData] = useState<object>();
  const [isLoading, setIsLoading] = useState(false);

  const refetch = () => {
    setIsLoading(true);

    return fetch(getIPFSUri(did as string) as string)
      .then((response) => response.text())
      .then((json) => setData(JSON.parse(json)))
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    enabled && did && gateway && refetch();
  }, [did, gateway, enabled]);

  return {
    data,
    refetch,
    isLoading,
  };
};

export const parseTransactionLogs = (
  logs: Array<Log>,
  iface: Interface = chainIdToMainContractMap[defaultChainId]().interface
): LogDescription[] =>
  logs
    .map((log) => {
      try {
        return iface.parseLog(log);
      } catch (e) {}
    })
    .filter(Boolean) as LogDescription[];
