import React, { useRef, useState, useMemo, useEffect, useContext, ReactElement } from 'react'
import { Flex, Box, Image, Button, Label, Input, Text, Container, Textarea, Switch, Spinner, SxProp, ThemeUIStyleObject, Link } from "theme-ui"
import { NavigateBack } from '@components/index'
import { useRouterQuery } from 'helpers/hooks'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import shareIcon from '../styles/icons/share.svg'
import { Portal } from 'react-portal'
import { useRouter } from 'next/router'
import buyTicketImage from '../public/coins/coins301x.png'
import verifyImage from '../public/verify/verify@0.25x.png'
import crossIcon from '../styles/icons/cross.svg'
import { AppContext } from '../helpers/context'
import { formatWalletAddress } from 'helpers/hooks'
import { BigNumber, ethers } from 'ethers'
import Moralis from 'moralis/types'

const QrScanner = dynamic(() => import('./ui/qrScanner'), {
    ssr: false
})

const EventPage = () => {
    enum Stage {
        LoadingEvent,
        EventLoaded,
        VerifyingParticipants
    }

    const router = useRouter()
    const context = useContext(AppContext)
    const {web3APIProvider} = useContext(AppContext)
    const routerQuery = useRouterQuery(router)
    const [currentStage, setCurrentStage] = useState<Stage>(Stage.LoadingEvent)
    const [eventTokenId, setEventTokenId] = useState<number>()
    const [event, setEvent] = useState<TickeroEvent>()
    const [eventMetadata, setEventMetadata] = useState<TickeroEventMetadata>()
    const [isVerifyingEventParticipants, setIsVerifyingEventParticipants] = useState(false)
    const [isVerifyingEventParticipant, setIsVerifyingEventParticipant] = useState(false)
    const [participantVerificationWalletQrScanResult, setParticipantVerificationWalletQrScanResult] = useState<string>()
    const [verificationResult, setVerificationResult] = useState('')
    const [isSoulbounding, setIsSoulbounding] = useState(false)
    const [isSoulboundingInProcess, setIsSoulboundingInProcess] = useState(false)
    const [scannedWalletQRsToVerify, setScannedWalletQRsToVerify] = useState<Array<string>>([])
    const [scannedWalletQRsToSoulbound, setScannedWalletQRsToSoulbound] = useState<Array<string>>([])
    const isEventOrganizer = event?.organizer?.toLowerCase() == web3APIProvider.getEthAddress().toLowerCase()
    const canGrantSoulbound = isEventOrganizer
    const [hasTicket, setHasTicket] = useState(false)
    const canBuyTicket = !isEventOrganizer && !hasTicket
    const [isBuyingATicket, setIsBuyingATicket] = useState(false)

    useEffect(() => {
        routerQuery.id
            ? fetchEvent(routerQuery.id)
            : router.push('/app')
    }, [])

    useEffect(() => {
        (event && eventMetadata && (currentStage == Stage.LoadingEvent))
            && setCurrentStage(Stage.EventLoaded)
    }, [event, eventMetadata])

    useEffect(() => {
        participantVerificationWalletQrScanResult && !isVerifyingEventParticipant && verifyEventParticipant()
            .then(result => setVerificationResult(+result ? '😊 verified 😊' : '🚷 not verified 🚷'))
            .finally(() => setIsVerifyingEventParticipant(false))
    }, [participantVerificationWalletQrScanResult, isVerifyingEventParticipant])

    const fetchEvent = async (eventTokenId: number) => {
        setEventTokenId(eventTokenId)

        // setEventMetadata({
        //     name: 'test long event name that is too long',
        //     description: 'test description ',
        //     image: 'https://lh3.googleusercontent.com/FwCIH6sP3NUDfhk5I_Qx6aWHH6QV71saS5Jzn8BOB5tTPq3_Thn1t9N0ZLRvGqhVU8q_BVz__nKHhtF_OIuWrbDx=w600',
        // })

        // setEvent({
        //     beneficiary: web3APIProvider.getEthAddress() as string,
        //     organizer: web3APIProvider.getEthAddress() as string,
        //     isSubscription: true,
        //     ticketPrice: "2",
        //     ticketSupply: "0",
        //     isInfiniteTicketSupply: true
        // })

        console.log(eventTokenId, web3APIProvider.getEthAddress())

        Promise.all([
            web3APIProvider.getTokenIdMetadata(eventTokenId)
                .then(metadata => setEventMetadata(JSON.parse(metadata.metadata))),
            web3APIProvider.getEvent({eventTokenId})
                .then(setEvent),
            web3APIProvider.hasTicket({eventTokenId, address: web3APIProvider.getEthAddress()})
                .then(result => console.log(result) || setHasTicket(!!+result))
        ])
            .then(() => setCurrentStage(Stage.EventLoaded))
    }

    const buyTicket = async () => {
        setIsBuyingATicket(true)

        const maticToUsdPrice = await web3APIProvider.getMaticToUsdPrice()

        const response = await web3APIProvider.buyTicket({
            _eventTokenId: +eventTokenId,
            ticketsAmount: 1,
        }, BigNumber.from(maticToUsdPrice).mul(+event!.ticketPrice / 10**8).toString())

        response.wait()
            .catch(() => alert('Couldn\'t buy a ticket'))
            .finally(() => setIsBuyingATicket(false))

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
    }

    const startVerification = () => {
        setIsVerifyingEventParticipants(true)
    }

    const soulboundParticipants = async () => {
        setIsSoulboundingInProcess(true)

        const response = await web3APIProvider.soulboundParticipants({
            eventTokenId: eventTokenId!,
            addresses: scannedWalletQRsToSoulbound
        })

        const receipt = await response.wait()

        setIsSoulboundingInProcess(false)
        setIsSoulbounding(false)
    }

    const onSoulboundingWalletQrScanResult = (address: string): void => {
        !scannedWalletQRsToSoulbound.includes(address) &&
            setScannedWalletQRsToSoulbound([...scannedWalletQRsToSoulbound, address])
    }

    const verifyEventParticipant = async () =>
        await web3APIProvider.verifyEventParticipant({
            eventTokenId: eventTokenId!,
            participantAddress: participantVerificationWalletQrScanResult!
    })

    const onParticipantVerificationWalletQrScanResult = async (address: string) => {
        setParticipantVerificationWalletQrScanResult(address)
    }

    return (
        <Flex sx={{flexDirection: 'column', width: '22rem', margin: '31rem auto', transform: 'translateY(-50%)'}}>
            <Flex sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                <NavigateBack href='/app'>
                    to main menu
                </NavigateBack>
                <Button variant='accentSmall' onClick={() => navigator.share({title: eventMetadata?.name, url: location.href})}>
                    <Flex sx={{alignItems: 'center'}}>
                        <NextImage src={shareIcon} width='30px' height='30px' alt='share'/>
                        <Box ml='.5rem'>
                            share
                        </Box>
                    </Flex>
                </Button>
            </Flex>
            {({
                [Stage.LoadingEvent]: () => <Spinner sx={{margin: '31rem auto', transform: 'translateY(-50%)'}} />,
                [Stage.VerifyingParticipants]: () => <Spinner sx={{margin: '31rem auto', transform: 'translateY(-50%)'}} />,
                [Stage.EventLoaded]: () => <>
                    <Text mt='.75em' as='h1'>
                        {eventMetadata?.name}
                    </Text>
                    <Flex mt='3rem' sx={{flexDirection: 'column'}}>
                        {eventMetadata?.image && <Image src={eventMetadata?.image} />}
                        {eventMetadata?.description &&
                            <Text variant='secondary'>
                                {eventMetadata.description}
                            </Text>
                        }
                        <Text mt='2rem' variant='dialogSecondary' sx={{fontSize: '1.5rem', alignSelf: 'center'}}>
                            {isEventOrganizer
                                ? 'you are an organizer'
                                : (event?.isSubscription
                                    ? 'subscribe for '
                                    : 'ticket for '
                                )
                                    + ethers.utils.formatUnits(event?.ticketPrice, 'ether') + ' $'
                            }
                        </Text>
                        <Flex mt='2rem' sx={{flexDirection: 'column', gap: '1.5rem', alignItems: 'center'}}>
                            {canBuyTicket &&
                                <Flex sx={{alignItems: 'center'}}>
                                    <Button variant='accent' onClick={buyTicket} disabled={isBuyingATicket}>
                                        <Flex sx={{alignItems: 'center', justifyContent: 'space-around', gap: '1rem'}}>
                                            <Box sx={{width: '3rem', height: '2rem', position: 'relative'}}>
                                                <NextImage src={buyTicketImage} alt="buy a ticket" width='30px' height='30px' objectFit='contain' />
                                            </Box>
                                            {event?.isSubscription ? 'subscribe' : 'buy a ticket'}
                                        </Flex>
                                    </Button>
                                    {isBuyingATicket &&
                                        <Spinner size={30} sx={{position: 'absolute', right: '2rem'}} />
                                    }
                                </Flex>
                            }
                            {hasTicket &&
                                <Text mt='1rem' mb='1rem' as='h3' variant='infoContent'>
                                    🔥 {event?.isSubscription ? ' subscribed' : 'participating'} 🔥
                                </Text>
                            }
                            <Button variant='accent' onClick={startVerification}>
                                <Flex sx={{alignItems: 'center', justifyContent: 'space-around', gap: '1rem'}}>
                                    <Box sx={{width: '3rem', height: '2rem'}}>
                                        <NextImage src={verifyImage} width='30px' height='30px' alt="verify participant" />
                                    </Box>
                                    verify a participant
                                </Flex>
                            </Button>
                            {canGrantSoulbound &&
                                <Button variant='accent' onClick={() => setIsSoulbounding(true)}>
                                    <Flex sx={{alignItems: 'center', justifyContent: 'space-around', gap: '1rem'}}>
                                        <Box sx={{width: '3rem', height: '2rem', position: 'relative'}}>
                                            <NextImage src={buyTicketImage} alt="buy a ticket" width='30px' height='30px' objectFit='contain' />
                                        </Box>
                                        <Text>grant POA</Text>

                                    </Flex>
                                </Button>
                            }
                        </Flex>
                    </Flex>
                    {isSoulbounding &&
                        <Portal>
                            <Container variant='layout.container.modalBackground'>
                                <Flex p='2rem 1rem' sx={{maxHeight: '100%', flexDirection: 'column', alignItems: 'center', margin: 'max(50vh, 10rem) auto', transform: 'translateY(-50%)', overflow: 'scroll', maxWidth: '25rem'}}>
                                    <Flex sx={{alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                        <Text as='h2'>
                                            Grant POAs
                                        </Text>
                                        <NextImage src={crossIcon} alt='back' width='30px' height='30px' onClick={() => setIsSoulbounding(false)}/>
                                    </Flex>
                                    <Box mt='2rem' sx={{maxWidth: '100%'}}>
                                        <QrScanner showResult={false} onResult={onSoulboundingWalletQrScanResult} />
                                    </Box>
                                    <Flex mt='2rem' sx={{flexDirection: 'column', flex: 1, width: '100%'}}>
                                        {scannedWalletQRsToSoulbound.length
                                            ? <Flex sx={{flexDirection: 'column', alignSelf: 'flex-start', width: '100%', gap: '.5rem'}}>
                                                <Text mb='1rem' as='h2'>
                                                    Scanned wallets:
                                                </Text>
                                                {scannedWalletQRsToSoulbound.map(scannedAddress =>
                                                    <Text as='h3' key={scannedAddress}>
                                                        {formatWalletAddress(scannedAddress)}
                                                    </Text>
                                                )}
                                                <Button mt='1rem' disabled={!scannedWalletQRsToSoulbound.length} variant='accent' sx={{alignSelf: 'center'}} onClick={soulboundParticipants}>Grant POAs</Button>
                                                {isSoulboundingInProcess &&
                                                    <Spinner />
                                                }
                                            </Flex>
                                            : <Text variant='dialog' sx={{alignSelf: 'center'}}>scan multiple wallet QRs</Text>
                                        }
                                    </Flex>
                                    {/* {scannedBeneficiaryAddress &&
                                        <Button variant='accent' mt='2rem' onClick={() => (setBeneficiary(scannedBeneficiaryAddress), setIsScanningBeneficiaryQr(false))}>
                                            set the beneficiary
                                        </Button>
                                    } */}
                                </Flex>
                            </Container>
                        </Portal>
                    }
                    {isVerifyingEventParticipants &&
                        <Portal>
                            <Container variant='layout.container.modalBackground'>
                                <Flex p='2rem 1rem' sx={{maxHeight: '100%', flexDirection: 'column', alignItems: 'center', margin: 'max(50vh, 10rem) auto', transform: 'translateY(-50%)', overflow: 'scroll', maxWidth: '25rem'}}>
                                    <Flex sx={{alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                        <Text as='h2'>
                                            Verify Participants
                                        </Text>
                                        <NextImage src={crossIcon} alt='back' width='30px' height='30px' onClick={() => setIsVerifyingEventParticipants(false)}/>
                                    </Flex>
                                    <Box mt='2rem' sx={{maxWidth: '100%'}}>
                                        <QrScanner showResult={false} onResult={onParticipantVerificationWalletQrScanResult} />
                                    </Box>
                                    <Flex mt='2rem' sx={{flexDirection: 'column', alignItems: 'center', flex: 1, width: '100%', justifyContent: 'center'}}>
                                        {isVerifyingEventParticipant
                                            ? <Flex sx={{alignItems: 'center', gap: '1rem'}}>
                                                <Text variant='dialog'>
                                                    verifying
                                                </Text>
                                                <Spinner />
                                            </Flex>
                                            : <Text variant='dialog'>
                                                {isVerifyingEventParticipant || !verificationResult ? 'scan wallet QR to verify' : verificationResult}
                                            </Text>
                                        }
                                    </Flex>
                                </Flex>
                            </Container>
                        </Portal>
                    }
                </>
            })[currentStage]()}
        </Flex>
    )
}

export default EventPage
