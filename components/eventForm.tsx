import React, { useState, useMemo, useEffect, SyntheticEvent, BaseSyntheticEvent, MouseEventHandler, useContext } from 'react'
import { Flex, Box, Button, Label, Input, Text, Container, Textarea, Switch } from "theme-ui"
import { useMoralis, useMoralisFile, useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis"
import { NavigateBack, Tooltip, Field, LocationPicker, TimespanPicker } from '@components/index'
import { useDebounce, handleOnMouseDown } from 'helpers/hooks'
import { BigNumber, ethers } from 'ethers'
import { runContractFunction } from 'helpers/contract'
import NextImage from 'next/image'
import { Location } from './ui/locationPicker'
import { Timespan } from './ui/timespanPicker'
import { Portal } from 'react-portal'
import walletIcon from '../styles/icons/wallet.svg'
import cameraIcon from '../styles/icons/camera.svg'
import AppContext from 'pages/context'

const EventForm = () => {
    enum FieldIds {
        ticketSupply,
        ticketPrice,
        beneficiary
    }

    const context = useContext(AppContext)
    const { Moralis, user } = useMoralis()
    const { native: MoralisNativeAPI } = useMoralisWeb3Api()
    const [isTestMode, setIsTestMode] = useState(0)
    const [fieldInFocus, setFieldInFocus] = useState<FieldIds>()
    const [ticketSupply, setTicketSupply] = useState<number>()
    const [ticketPrice, setTicketPrice] = useState<number>()
    const debouncedTicketPrice = useDebounce(ticketPrice, 4000)
    const [priceFieldSubtitle, setPriceFieldSubtitle] = useState<string>()
    const [isInfiniteTicketSupply, setIsInfiniteTicketSupply] = useState(false)
    const [isFreeTicketPrice, setIsFreeTicketPrice] = useState(false)
    const [relativeTicketPrice, setRelativeTicketPrice] = useState<string>()
    const [eventLocation, setEventLocation] = useState<Location>()
    const [eventTimespan, setEventTimespan] = useState<Timespan>()
    const [beneficiary, setBeneficiary] = useState<string>()
    const [isScanningBeneficiaryQr, setIsScanningBeneficiaryQr] = useState(false)
    const targetBlockchainLabel = isTestMode ? 'polygon testnet' : 'polygon mainnet'

    useEffect(() => {
        isFreeTicketPrice && setPriceFieldSubtitle('FREE')
    }, [isFreeTicketPrice])

    useEffect(() => {
        setPriceFieldSubtitle(isFreeTicketPrice
            ? 'FREE'
            : ticketPrice && relativeTicketPrice
                ? `~${(ticketPrice * +relativeTicketPrice).toFixed(6)} MATIC`
                : ticketPrice && 'fetching price in MATIC...' || ''
        )
    }, [relativeTicketPrice, ticketPrice, isFreeTicketPrice])

    useEffect(() => {
        !isFreeTicketPrice && debouncedTicketPrice && (
            runContractFunction(
                MoralisNativeAPI,
                {
                    service: 'chainlink',
                    chain: 'polygon',
                    action: 'MATIC/USD'
                }
            )
                .then(price => setRelativeTicketPrice(Moralis.Units.FromWei(BigNumber.from(price).toString(), 8)))
        )
    }, [MoralisNativeAPI, isFreeTicketPrice, debouncedTicketPrice])

    const onFieldBlur = (): void => {
        setFieldInFocus(undefined)
    }

    const onTicketSupplyChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        isInfiniteTicketSupply && (
            setIsInfiniteTicketSupply(false)
        )

        setTicketSupply(+(isInfiniteTicketSupply ? event.nativeEvent.data : event.target.value) || 0)
    }

    const onTicketPriceChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        isFreeTicketPrice && (
            setIsFreeTicketPrice(false)
        )

        setTicketPrice(+(isFreeTicketPrice ? event.nativeEvent.data : event.target.value) || 0)
    }

    const onInfiniteTicketSupplyButtonMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.button == 0 && setIsInfiniteTicketSupply(true)
    }

    const onFreeTicketPriceButtonMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.button == 0 && setIsFreeTicketPrice(true)
    }

    return (
        <Flex sx={{flexDirection: 'column', width: '23rem', margin: '20rem auto', transform: 'translateY(-50%)'}}>
            <NavigateBack href='/app'>
                to ticketing
            </NavigateBack>
            <Text mt='.75em' as='h1'>
                New Event
            </Text>
            {/* <Flex mt='3rem' sx={{alignItems: 'center'}}>
                <Toggle options={{live: {label: 'live', secondaryLabel: 'polygon mainnet', tooltip: 'Only "Live" event has real value (could be traded on Opensea, etc.). Use "Free test" mode to get familiar with Tickero!'}, test: {label: 'free test', secondaryLabel: 'polygon testnet'}}} />
            </Flex> */}
            <Flex
                mt='3rem'
                sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Flex>
                    <Switch value={isTestMode} id="enable-email-alerts" onChange={() => setIsTestMode(+!isTestMode)} />
                    <Label htmlFor="enable-email-alerts" variant='forms.label.switch' sx={{ whiteSpace: 'nowrap' }}>
                        test for free
                    </Label>
                    <Text ml='1rem' variant='hint'>
                        ({targetBlockchainLabel})
                    </Text>
                </Flex>
                <Box>
                    <Tooltip />
                </Box>
            </Flex>
            <Field mt='1rem' placeholder='name*' autoFocus />
            <Textarea mt='1.5rem' placeholder='description' />
            <Flex mt='1rem' sx={{gap: '3rem'}}>
                <Box sx={{position: 'relative'}}>
                    <Field value={isInfiniteTicketSupply ? 'infinite tickets' : ticketSupply} placeholder='ticket supply' onChange={onTicketSupplyChange} onBlur={() => onFieldBlur()} onFocus={() => setFieldInFocus(FieldIds.ticketSupply)}/>
                    {fieldInFocus == FieldIds.ticketSupply &&
                        <Container variant='layout.container.popup'>
                            <Flex sx={{flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                                <Text variant='dialog' sx={{whiteSpace: 'nowrap'}}>
                                    enter manually
                                </Text>
                                <Text variant='dialogSecondary'>
                                    OR
                                </Text>
                                <Box sx={{alignSelf: 'center'}}>
                                    <Button variant='primary' onMouseDown={onInfiniteTicketSupplyButtonMouseDown}>set as infinite</Button>
                                </Box>
                            </Flex>
                        </Container>
                    }
                </Box>
                <Box sx={{position: 'relative'}}>
                    <Field value={isFreeTicketPrice ? 'free tickets' : ticketPrice} postfix='$' subtitle={priceFieldSubtitle} placeholder='ticket price' onChange={onTicketPriceChange} onBlur={() => onFieldBlur()} onFocus={() => setFieldInFocus(FieldIds.ticketPrice)}  />
                    {fieldInFocus == FieldIds.ticketPrice &&
                        <Container variant='layout.container.popup' sx={{right: 0}}>
                            <Flex sx={{flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                                <Text variant='dialog' sx={{whiteSpace: 'nowrap'}}>
                                    enter manually
                                </Text>
                                <Text variant='dialogSecondary'>
                                    OR
                                </Text>
                                <Box sx={{alignSelf: 'center'}}>
                                    <Button variant='primary' onMouseDown={onFreeTicketPriceButtonMouseDown}>set as free</Button>
                                </Box>
                            </Flex>
                        </Container>
                    }
                </Box>
            </Flex>
            <Flex mt='2rem' sx={{gap: '3rem'}}>
                <LocationPicker value={eventLocation} onChange={location => setEventLocation(location)} />
                <TimespanPicker value={eventTimespan} onChange={setEventTimespan} />
            </Flex>
            <Flex mt='2rem' sx={{alignItems: 'center'}}>
                <Box sx={{flex: 1}}>
                    <Field variant='forms.input.dialog' value={beneficiary} placeholder='beneficiary address' onChange={event => setBeneficiary(event.target.value)} onBlur={() => onFieldBlur()} onFocus={() => setFieldInFocus(FieldIds.beneficiary)} icon={walletIcon} />
                    {fieldInFocus == FieldIds.beneficiary &&
                        <Container variant='layout.container.popupTransparent'>
                            <Flex sx={{gap: '1rem'}}>
                                <Button variant='fieldDialog' onMouseDown={event => handleOnMouseDown(event, () => setBeneficiary(user?.get('ethAddress')))}>
                                    <Flex sx={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                        <Text>
                                            me
                                        </Text>
                                        <Text variant='secondary' mt='.25rem' sx={{fontSize: '.75rem'}}>
                                            {context?.formattedWalletAddress}
                                        </Text>
                                    </Flex>
                                </Button>
                                <Button variant='fieldDialog' onMouseDown={event => handleOnMouseDown(event, () => setIsScanningBeneficiaryQr(true))}>
                                    <Flex sx={{flexDirection: 'column'}}>
                                        <NextImage src={cameraIcon} alt='camera icon' />
                                        <Text variant='secondary' mt='.25rem' sx={{fontSize: '.75rem'}}>
                                            scan QR
                                        </Text>
                                    </Flex>
                                </Button>
                            </Flex>
                        </Container>
                    }
                    {isScanningBeneficiaryQr &&
                        <Portal>
                            <Container variant='layout.container.modalBackground'>
                                <Flex sx={{flexDirection: 'column', margin: '22rem auto', maxWidth: '23rem'}}>
                                    <Text as='h2'>
                                        Beneficiary
                                    </Text>
                                </Flex>
                            </Container>
                        </Portal>
                    }
                </Box>
                <Box ml='2.5rem'>
                    <Tooltip />
                </Box>
            </Flex>
        </Flex>
    )
}

export default EventForm
