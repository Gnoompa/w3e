import Moralis from "moralis/types"
import { useMoralisWeb3Api } from "react-moralis"

export const polygonChainlinkMaticUSDOracleABI = JSON.parse('[{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"},{"internalType":"address","name":"_accessController","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"updatedAt","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accessController","outputs":[{"internalType":"contract AccessControllerInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aggregator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"confirmAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"","type":"uint16"}],"name":"phaseAggregators","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phaseId","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"proposeAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"proposedAggregator","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"proposedGetRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposedLatestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_accessController","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]')
export const polygonMumbaiTickeroABI = JSON.parse('[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "organizer", "type": "address" } ], "name": "EventCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" } ], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" } ], "name": "TransferBatch", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "URI", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "NATIVE_TOKEN_ID", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" } ], "name": "balanceOfBatch", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "ticketsAmount", "type": "uint256" } ], "name": "buyTickets", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ticketSupply", "type": "uint256" }, { "internalType": "bool", "name": "isInfiniteTicketSupply", "type": "bool" }, { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" }, { "internalType": "bool", "name": "isSubscription", "type": "bool" }, { "internalType": "uint256", "name": "subscriptionDuration", "type": "uint256" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "string", "name": "eventMetadataUri", "type": "string" }, { "internalType": "string", "name": "ticketsMetadataUri", "type": "string" } ], "name": "createEvent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "defaultTicketFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "eventTokenId", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "events", "outputs": [ { "internalType": "address", "name": "organizer", "type": "address" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "ticketSupply", "type": "uint256" }, { "internalType": "bool", "name": "isInfiniteTicketSupply", "type": "bool" }, { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" }, { "internalType": "bool", "name": "isSubscription", "type": "bool" }, { "internalType": "uint256", "name": "subscriptionDuration", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" } ], "name": "getRoleAdmin", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" } ], "name": "getTicketUsdMaticPrice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "hasRole", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "address[]", "name": "participantAddresses", "type": "address[]" } ], "name": "mintSoulbound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "address", "name": "participant", "type": "address" } ], "name": "prolongSubscription", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "fee", "type": "uint256" } ], "name": "setDefaultTicketFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "newuri", "type": "string" } ], "name": "setURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "slippageRate", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "soulboundTokens", "outputs": [ { "internalType": "uint256", "name": "eventTokenId", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "subscriptions", "outputs": [ { "internalType": "uint256", "name": "eventTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "activatedAt", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "uri", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]')

const CHAIN = (process.env.NODE_ENV == 'production' ? process.env.TESTNET : process.env.TESTNET) as string
const IPFS_ROOT_FOLDER = 'tickero'
const TICKERO_CONTRACT_ADDRESS = {
    mumbai: '0xBA2c12a27cC8d7D1c4aeA6cca4BB62271D196E26'
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
        buyTicket: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
            function_name: 'buyTickets'
        },
        hasTicket: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: TICKERO_CONTRACT_ADDRESS,
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
        uploadEventNFTFolder(params: {files: Array<any>, eventTokenId: number}) {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.uploadEventNFTFolder, params)
        },
        uploadEventFiles(params: {files: Array<any>}) {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.uploadEventFiles, params)
        },
        createEvent(params: {calldata: object}) {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.createEvent, params)
        },
        getEvent(params: {eventTokenId: number}) {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getEvent, {'': params.eventTokenId})
        },
        getTokenIdMetadata(tokenId: number): Promise<string> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getTokenIdMetadata, tokenId)
        },
        buyTicket(params: object, msgValue: string): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.buyTicket, params, msgValue)
        },
        hasTicket(params: {eventTokenId: number, address: string}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.hasTicket, params)
        },
        soulboundParticipants(params: {eventTokenId: number, addresses: Array<string>}): Promise<any> {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.soulboundParticipants, params)
        },
        verifyEventParticipant(params: {eventTokenId: number, participantAddress: string}): Promise<any> {
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
        [Web3ProviderActions.Auth]: () => console.log(12) || API.Moralis.authenticate(),
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
                address: TICKERO_CONTRACT_ADDRESS[CHAIN],
                token_id: params,
                chain: CHAIN
            }),
        [Web3ProviderActions.buyTicket]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['buyTicket']>[0], msgValue: string) => {
            console.log(API.Moralis.Moralis.web3Library)
            return executeFunction(APIType, API, 'tickero', 'buyTicket', params, msgValue)
        },
        [Web3ProviderActions.hasTicket]: (params: Parameters<ReturnType<typeof useWeb3APIProvider>['hasTicket']>[0]) =>
            runContractFunction(APIType, API, 'tickero', 'hasTicket', {id: +params.eventTokenId + 1, account: params.address})
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
