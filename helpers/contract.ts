import Moralis from "moralis/types"
import { useMoralisWeb3Api } from "react-moralis"

export const polygonChainlinkMaticUSDOracleABI = JSON.parse('[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "organizer", "type": "address" } ], "name": "EventCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" } ], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" } ], "name": "TransferBatch", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "URI", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "NATIVE_TOKEN_ID", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" } ], "name": "balanceOfBatch", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ticketTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "ticketsAmount", "type": "uint256" } ], "name": "buyTickets", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ticketSupply", "type": "uint256" }, { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "string", "name": "eventMetadataUri", "type": "string" }, { "internalType": "string", "name": "ticketsMetadataUri", "type": "string" } ], "name": "createEvent", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "defaultTicketFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "eventTokenId", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "events", "outputs": [ { "internalType": "address", "name": "organizer", "type": "address" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "ticketSupply", "type": "uint256" }, { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" } ], "name": "getRoleAdmin", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "harvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "hasRole", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "address", "name": "participantAddress", "type": "address" } ], "name": "mintSoulbound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "fee", "type": "uint256" } ], "name": "setDefaultTicketFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "newuri", "type": "string" } ], "name": "setURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "soulboundTokens", "outputs": [ { "internalType": "uint256", "name": "eventTokenId", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "uri", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "address", "name": "participantAddress", "type": "address" } ], "name": "verifyEventParticipant", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" } ]')
export const polygonMumbaiTickeroABI = JSON.parse('[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "organizer", "type": "address" } ], "name": "EventCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" } ], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" } ], "name": "TransferBatch", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "URI", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "NATIVE_TOKEN_ID", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" } ], "name": "balanceOfBatch", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ticketTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "ticketsAmount", "type": "uint256" } ], "name": "buyTickets", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ticketSupply", "type": "uint256" }, { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "string", "name": "eventMetadataUri", "type": "string" }, { "internalType": "string", "name": "ticketsMetadataUri", "type": "string" } ], "name": "createEvent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "defaultTicketFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "eventTokenId", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "events", "outputs": [ { "internalType": "address", "name": "organizer", "type": "address" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "ticketSupply", "type": "uint256" }, { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" } ], "name": "getRoleAdmin", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "harvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "hasRole", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "address", "name": "participantAddress", "type": "address" } ], "name": "mintSoulbound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "fee", "type": "uint256" } ], "name": "setDefaultTicketFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "newuri", "type": "string" } ], "name": "setURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "soulboundTokens", "outputs": [ { "internalType": "uint256", "name": "eventTokenId", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "uri", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "address", "name": "participantAddress", "type": "address" } ], "name": "verifyEventParticipant", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" } ]')
const IPFSRootFolder = 'tickero'
const TickeroContractAddress = '0x57a9B5B777D30bBBd0e7D110476b7F7D356Eb9B7'

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
            address: {mumbai: '0x57a9B5B777D30bBBd0e7D110476b7F7D356Eb9B7'},
            function_name: 'eventTokenId'
        },
        createEvent: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: {mumbai: '0x57a9B5B777D30bBBd0e7D110476b7F7D356Eb9B7'},
            function_name: 'createEvent'
        },
        getEvent: {
            abi: {mumbai: polygonMumbaiTickeroABI},
            address: {mumbai: '0x57a9B5B777D30bBBd0e7D110476b7F7D356Eb9B7'},
            function_name: 'createEvent'
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
        runContractFunction() {
            return runContractFunction(APIType, APIAdapter, service, action)
        },
        getMaticToUsdPrice() {
            return runContractFunction(APIType, APIAdapter, 'chainlink', 'MATIC/USD', {}, 'polygon')
        },
        auth() {
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.Auth)
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
            return callWeb3Provider(APIType, APIAdapter, Web3ProviderActions.getEvent, params)
        }
    }
}

export enum APITypes {
    Moralis
}

export enum Web3ProviderActions {
    Auth,
    IsAuthenticated,
    getEthAddress,
    uploadEventNFTFolder,
    uploadEventFiles,
    createEvent,
    getEvent
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
    params?: object
): any => ({
    [APITypes.Moralis]: {
        [Web3ProviderActions.Auth]: () => API.Moralis.authenticate(),
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
                    path: `${IPFSRootFolder}/${params.eventTokenId}/${file.name}`,
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
    }
})[APIType][action](params)

// read-only blockchain call
export const runContractFunction = (
    APIType: APITypes,
    API: any,
    service: string,
    action: string,
    calldata: object = {},
    chain = (process.env.NODE_ENV == 'production' ? process.env.MAINNET : process.env.TESTNET) as string
): Promise<string> =>
    ({
        [APITypes.Moralis]: (payload: typeof contractMap.service.action) => API.MoralisWeb3Api.native.runContractFunction({
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
        chain = (process.env.NODE_ENV == 'production' ? process.env.MAINNET : process.env.TESTNET) as string
    ): Promise<string> =>
        ({
            [APITypes.Moralis]: (payload: typeof contractMap.service.action) => API.Moralis.Moralis.executeFunction({
                contractAddress: payload.address[chain],
                functionName: payload.function_name,
                abi: payload.abi[chain],
                params: calldata
            })
        })[APIType](contractMap[service][action])
