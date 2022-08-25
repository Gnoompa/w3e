import {
  chain,
  Chain,
  useContractRead,
  useContractWrite,
  useContractReads,
  usePrepareContractWrite,
} from "wagmi";
import { Main as MainContractTypechain } from "types/typechain/Main";
import { ERC1155MixedFungibleMintable as TokenContractTypechain } from "types/typechain/ERC1155MixedFungibleMintable";
import MainContractABI from "../abi/Main.sol/Main.json";
import TokenContractABI from "../abi/ERC1155MixedFungibleMintable.sol/ERC1155MixedFungibleMintable.json";
import { config } from "process";
import {
  Log,
  TransactionReceipt,
} from "@ethersproject/abstract-provider/src.ts";
import { Interface, LogDescription } from "ethers/lib/utils";
import { Contract, ethers, Transaction } from "ethers";

const chainlinkPriceOracleABI =
  '[{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"},{"internalType":"address","name":"_accessController","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"updatedAt","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accessController","outputs":[{"internalType":"contract AccessControllerInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aggregator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"confirmAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"","type":"uint16"}],"name":"phaseAggregators","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phaseId","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"proposeAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"proposedAggregator","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"proposedGetRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposedLatestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_accessController","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]';

const defaultChainId = chain.polygonMumbai.id;
const defaulyIPFSgateway = "https://nftstorage.link/ipfs/";

const chainIdToChainlinkPriceOracleContractAddressMapping = {
  [chain.polygon.id]: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
};

const chainIdToMainContractAddressMapping = {
  [chain.polygonMumbai.id]: "0xC152e19e564E1AC8b3D316F09A369B3e8e503062",
};

const chainIdToTokenContractAddressMapping = {
  [chain.polygonMumbai.id]: "0x040d0E3eD07D1b963752d7dfce0D5995d67a1d97",
};

const chainIdToMainContractMapping = {
  [chain.polygonMumbai.id]: new ethers.Contract(
    chainIdToMainContractAddressMapping[chain.polygonMumbai.id],
    MainContractABI.abi
  ),
};

const chainIdToTokenContractMapping = {
  [chain.polygonMumbai.id]: new ethers.Contract(
    chainIdToTokenContractAddressMapping[chain.polygonMumbai.id],
    TokenContractABI.abi
  ),
};

export const getContractEvents = (
  contract: Contract,
  eventName: string,
  filters: Array<any>
) => contract.queryFilter(contract.filters[eventName]?.(...filters));

export const getMainContractEvents = (
  eventName: string,
  filters: Array<any>,
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  Promise.all(
    chainIds.map((chainId) =>
      getContractEvents(
        chainIdToMainContractMapping[chainId],
        eventName,
        filters
      )
    )
  );

export const getTokenContractEvents = (
  eventName: string,
  filters: Array<any>,
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  Promise.all(
    chainIds.map((chainId) =>
      getContractEvents(
        chainIdToTokenContractMapping[chainId],
        eventName,
        filters
      )
    )
  );

export const getEventTickets = (
  configs: (Partial<Parameters<typeof useContractRead>[0]> & {
    args: Parameters<typeof MainContractTypechain.prototype.getTickets>[0];
  })[],
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId, i) => ({
      addressOrName: chainIdToMainContractAddressMapping[chainId],
      contractInterface: MainContractABI.abi,
      functionName: "events",
      chainId,
      ...configs[i],
    })),
  });

export const getEvents = (
  configs: (Partial<Parameters<typeof useContractRead>[0]> & {
    args: Parameters<typeof MainContractTypechain.prototype.getEvents>[0];
  })[],
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId, i) => ({
      addressOrName: chainIdToMainContractAddressMapping[chainId],
      contractInterface: MainContractABI.abi,
      functionName: "events",
      chainId,
      ...configs[i],
    })),
  });

export const prepareCreateEvent = ({
  chainId = defaultChainId,
  ...config
}: Omit<Partial<Parameters<typeof usePrepareContractWrite>[0]>, "args"> & {
  args:
    | Parameters<typeof MainContractTypechain.prototype.createEvent>[0]
    | undefined;
}) =>
  usePrepareContractWrite({
    addressOrName: chainIdToMainContractAddressMapping[chainId],
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

export const getEventManagers = (
  configs: (Partial<Parameters<typeof useContractRead>[0]> & {
    args: Parameters<
      typeof MainContractTypechain.prototype.getEventManagers
    >[0];
  })[],
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId, i) => ({
      addressOrName: chainIdToMainContractAddressMapping[chainId],
      contractInterface: MainContractABI.abi,
      chainId,
      functionName: "getEventManagers",
      ...configs[i],
    })),
  });

export const getTokenMetadataUri = (
  configs: (Partial<Parameters<typeof useContractRead>[0]> & {
    args: Parameters<typeof TokenContractTypechain.prototype.uriOfBatch>[0];
  })[],
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId, i) => ({
      addressOrName: chainIdToTokenContractAddressMapping[chainId],
      contractInterface: TokenContractABI.abi,
      functionName: "uriOfBatch",
      chainId,
      ...configs[i],
    })),
  });

export const getNativeCurrencyToUsdPrice = (
  chainIds: Chain["id"][] = [defaultChainId]
) =>
  useContractReads({
    contracts: chainIds.map((chainId) => ({
      addressOrName:
        chainIdToChainlinkPriceOracleContractAddressMapping[chainId],
      contractInterface: chainlinkPriceOracleABI,
      functionName: "latestAnswer",
      chainId,
    })),
  });

export const fetchMetadata = (
  did: string,
  gateway: string = defaulyIPFSgateway
) =>
  fetch(did.replace("ipfs://", gateway))
    .then((response) => response.text())
    .then((json) => JSON.parse(json));

//     .getTicketsData({ eventTokenId: routerQuery.id })
//     .then(setCurrentEventTickets),
//   web3APIProvider
//     .getEventManagers({ eventId: routerQuery.id })
//     .then(setEventManagers),
//   web3APIProvider
//     .getBoughtTickets({ eventId: routerQuery.id })
//     .then(setCurrentEventSoldTickets),
//   web3APIProvider
//     .getUsedTickets({ eventId: routerQuery.id })
//     .then(setCurrentEventUsedTickets),
// ]).then(() =>

// getTickets
// getTickets
// buyTicket
// buyTickets
// hasTicket
// balanceOf
// verifyEventParticipant
// balanceOf

export const parseTransactionLogs = (
  logs: Array<Log>,
  iface: Interface = chainIdToMainContractMapping[defaultChainId].interface
): LogDescription[] =>
  logs
    .map((log) => {
      try {
        return iface.parseLog(log);
      } catch (e) {}
    })
    .filter(Boolean) as LogDescription[];
