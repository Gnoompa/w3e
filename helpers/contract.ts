import Moralis from "moralis/types"
import { useMoralisWeb3Api } from "react-moralis"
import { ethers } from "ethers"

export const polygonChainlinkMaticUSDOracleABI = JSON.parse('[{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"},{"internalType":"address","name":"_accessController","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"updatedAt","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accessController","outputs":[{"internalType":"contract AccessControllerInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aggregator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"confirmAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"","type":"uint16"}],"name":"phaseAggregators","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phaseId","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"proposeAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"proposedAggregator","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"proposedGetRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposedLatestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_accessController","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]')
export const polygonMumbaiTickeroABI = JSON.parse('[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "organizer", "type": "address" } ], "name": "EventCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" } ], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "eventTokenId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" } ], "name": "TicketBought", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "eventTokenId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "TicketUsed", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "uint256", "name": "eventTokenId", "type": "uint256" } ], "name": "TicketsCreated", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IS_INFINITE_SUPPLY", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IS_SUBSCRIPTION", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ticketId", "type": "uint256" }, { "internalType": "address", "name": "_for", "type": "address" } ], "name": "buyTickets", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "eventTokenId", "type": "uint256" }, { "internalType": "uint256[]", "name": "ticketIds", "type": "uint256[]" }, { "internalType": "address[]", "name": "owners", "type": "address[]" } ], "name": "commitVerifiedTickets", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "components": [ { "internalType": "uint256[]", "name": "ticketSupply", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "ticketPrice", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "subscriptionDuration", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "params", "type": "uint256[]" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "address[]", "name": "managers", "type": "address[]" }, { "internalType": "string", "name": "eventMetadataUri", "type": "string" }, { "internalType": "string[]", "name": "ticketMetadataUri", "type": "string[]" } ], "internalType": "struct Main.EventCreationPayload", "name": "payload", "type": "tuple" } ], "name": "createEvent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "events", "outputs": [ { "internalType": "address", "name": "organizer", "type": "address" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "eventId", "type": "uint256" } ], "name": "getEventManagers", "outputs": [ { "internalType": "address[]", "name": "", "type": "address[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256[]", "name": "eventIds", "type": "uint256[]" } ], "name": "getEvents", "outputs": [ { "components": [ { "internalType": "address", "name": "organizer", "type": "address" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "address[]", "name": "managers", "type": "address[]" }, { "internalType": "uint256[]", "name": "ticketIds", "type": "uint256[]" } ], "internalType": "struct Main.Event[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" } ], "name": "getRoleAdmin", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ticketId", "type": "uint256" } ], "name": "getTicketUsdMaticPrice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256[]", "name": "ticketIds", "type": "uint256[]" } ], "name": "getTickets", "outputs": [ { "components": [ { "internalType": "uint256", "name": "eventTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "ticketType", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "supply", "type": "uint256" }, { "internalType": "uint256", "name": "isInfiniteSupply", "type": "uint256" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bool", "name": "used", "type": "bool" }, { "internalType": "uint256", "name": "activatedAt", "type": "uint256" }, { "internalType": "uint256", "name": "tier", "type": "uint256" } ], "internalType": "struct Main.Ticket[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "hasRole", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ticketId", "type": "uint256" } ], "name": "prolongSubscription", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenContractAddress", "type": "address" } ], "name": "setTokenContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "tickets", "outputs": [ { "internalType": "uint256", "name": "eventTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "ticketType", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "uint256", "name": "supply", "type": "uint256" }, { "internalType": "uint256", "name": "isInfiniteSupply", "type": "uint256" }, { "internalType": "uint256", "name": "duration", "type": "uint256" }, { "internalType": "bool", "name": "used", "type": "bool" }, { "internalType": "uint256", "name": "activatedAt", "type": "uint256" }, { "internalType": "uint256", "name": "tier", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]')
export const polygonMumbaiTokenContractABI = JSON.parse('[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" } ], "name": "TransferBatch", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "URI", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "_owner", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address[]", "name": "_owners", "type": "address[]" }, { "internalType": "uint256[]", "name": "_ids", "type": "uint256[]" } ], "name": "balanceOfBatch", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bool", "name": "_isNF", "type": "bool" }, { "internalType": "bool", "name": "_isAB", "type": "bool" } ], "name": "create", "outputs": [ { "internalType": "uint256", "name": "_type", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "creators", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "getNonFungibleBaseType", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "getNonFungibleIndex", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "isAccountBound", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "isFungible", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "isNonFungible", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "isNonFungibleBaseType", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "isNonFungibleItem", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "maxIndex", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "address[]", "name": "_to", "type": "address[]" }, { "internalType": "uint256[]", "name": "_quantities", "type": "uint256[]" } ], "name": "mintFungible", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_type", "type": "uint256" }, { "internalType": "address[]", "name": "_to", "type": "address[]" } ], "name": "mintNonFungible", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "ownerOf", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256[]", "name": "_ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "_values", "type": "uint256[]" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }, { "internalType": "address", "name": "msgSender", "type": "address" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_mainContractAddress", "type": "address" } ], "name": "setMainContractAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "string", "name": "tokenURI", "type": "string" } ], "name": "setURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "uri", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]');

const mainContractInterface = new ethers.utils.Interface(polygonMumbaiTickeroABI)

export const CHAIN = (process.env.NODE_ENV == 'production' ? process.env.TESTNET : process.env.TESTNET) as string
const IPFS_ROOT_FOLDER = 'tickero'

export const TOKEN_CONTRACT_ADDRESS = {
    mumbai: '0x5F21Be0D686D0633876Bb8320134519Ca28Cd1f3'
}
export const TICKERO_CONTRACT_ADDRESS = {
    mumbai: '0x70Ed3Cf756dBbaB9aEB7bbfB7Bd52E9a1ed37fCe'
}

export const contractMap = {
    chainlink: {
        'MATIC/USD': {
            abi: {polygon: polygonChainlinkMaticUSDOracleABI},
            address: {polygon: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0'},
            function_name: 'latestAnswer'
        }
    },
    tickero: {
        eventTokenId: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
            function_name: 'eventTokenId'
        },
        createEvent: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
            function_name: 'createEvent'
        },
        getEvent: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
            function_name: 'events'
        },
        getEventManagers: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
            function_name: 'getEventManagers'
        },
        getTickets: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
            function_name: 'getTickets'
        },
        buyTicket: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
            function_name: 'buyTickets'
        },
        hasTicket: {
            abi: {mumbai: polygonMumbaiTokenContractABI},
            address: TOKEN_CONTRACT_ADDRESS,
            function_name: 'balanceOf'
        },
        verifyEventParticipant: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
            function_name: 'balanceOf'
        },
        soulboundParticipants: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
            function_name: 'mintSoulbound'
        }
    }
} as {
    [service: string]: {
        [action: string]: {
            abi: {[chain: string]: string},
            address: {[chain: string]: string},
            function_name: string
        }
    }
}

export const useWeb3APIProvider = (APIType: APITypes, APIAdapter: any, service: string = '', action: string = '') => {
    return {
        getAPIAdapter() {
            return APIAdapter
        },
        runContractFunction(params = {}) {
            return runContractFunction(APIType, APIAdapter, service, action, params)
        },
        getMaticToUsdPrice() {
            return runContractFunction(APIType, APIAdapter, 'chainlink', 'MATIC/USD', {}, 'polygon')
        },
        auth() {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.Auth)
        },
        unauth() {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.Unauth)
        },
        isAuthenticated() {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.IsAuthenticated)
        },
        getEthAddress(params = {}) {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getEthAddress, params)
        },
        uploadEventNFTFolder(params: {files: Array<any>, eventTokenId: string}) {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.uploadEventNFTFolder, params)
        },
        uploadEventFiles(params: {files: Array<any>}) {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.uploadEventFiles, params)
        },
        createEvent(params: {calldata: object}) {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.createEvent, params)
        },
        getEvent(params: {eventTokenId: string}) {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getEvent, {'': params.eventTokenId})
        },
        getTokenIdMetadata(tokenId: string): Promise<string> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getTokenIdMetadata, tokenId)
        },
        buyTicket(params: object, msgValue: string): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.buyTicket, params, msgValue)
        },
        hasTicket(params: {eventTokenId: string, address: string}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.hasTicket, params)
        },
        getTicketsData(params: {eventTokenId: string}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getTicketData, params)
        },
        getBoughtTickets(params: {eventId?: string, buyerAddress?: string}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getBoughtTickets, params)
        },
        getUsedTickets(params: {eventId?: string, buyerAddress?: string}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getUsedTickets, params)
        },
        spendTickets(params: {eventId: string, ticketsToSpend: Array<{ticketId: string, address: string}>}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.spendTickets, params)
        },
        getEventManagers(params: {eventId: string}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getEventManagers, params)
        },
        soulboundParticipants(params: {eventTokenId: string, addresses: Array<string>}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.soulboundParticipants, params)
        },
        verifyEventParticipant(params: {eventTokenId: string, participantAddress: string}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.verifyEventParticipant, params)
        }
    }
}

export enum APITypes {
    Moralis
}

export enum Web3ProviderActions {
    Auth,
    Unauth,
    IsAuthenticated,
    getEthAddress,
    uploadEventNFTFolder,
    uploadEventFiles,
    createEvent,
    getEvent,
    getTokenIdMetadata,
    buyTicket,
    hasTicket,
    getTicketData,
    getBoughtTickets,
    getUsedTickets,
    spendTickets,
    getEventManagers,
    verifyEventParticipant,
    soulboundParticipants
}

export interface ContractFunctionOptions {
    service: string;
    chain: string;
    action: string;
}

export const callWeb3Provider = (
    APIType: APITypes,
    API: any,
    action: Web3ProviderActions,
    params?: any,
    msgValue: string|undefined = undefined
): any => ({
    [APITypes.Moralis]: {
        [Web3ProviderActions.Auth]: () => API.Moralis.authenticate(),
        [Web3ProviderActions.Unauth]: () => API.Moralis.logout(),
        [Web3ProviderActions.IsAuthenticated]: () => API.Moralis.isAuthenticated,
        [Web3ProviderActions.getEthAddress]: (params: {short: boolean}) => {
            let address = API.Moralis.user?.get('ethAddress')

            return address
                ? params.short
                    ? `${address.slice(0, 5)}...${address.slice(-3)}`
                    : address
                : ''
        },
        [Web3ProviderActions.uploadEventNFTFolder]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['uploadEventNFTFolder']>[0]) =>
            API.storage.uploadFolder({abi:
                params.files.map(file => ({
                    path: `${IPFS_ROOT_FOLDER}/${params.eventTokenId}/${file.name}`,
                    content: file.text
                }))
            }),
        [Web3ProviderActions.uploadEventFiles]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['uploadEventFiles']>[0]) => {
            return new Promise((res, rej) =>
                (new (API.Moralis.Moralis as Moralis)
                    .File(params.files[0].name, params.files[0]))
                    .saveIPFS()
                    .then(response => res(response._ipfs))
                    .catch(rej)
            )
            // API.storage.uploadFolder({abi:
            //     params.files.map(file => ({
            //         path: `${IPFSRootFolder}/${params.eventTokenId}/${file.name}`,
            //         content: file.text
            //     }))
            // })
        },
        [Web3ProviderActions.createEvent]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['createEvent']>[0]) =>
            executeFunction(APIType, API, 'tickero', 'createEvent', params!.calldata)
        ,
        [Web3ProviderActions.getEvent]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['getEvent']>[0]) =>
            runContractFunction(APIType, API, 'tickero', 'getEvent', params)
        ,
        [Web3ProviderActions.getTokenIdMetadata]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['getTokenIdMetadata']>[0]) =>
            API.MoralisWeb3Api.token.getTokenIdMetadata({
                address: TOKEN_CONTRACT_ADDRESS[CHAIN],
                token_id: params,
                chain: CHAIN
            }),
        [Web3ProviderActions.buyTicket]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['buyTicket']>[0], msgValue: string) => {
            return executeFunction(APIType, API, 'tickero', 'buyTicket', params, msgValue)
        },
        [Web3ProviderActions.getTicketData]: async (params: Parameters<ReturnType<typeof useWeb3APIProvider>['getTicketsData']>[0]) => {
            const ticketCreationEvents = await API.MoralisWeb3Api.native.getLogsByAddress({
                address: TICKERO_CONTRACT_ADDRESS[CHAIN],
                chain: CHAIN,
                topic0: mainContractInterface.getEventTopic("TicketsCreated"),
                topic2: '0x' + BigInt(params.eventTokenId).toString(16)
            })

            return new ethers.Contract(TICKERO_CONTRACT_ADDRESS[CHAIN], polygonMumbaiTickeroABI, API.Moralis.Moralis.internalWeb3Provider.signer)
                .getTickets(ticketCreationEvents.result.map(result => result.topic1))
                .then(result => result.map((ticket, i) => ({...ticket, tokenId: ticketCreationEvents.result[i].topic1 })))
        },
        [Web3ProviderActions.getBoughtTickets]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['getBoughtTickets']>[0]) => {
            const contract = new ethers.Contract(TICKERO_CONTRACT_ADDRESS[CHAIN], polygonMumbaiTickeroABI, API.Moralis.Moralis.internalWeb3Provider?.signer)

            return contract.queryFilter(contract.filters.TicketBought(params.eventId ? '0x' + BigInt(params.eventId).toString(16) : null))
                .then(result => result.map(item => item.args))

        },
        [Web3ProviderActions.getUsedTickets]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['getUsedTickets']>[0]) => {
            const contract = new ethers.Contract(TICKERO_CONTRACT_ADDRESS[CHAIN], polygonMumbaiTickeroABI, API.Moralis.Moralis.internalWeb3Provider?.signer)

            return contract.queryFilter(contract.filters.TicketUsed(null, params.eventId ? '0x' + BigInt(params.eventId).toString(16) : null))
                .then(result => result.map(item => item.args))

        },
        [Web3ProviderActions.spendTickets]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['spendTickets']>[0]) => {
            const contract = new ethers.Contract(TICKERO_CONTRACT_ADDRESS[CHAIN], polygonMumbaiTickeroABI, API.Moralis.Moralis.internalWeb3Provider?.signer)

            return contract.commitVerifiedTickets(
                params.eventId,
                params.ticketsToSpend.map(ticketToSpend => ticketToSpend.ticketId),
                params.ticketsToSpend.map(ticketToSpend => ticketToSpend.address)
            )
        },
        [Web3ProviderActions.getEventManagers]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['getEventManagers']>[0]) =>
            runContractFunction(APIType, API, 'tickero', 'getEventManagers', params)
        ,
        [Web3ProviderActions.hasTicket]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['hasTicket']>[0]) =>
            runContractFunction(APIType, API, 'tickero', 'hasTicket', {_id: +params.tokenId, _owner: params.address})
        ,
        [Web3ProviderActions.verifyEventParticipant]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['verifyEventParticipant']>[0]) =>
            runContractFunction(APIType, API, 'tickero', 'verifyEventParticipant', {id: +params.eventTokenId + 3, account: params.participantAddress})
        ,
        [Web3ProviderActions.soulboundParticipants]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['soulboundParticipants']>[0]) =>
            executeFunction(APIType, API, 'tickero', 'soulboundParticipants', {_eventTokenId: +params.eventTokenId, participantAddresses: params.addresses})
        ,
    }
})[APIType][action](params, msgValue)

// read-only blockchain call
export const runContractFunction = (
    APIType: APITypes,
    API: any,
    service: string,
    action: string,
    calldata: any,
    chain = CHAIN
): Promise<string> =>
    ({
        [APITypes.Moralis]: (payload: typeof contractMap.service.action) => (API.MoralisWeb3Api as ReturnType<typeof useMoralisWeb3Api>).native.runContractFunction({
            chain: chain,
            address: payload.address[chain],
            function_name: payload.function_name,
            abi: payload.abi[chain],
            params: calldata
        })
    })[APIType](contractMap[service][action])

export const executeFunction = (
        APIType: APITypes,
        API: any,
        service: string,
        action: string,
        calldata: object = {},
        msgValue: string|undefined = undefined,
        chain = (process.env.NODE_ENV == 'production' ? process.env.MAINNET : process.env.TESTNET) as string
    ): Promise<string> =>
        ({
            [APITypes.Moralis]: (payload: typeof contractMap.service.action) => API.Moralis.Moralis.executeFunction({
                contractAddress: payload.address[chain],
                functionName: payload.function_name,
                abi: payload.abi[chain],
                params: calldata,
                msgValue
            })
        })[APIType](contractMap[service][action])
