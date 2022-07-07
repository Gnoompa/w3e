import React, { useState, useMemo, useEffect, SyntheticEvent, BaseSyntheticEvent, MouseEventHandler, useContext, ReactElement } from 'react'
import { Flex, Box, Button, Label, Input, Text, Container, Textarea, Switch, Spinner, SxProp, ThemeUIStyleObject } from "theme-ui"
import { useMoralis, useMoralisFile, useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis"
import { NavigateBack, Tooltip, Field, LocationPicker, TimespanPicker, FileUploader } from '@components/index'
import { useDebounce, handleOnMouseDown, formatWalletAddress } from 'helpers/hooks'
import OutsideClickHandler from 'react-outside-click-handler'
import { BigNumber, ethers } from 'ethers'
import { runContractFunction } from 'helpers/contract'
import NextImage from 'next/image'
import { Location } from './ui/locationPicker'
import { Timespan } from './ui/timespanPicker'
import { Portal } from 'react-portal'
import walletIcon from '../styles/icons/wallet.svg'
import cameraIcon from '../styles/icons/camera.svg'
import crossIcon from '../styles/icons/cross.svg'
import AppContext from '@components/context'
import dynamic from 'next/dynamic'

const QrScanner = dynamic(() => import('./ui/qrScanner'), {
    ssr: false
})

const EventForm = () => {
    enum FieldIds {
        description,
        ticketing,
        location,
        dateTime,
        beneficiary
    }

    const context = useContext(AppContext)
    const { Moralis, user } = useMoralis()
    const { native: MoralisNativeAPI } = useMoralisWeb3Api()
    const [isTestMode, setIsTestMode] = useState(0)
    const [fieldInFocus, setFieldInFocus] = useState<FieldIds>()
    const [eventTitle, setEventTitle] = useState<string>()
    const [eventDescription, setEventDescription] = useState<string>()
    const [eventLocation, setEventLocation] = useState<Location>()
    const [eventTimespan, setEventTimespan] = useState<Timespan>()
    const [isInSubscriptionMode, setIsInSubscriptionMode] = useState(0)
    const [isIndefiniteSubscription, setIsIndefiniteSubscription] = useState(0)
    const [isUnlimitedTicketSupply, setIsUnlimitedTicketSupply] = useState(0)
    const [isFreeTicketPrice, setIsFreeTicketPrice] = useState(0)
    const [relativeTicketPrice, setRelativeTicketPrice] = useState<string>()
    const [ticketSupply, setTicketSupply] = useState<number>()
    const [ticketPrice, setTicketPrice] = useState<number>()
    const debouncedTicketPrice = useDebounce(ticketPrice, 4000)
    const [priceFieldSubtitle, setPriceFieldSubtitle] = useState<string | ReactElement>()
    const [beneficiary, setBeneficiary] = useState<string>()
    const [isScanningBeneficiaryQr, setIsScanningBeneficiaryQr] = useState(false)
    const [scannedBeneficiaryAddress, setScannedBeneficiaryAddress] = useState('')
    const targetBlockchainLabel = isTestMode ? 'polygon testnet' : 'polygon mainnet'

    useEffect(() => {
        isFreeTicketPrice && setPriceFieldSubtitle('FREE')
    }, [isFreeTicketPrice])

    useEffect(() => {
        setPriceFieldSubtitle(isFreeTicketPrice
            ? 'FREE'
            : ticketPrice && relativeTicketPrice
                ? `~${(ticketPrice * +relativeTicketPrice).toFixed(2)} MATIC`
                : ticketPrice && !relativeTicketPrice
                    ? <Spinner size={'.75rem'} />
                    : '0 MATIC'
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

    const onQrScanResult = (result: string): void => {
        setScannedBeneficiaryAddress(result)
    }

    const toggleActiveDialog = (fieldId: FieldIds): void => {
        setTimeout(() => setFieldInFocus(fieldInFocus === fieldId ? undefined : fieldId))
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
            <Flex mt='3rem' sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                <Flex>
                    <Switch value={isTestMode} id="isTestMode" onChange={() => setIsTestMode(+!isTestMode)} />
                    <Label htmlFor="isTestMode" variant='forms.label.switch' sx={{ whiteSpace: 'nowrap' }}>
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
            <Flex mt='2rem' sx={{gap: '2rem'}}>
                <Box sx={{position: 'relative'}}>
                    <Field variant='forms.input.dialog' placeholder='description' onMouseDown={event => handleOnMouseDown(event, () => toggleActiveDialog(FieldIds.description))} icon='✏️' readOnly />
                    {fieldInFocus == FieldIds.description &&
                        <ContainerPopup onOutsideClick={() => setFieldInFocus(undefined)}>
                            <Field autoFocus variant='forms.input.dialogTransparent' placeholder='title' onChange={event => setEventTitle(event.target.value)} sx={{textAlign: 'center'}} />
                            <Textarea mt='1rem' placeholder='description' onChange={event => setEventDescription(event.target.value)} />
                        </ContainerPopup>
                    }
                </Box>
                <Box sx={{position: 'relative'}}>
                    <Field variant='forms.input.dialog' placeholder='ticketing' onMouseDown={event => handleOnMouseDown(event, () => toggleActiveDialog(FieldIds.ticketing))} icon='🎟' readOnly />
                    {fieldInFocus == FieldIds.ticketing &&
                        <ContainerPopup onOutsideClick={() => setFieldInFocus(undefined)} sx={{right: 0}}>
                            <Flex sx={{flexDirection: 'column'}}>
                                <Flex mb='1rem' sx={{alignItems: 'center'}}>
                                    <Text as='h2'>
                                        Tickets
                                    </Text>
                                    <Flex ml='1rem'>
                                        <Switch value={isInSubscriptionMode} checked={!!isInSubscriptionMode} id="isInSubscriptionMode" onChange={() => setIsInSubscriptionMode(+!isInSubscriptionMode)} />
                                        <Label htmlFor="isInSubscriptionMode" variant='forms.label.switch' sx={{ whiteSpace: 'nowrap' }}>
                                            as subscription
                                        </Label>
                                    </Flex>
                                </Flex>
                                {!!isInSubscriptionMode &&
                                    <Flex mb='1rem' sx={{flexDirection: 'column'}}>
                                        <Flex sx={{alignItems: 'center', gap: '1rem'}}>
                                            <Field variant='forms.input.dialogTransparent' placeholder='duration' disabled={!!isIndefiniteSubscription} autoFocus sx={{width: '7rem'}}/>
                                            <Flex>
                                                <Switch value={isIndefiniteSubscription} checked={!!isIndefiniteSubscription} id="isIndefiniteSubscription" onChange={() => setIsIndefiniteSubscription(+!isIndefiniteSubscription)} />
                                                <Label htmlFor="isIndefiniteSubscription" variant='forms.label.switch'>
                                                    indefinite
                                                </Label>
                                            </Flex>
                                        </Flex>
                                        <Flex mt='.25rem' pr='.25rem' sx={{alignContent: 'flex-end', width: '7rem', justifyContent: 'flex-end'}}>
                                            <Text variant='fieldSubtitle'>
                                                in days
                                            </Text>
                                        </Flex>
                                    </Flex>
                                }
                                <Flex sx={{alignItems: 'center', gap: '1rem'}}>
                                    <Field variant='forms.input.dialogTransparent' placeholder='supply' disabled={!!isUnlimitedTicketSupply} autoFocus sx={{width: '7rem'}}/>
                                    <Flex sx={{alignItems: 'center'}}>
                                        <Switch value={isUnlimitedTicketSupply} checked={!!isUnlimitedTicketSupply} id="isUnlimitedTicketSupply" onChange={() => setIsUnlimitedTicketSupply(+!isUnlimitedTicketSupply)} />
                                        <Label htmlFor="isUnlimitedTicketSupply" variant='forms.label.switch'>
                                            unlimited
                                        </Label>
                                    </Flex>
                                </Flex>
                                <Flex mt='1rem' sx={{alignItems: 'center'}}>
                                    <Flex sx={{flexDirection: 'column'}}>
                                        <Flex sx={{alignItems: 'center', gap: '1rem'}}>
                                            <Field variant='forms.input.dialogTransparent' placeholder='price' disabled={!!isFreeTicketPrice} onChange={event => setTicketPrice(+event.target.value)} postfix='$' sx={{width: '7rem'}}/>
                                            <Flex>
                                                <Switch value={isFreeTicketPrice} checked={!!isFreeTicketPrice} id="isFreeTicketPrice" onChange={() => setIsFreeTicketPrice(+!isFreeTicketPrice)} />
                                                <Label htmlFor="isFreeTicketPrice" variant='forms.label.switch'>
                                                    free
                                                </Label>
                                            </Flex>
                                        </Flex>
                                        <Flex mt='.25rem' pr='.25rem' sx={{alignContent: 'flex-end', width: '7rem', justifyContent: 'flex-end'}}>
                                            <Text variant='fieldSubtitle'>
                                                {priceFieldSubtitle}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </ContainerPopup>
                    }
                </Box>
            </Flex>
            <Flex mt='2rem' sx={{gap: '2rem'}}>
                <LocationPicker value={eventLocation} onChange={location => setEventLocation(location)} />
                <TimespanPicker value={eventTimespan} onChange={setEventTimespan} />
            </Flex>
            <Flex mt='2rem' sx={{alignItems: 'center'}}>
                <Box sx={{flex: 1, position: 'relative'}}>
                    <Field variant='forms.input.dialog' value={beneficiary} placeholder='beneficiary' onChange={event => setBeneficiary(event.target.value)} onBlur={() => onFieldBlur()} onFocus={() => setFieldInFocus(FieldIds.beneficiary)} icon='👛' />
                    {fieldInFocus == FieldIds.beneficiary &&
                        <ContainerPopup variant='layout.container.popupTransparent' onOutsideClick={() => setFieldInFocus(undefined)} sx={{left: 0}}>
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
                        </ContainerPopup>
                    }
                    {isScanningBeneficiaryQr &&
                        <Portal>
                            <Container variant='layout.container.modalBackground'>
                                <Flex sx={{flexDirection: 'column', alignItems: 'center', margin: 'max(50vh, 10rem) auto', transform: 'translateY(-50%)', maxWidth: '23rem'}}>
                                    <Flex sx={{alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                        <Text as='h2'>
                                            Beneficiary
                                        </Text>
                                        <NextImage src={crossIcon} alt='back' onClick={() => setIsScanningBeneficiaryQr(false)}/>
                                    </Flex>
                                    <Box mt='2rem' sx={{maxWidth: '100%'}}>
                                        <QrScanner onResult={onQrScanResult}/>
                                    </Box>
                                    {scannedBeneficiaryAddress &&
                                        <Button variant='accent' mt='2rem' onClick={() => (setBeneficiary(scannedBeneficiaryAddress), setIsScanningBeneficiaryQr(false))}>
                                            set the beneficiary
                                        </Button>
                                    }
                                </Flex>
                            </Container>
                        </Portal>
                    }
                </Box>
                <Box ml='2rem'>
                    <Tooltip />
                </Box>
            </Flex>
            <Box mt='2rem'>
                <FileUploader subtitle='add poster' />
            </Box>
        </Flex>
    )
}

const ContainerPopup: React.FC<{onOutsideClick?: Function, sx?: ThemeUIStyleObject, variant?: string}> = props =>
    <OutsideClickHandler
        onOutsideClick={props.onOutsideClick}
        useCapture
        display='contents'
    >
        <Container variant={props.variant || 'layout.container.popup'} {...props}>
            {props.children}
        </Container>
    </OutsideClickHandler>

export default EventForm
