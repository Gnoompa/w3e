import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useContext,
  ReactElement,
} from "react";
import QRCode from "qrcode.react";
import {
  Flex,
  Box,
  Image,
  Button,
  Label,
  Input,
  Text,
  Container,
  Textarea,
  Switch,
  Spinner,
  SxProp,
  ThemeUIStyleObject,
  Link,
} from "theme-ui";
import { getIPFSUri, useRouterQuery } from "helpers/hooks";
import dynamic from "next/dynamic";
import { Portal } from "react-portal";
import { useRouter } from "next/router";
import { formatWalletAddress } from "helpers/hooks";
import { BigNumber, ethers } from "ethers";
import { useAccount, useProvider } from "wagmi";
import {
  buyEventTicket,
  getEventManagers,
  getEvents,
  getEventTickets,
  getNativeCurrencyToUsdPrice,
  getTokenMetadataUris,
  prepareBuyEventTicket,
  useMainContractEvents,
  useTokenMetadataFetch,
} from "helpers/contract";

const QrScanner = dynamic(() => import("./ui/qrScanner"), {
  ssr: false,
});

const EventPage = () => {
  enum Stage {
    LoadingEvent,
    EventLoaded,
    VerifyingParticipants,
  }

  const provider = useProvider();
  const router = useRouter();
  const routerQuery = useRouterQuery(router);
  const { address: connectedWalletAddress } = useAccount();
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.LoadingEvent);
  const [eventTokenId, setEventTokenId] = useState<string>();
  const [event, setEvent] = useState<OnchainEvent>();
  const [isVerifyingEventParticipants, setIsVerifyingEventParticipants] =
    useState(false);
  const [isVerifyingEventParticipant, setIsVerifyingEventParticipant] =
    useState(false);
  const [ticketQrScanResult, setTicketQrScanResult] = useState<string>();
  const [verificationResult, setVerificationResult] = useState("");
  const [isShowingTicketQr, setIsShowingTicketQr] = useState(false);
  const [ticketQr, setTicketQr] = useState("");
  const [isSoulbounding, setIsSoulbounding] = useState(false);
  const [isSoulboundingInProcess, setIsSoulboundingInProcess] = useState(false);
  const [scannedTickets, setScannedTickets] = useState<Array<object>>([]);
  const [scannedWalletQRsToSoulbound, setScannedWalletQRsToSoulbound] =
    useState<Array<string>>([]);
  const [currentEventTickets, setCurrentEventTickets] =
    useState<Array<object>>();
  const [currentEventSoldTickets, setCurrentEventSoldTickets] =
    useState<Array<object>>();
  const [currentEventUsedTickets, setCurrentEventUsedTickets] =
    useState<Array<object>>();
  const [isBuyingATicket, setIsBuyingATicket] = useState(false);
  const [isCommitingScannedTickets, setIsCommitingScannedTickets] =
    useState(false);
  const [hasTicketsBeenSpentSuccessfully, setHasTicketsBeenSpentSuccessfully] =
    useState<Boolean>();

  const eventId = routerQuery.id;

  const { data: eventMetadataUri } = getTokenMetadataUris([
    {
      args: [[eventId]],
    },
  ]);

  const { data: eventMetadata } = useTokenMetadataFetch({
    did: eventMetadataUri?.[0][0],
  }) as { data: EventMetadata | undefined };

  const { data: events } = getEvents([{ args: [eventId] }]);

  const { data: eventManagers } = getEventManagers([{ args: [eventId] }]);

  const { data: eventTickets } = getEventTickets([{ args: [[eventId]] }]);

  const [
    buyEventTicketWritePayloadToPrepare,
    setCreateEventWritePayloadToPrepare,
  ] = useState<{
    args: Parameters<typeof prepareBuyEventTicket>[0]["args"];
    overrides: Parameters<typeof prepareBuyEventTicket>[0]["overrides"];
  }>();

  // // todo handle write request errors
  const {
    config: preparedBuyEventTicketWriteConfig,
    refetch: refetchPreparedBuyEventTicketWriteConfig,
  } = prepareBuyEventTicket({
    ...buyEventTicketWritePayloadToPrepare,
    enabled: false,
  });

  // // todo handle transaction signing rejection
  const { data: buyEventTicketResponse, write: buyEventTicketWrite } =
    buyEventTicket(preparedBuyEventTicketWriteConfig);

  const { data: eventTicketsCreatedEvents } = useMainContractEvents({
    eventName: "TicketsCreated",
    filters: [routerQuery.id],
    provider,
  });

  const { data: eventTicketBoughtEvents } = useMainContractEvents({
    eventName: "TicketBought",
    filters: [eventId],
    provider,
  });

  const { data: eventTicketUsedEvents } = useMainContractEvents({
    eventName: "TicketUsed",
    provider,
  });

  const {
    data: nativeCurrencyToUsdPrice,
    refetch: refetchNativeCurrencyToUsdPrice,
  } = getNativeCurrencyToUsdPrice();

  const currentUserTickets = eventTicketBoughtEvents?.[0]
    ?.filter((event) => event.args?.buyer == connectedWalletAddress)
    .map((connectedWalletTicket) =>
      currentEventTickets?.filter(
        (ticket) => connectedWalletTicket.args?.tokenId == ticket.tokenId
      )
    );
  const isEventOrganizer =
    event?.organizer?.toLowerCase() == connectedWalletAddress?.toLowerCase();

  const canShowTicketQr = !!currentUserTickets?.length;
  const ticketQrSigningMessage =
    "Prove that you own the ticket by signing. IT IS FREE.";

  const isEventManager =
    connectedWalletAddress &&
    eventManagers &&
    eventManagers[0].includes(connectedWalletAddress);
  const canBuyTicket =
    !currentUserTickets?.length && !isEventManager && !isEventOrganizer;
  const canVerifyTickets = isEventManager || isEventOrganizer;

  useEffect(() => {
    eventId ? initEvent(eventId) : router.push("/app");
  }, []);

  useEffect(() => {
    eventMetadata && setCurrentStage(Stage.EventLoaded);
  }, [eventMetadata]);

  useEffect(() => {
    events && setEvent(events[0]);
  }, [events]);

  // todo use recently created event data if exists
  const initEvent = async (eventTokenId: string) => {
    setEventTokenId(eventTokenId);
  };

  // useEffect(() => {
  //   ticketQrScanResult && verifyTicket(ticketQrScanResult);
  // }, [ticketQrScanResult]);

  // metadata is not instantly indexed by the IPFS nodes hence trying to fetch it until success
  const fetchMetadataWrapper = (request: Function): Promise<any> =>
    new Promise((res) =>
      request()
        .then(res)
        .catch(() => setTimeout(() => fetchMetadataWrapper(request), 500))
    );

  const buyTicket = async () => {
    setIsBuyingATicket(true);

    // const response = await web3APIProvider
    //   .buyTicket(
    //     {
    //       // ticketId: ticketData., address _for
    //       ticketId: currentEventTickets[0].tokenId,
    //       _for: connectedWalletAddress,
    //     },
    //     BigNumber.from(nativeCurrencyToUsdPrice[0].answer)
    //       .mul(currentEventTickets[0].price / 10 ** 8)
    //       .toString()
    //   )
    //   .catch(console.log);

    // response
    //   .wait()
    //   .catch(() => alert("Couldn't buy a ticket"))
    //   .then(() => setCurrentUserTickets([currentEventTickets[0]]))
    //   .finally(() => setIsBuyingATicket(false));

    // console.log(maticToUsdPrice, ethers.BigNumber.from(maticToUsdPrice).mul(+event!.ticketPrice / 10**8).toString());

    // const contract = new ethers.Contract(
    //     '0xc6D8A34F714E129d19C39edD2D5Af7edceCb9Fcc',
    //     '[ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "organizer", "type": "address" } ], "name": "EventCreated", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" } ], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" } ], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" } ], "name": "TransferBatch", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "URI", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "NATIVE_TOKEN_ID", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" } ], "name": "balanceOfBatch", "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "ticketsAmount", "type": "uint256" } ], "name": "buyTickets", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "ticketSupply", "type": "uint256" }, { "internalType": "bool", "name": "isInfiniteTicketSupply", "type": "bool" }, { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" }, { "internalType": "bool", "name": "isSubscription", "type": "bool" }, { "internalType": "uint256", "name": "subscriptionDuration", "type": "uint256" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "string", "name": "eventMetadataUri", "type": "string" }, { "internalType": "string", "name": "ticketsMetadataUri", "type": "string" } ], "name": "createEvent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "defaultTicketFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "eventTokenId", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "events", "outputs": [ { "internalType": "address", "name": "organizer", "type": "address" }, { "internalType": "address payable", "name": "beneficiary", "type": "address" }, { "internalType": "uint256", "name": "ticketSupply", "type": "uint256" }, { "internalType": "bool", "name": "isInfiniteTicketSupply", "type": "bool" }, { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" }, { "internalType": "bool", "name": "isSubscription", "type": "bool" }, { "internalType": "uint256", "name": "subscriptionDuration", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" } ], "name": "getRoleAdmin", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" } ], "name": "getTicketUsdMaticPrice", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "hasRole", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" } ], "name": "isApprovedForAll", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "address[]", "name": "participantAddresses", "type": "address[]" } ], "name": "mintSoulbound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_eventTokenId", "type": "uint256" }, { "internalType": "address", "name": "participant", "type": "address" } ], "name": "prolongSubscription", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" } ], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" } ], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "fee", "type": "uint256" } ], "name": "setDefaultTicketFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "newuri", "type": "string" } ], "name": "setURI", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "slippageRate", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "soulboundTokens", "outputs": [ { "internalType": "uint256", "name": "eventTokenId", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "subscriptions", "outputs": [ { "internalType": "uint256", "name": "eventTokenId", "type": "uint256" }, { "internalType": "uint256", "name": "activatedAt", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" } ], "name": "supportsInterface", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ], "name": "uri", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]',
    //     web3APIProvider.getAPIAdapter().Moralis.Moralis.web3?.getSigner()
    // );

    // const es = await contract.estimateGas.buyTickets(+eventTokenId, 1, {value: ethers.BigNumber.from(maticToUsdPrice).mul(+event!.ticketPrice / 10**8)});
    // // const az  = await contract.buyTickets(+eventTokenId, 1, {value: ethers.BigNumber.from(maticToUsdPrice).mul(+event!.ticketPrice / 10**8)})

    // console.log(maticToUsdPrice, es, (web3APIProvider.getAPIAdapter().Moralis.Moralis as Moralis).web3?.getSigner())

    // // console.log(response, receipt)
  };

  const startVerification = () => {
    setIsVerifyingEventParticipants(true);
  };

  const onTicketQrScanned = (scannedTicketData: string) => {
    setTicketQrScanResult(scannedTicketData);
  };

  const showTicketQr = (ticketId: string): void => {
    setIsShowingTicketQr(true);

    // const domain = {
    //     name: 'Tickero Ticketing Platform',
    //     version: '1',
    //     chainId: web3APIProvider.getAPIAdapter().Moralis.Moralis.internalWeb3Provider.chainId,
    //     verifyingContract: TICKERO_CONTRACT_ADDRESS[CHAIN]
    // };

    // // The named list of all type definitions
    // const types = {
    //     Data: [
    //         { name: 'name', type: 'string' },
    //         { name: 'wallet', type: 'address' }
    //     ],
    //     Mail: [
    //         { name: 'from', type: 'Person' },
    //         { name: 'to', type: 'Person' },
    //         { name: 'contents', type: 'string' }
    //     ]
    // };

    // // The data to sign
    // const value = {
    //     name: 'Cow',
    //     wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    //     contents: 'Hello, Bob!'
    // };

    // web3APIProvider.getAPIAdapter().Moralis.Moralis.internalWeb3Provider.signer._signTypedData(domain, types, value).then(r => {
    //     console.log('message: ' + r);
    //     console.log(ethers.utils.verifyTypedData(domain, types, value, r))
    // });
    // => console.log(ethers.utils.verifyMessage(message, r))

    // const message = ethers.utils.solidityKeccak256(['string'], ["Prove that you own the ticket by signing. IT IS FREE."])

    // console.log(ethers.utils.verifyMessage(message, '0xe136e6faee59c8f8100f690fd6c428bfcf05ca21569e9a1c45f9adf8918e59374169b91513cb2187d2219ef03765e12c44c7439ca698c5422855ec768216dfa21c'))

    // web3APIProvider
    //   .getAPIAdapter()
    //   .Moralis.Moralis.internalWeb3Provider.signer.signMessage(
    //     ticketQrSigningMessage
    //   )
    //   .then((message) =>
    //     setTicketQr(
    //       new Buffer(JSON.stringify({ ticketId, message })).toString("base64")
    //     )
    //   );
  };

  // const verifyTicket = (ticketSignedVerificationMessage: string): void => {
  //   const { ticketId, message } = JSON.parse(
  //     Buffer.from(ticketSignedVerificationMessage, "base64").toString()
  //   );
  //   const address =
  //     message && ethers.utils.verifyMessage(ticketQrSigningMessage, message);

  //   address &&
  //   ticketId &&
  //   message &&
  //   currentEventSoldTickets?.filter((ticket) => ticket.buyer == address).length
  //     ? (setScannedTickets([...scannedTickets, { ticketId, address }]),
  //       setVerificationResult("😊 verified 😊"))
  //     : setVerificationResult("🚷 not verified 🚷");
  // };

  const commitScannedTickets = () => {
    setIsCommitingScannedTickets(true);

    // web3APIProvider
    //   .spendTickets(scannedTickets)
    //   .then(
    //     () => (setScannedTickets([]), setHasTicketsBeenSpentSuccessfully(true))
    //   )
    //   .catch(
    //     (e) => (
    //       alert("Smth went wrong"),
    //       console.error(e),
    //       setHasTicketsBeenSpentSuccessfully(false)
    //     )
    //   )
    //   .finally(
    //     () => (
    //       setIsCommitingScannedTickets(false),
    //       setTimeout(() => setHasTicketsBeenSpentSuccessfully(undefined), 3000)
    //     )
    //   );
  };

  return (
    <Flex
      sx={{
        flexDirection: "column",
      }}
    >
      <Flex sx={{ alignItems: "center", justifyContent: "flex-end" }}>
        {/* <NavigateBack href='/app'>
                    to main menu
                </NavigateBack> */}
        <Button
          variant="accentSmall"
          onClick={() =>
            navigator.share({ title: eventMetadata?.name, url: location.href })
          }
        >
          <Flex sx={{ alignItems: "center" }}>
            {/* <NextImage src={shareIcon} width='30px' height='30px' alt='share'/> */}
            <Box ml=".5rem">share</Box>
          </Flex>
        </Button>
      </Flex>
      {{
        [Stage.LoadingEvent]: () => (
          <Spinner
            sx={{ margin: "31rem auto", transform: "translateY(-50%)" }}
          />
        ),
        [Stage.VerifyingParticipants]: () => (
          <Spinner
            sx={{ margin: "31rem auto", transform: "translateY(-50%)" }}
          />
        ),
        [Stage.EventLoaded]: () => (
          <>
            <Text mt=".75em" as="h1">
              {eventMetadata?.name}
            </Text>
            <Text mt=".75em" as="h1">
              {eventMetadata?.description}
            </Text>
            <Flex mt="3rem" sx={{ flexDirection: "column" }}>
              {eventMetadata?.image && (
                <Image src={getIPFSUri(eventMetadata?.image)} />
              )}
              {eventMetadata?.description && (
                <Text variant="secondary">{eventMetadata.description}</Text>
              )}
              <Text
                mt="2rem"
                variant="dialogSecondary"
                sx={{ fontSize: "1.5rem", alignSelf: "center" }}
              >
                {/* {isEventOrganizer
                  ? "you are an organizer"
                  : (event?.isSubscription ? "subscribe for " : "ticket for ") +
                    ethers.utils.formatUnits(
                      currentEventTickets[0].price,
                      "ether"
                    ) +
                    " $"} */}
              </Text>
              <Flex
                mt="2rem"
                sx={{
                  flexDirection: "column",
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                {/* {canBuyTicket && (
                  <Flex sx={{ alignItems: "center" }}>
                    <Button
                      variant="accent"
                      onClick={buyTicket}
                      disabled={isBuyingATicket}
                    >
                      <Flex
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-around",
                          gap: "1rem",
                        }}
                      >
                        <Box
                          sx={{
                            width: "3rem",
                            height: "2rem",
                            position: "relative",
                          }}
                        >
                        </Box>
                        {event?.isSubscription ? "subscribe" : "buy a ticket"}
                      </Flex>
                    </Button>
                    {isBuyingATicket && (
                      <Spinner
                        size={30}
                        sx={{ position: "absolute", right: "2rem" }}
                      />
                    )}
                  </Flex>
                )} */}
                {/* {!!currentUserTickets?.length && (
                  <Text mt="1rem" mb="1rem" as="h3" variant="infoContent">
                    🔥 participating 🔥
                  </Text>
                )} */}
                {/* {canShowTicketQr && (
                  <Flex sx={{ alignItems: "center" }}>
                    <Button
                      variant="accent"
                      onClick={() =>
                        showTicketQr(currentEventTickets[0].tokenId)
                      }
                    >
                      Show ticket QR
                    </Button>
                  </Flex>
                )} */}
                {/* {canVerifyTickets && (
                  <Button variant="accent" onClick={startVerification}>
                    <Flex
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-around",
                        gap: "1rem",
                      }}
                    >
                      <Box sx={{ width: "3rem", height: "2rem" }}>
                      </Box>
                      scan tickets
                    </Flex>
                  </Button>
                )} */}
                {/* {canGrantSoulbound &&
                                <Button variant='accent' onClick={() => setIsSoulbounding(true)}>
                                    <Flex sx={{alignItems: 'center', justifyContent: 'space-around', gap: '1rem'}}>
                                        <Box sx={{width: '3rem', height: '2rem', position: 'relative'}}>
                                            <NextImage src={buyTicketImage} alt="buy a ticket" width='30px' height='30px' objectFit='contain' />
                                        </Box>
                                        <Text>grant POA</Text>

                                    </Flex>
                                </Button>
                            } */}
              </Flex>
            </Flex>
            {isShowingTicketQr && (
              <Portal>
                <Container variant="layout.container.modalBackground">
                  <Flex
                    p="2rem 1rem"
                    sx={{
                      maxHeight: "100%",
                      flexDirection: "column",
                      alignItems: "center",
                      margin: "max(50vh, 10rem) auto",
                      transform: "translateY(-50%)",
                      overflow: "scroll",
                      maxWidth: "25rem",
                    }}
                  >
                    <Flex
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Text as="h2">Ticket QR</Text>
                      {/* <NextImage src={crossIcon} alt='back' width='30px' height='30px' onClick={() => setIsShowingTicketQr(false)}/> */}
                    </Flex>
                    <Flex
                      mt="2rem"
                      sx={{ justifyContent: "center", width: "100%" }}
                    >
                      {ticketQr && (
                        <QRCode renderAs="canvas" size={300} value={ticketQr} />
                      )}
                    </Flex>
                  </Flex>
                </Container>
              </Portal>
            )}
            {isVerifyingEventParticipants && (
              <Portal>
                <Container variant="layout.container.modalBackground">
                  <Flex
                    p="2rem 1rem"
                    sx={{
                      maxHeight: "100%",
                      flexDirection: "column",
                      alignItems: "center",
                      margin: "max(50vh, 10rem) auto",
                      transform: "translateY(-50%)",
                      overflow: "scroll",
                      maxWidth: "25rem",
                    }}
                  >
                    <Flex
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Text as="h2">Verify Participants</Text>
                      {/* <NextImage src={crossIcon} alt='back' width='30px' height='30px' onClick={() => setIsVerifyingEventParticipants(false)}/> */}
                    </Flex>
                    <Box mt="2rem" sx={{ maxWidth: "100%" }}>
                      <QrScanner
                        showResult={false}
                        onResult={onTicketQrScanned}
                      />
                    </Box>
                    <Flex
                      mt="2rem"
                      sx={{
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <Text variant="dialog">scan wallet QR to verify</Text>
                    </Flex>
                    <Flex
                      mt="2rem"
                      sx={{
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <Text variant="accent">
                        scanned {scannedTickets.length} of{" "}
                        {currentEventTickets!.length -
                          currentEventUsedTickets!.length}{" "}
                        unused tickets
                      </Text>
                    </Flex>
                    <Flex mt="2rem" sx={{ alignItems: "center" }}>
                      <Button
                        variant="accent"
                        onClick={commitScannedTickets}
                        disabled={!scannedTickets.length}
                      >
                        verify scanned tickets
                      </Button>
                      {isCommitingScannedTickets && (
                        <Spinner
                          size={30}
                          sx={{ position: "absolute", right: "2rem" }}
                        />
                      )}
                    </Flex>
                    {hasTicketsBeenSpentSuccessfully !== undefined && (
                      <Text>
                        {hasTicketsBeenSpentSuccessfully
                          ? "Tickets has been verified"
                          : "Error while verifying tickets"}
                      </Text>
                    )}
                  </Flex>
                </Container>
              </Portal>
            )}
          </>
        ),
      }[currentStage]()}
    </Flex>
  );
};

export default EventPage;
