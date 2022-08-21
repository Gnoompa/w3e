import React, { useRef, useState, useMemo, useEffect, SyntheticEvent, BaseSyntheticEvent, MouseEventHandler, useContext, ReactElement } from 'react'
import { Flex, Box, Button, Label, Input, Text, Container, Textarea, Switch, Spinner, SxProp, ThemeUIStyleObject, Link } from "theme-ui"
import { NavigateBack, Tooltip, Field, LocationPicker, TimespanPicker, FileUploader } from '@components/index'
import { useDebounce, handleOnMouseDown, formatWalletAddress } from 'helpers/hooks'
import OutsideClickHandler from 'react-outside-click-handler'
import { BigNumber, ethers, FixedNumber } from 'ethers'
import NextImage from 'next/image'
import { Location } from './ui/locationPicker'
import { Timespan } from './ui/timespanPicker'
import { Portal } from 'react-portal'
import dynamic from 'next/dynamic'
import { Stage, Layer, Text as KonvaText, Image } from "react-konva";
import { useRouter } from 'next/router'
import { AppContext } from '../helpers/context'

const QrScanner = dynamic(() => import('./ui/qrScanner'), {
    ssr: false
})

const EventTicketImage = dynamic(() => import("./eventTicket"), {
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

    enum Stage {
        eventConfig,
        rewardConfig,
        creatingEvent
    }

    const router = useRouter()
    const context = useContext(AppContext)
    const canvasRef = useRef()
    const {web3APIProvider} = useContext(AppContext)
    const [currentStage, setCurrentStage] = useState<Stage>(Stage.eventConfig)
    const [isTestMode, setIsTestMode] = useState(false)
    const [fieldInFocus, setFieldInFocus] = useState<FieldIds>()
    const [eventTitle, setEventTitle] = useState<string>()
    const [eventDescription, setEventDescription] = useState<string>()
    const [eventLocation, setEventLocation] = useState<Location>()
    const [eventTimespan, setEventTimespan] = useState<Timespan>()
    const [isInSubscriptionMode, setIsInSubscriptionMode] = useState(false)
    const [isIndefiniteSubscription, setIsIndefiniteSubscription] = useState(false)
    const [subscriptionDuration, setSubscriptionDuration] = useState<number>()
    const [isUnlimitedTicketSupply, setIsUnlimitedTicketSupply] = useState(false)
    const [isFreeTicketPrice, setIsFreeTicketPrice] = useState(false)
    const [relativeTicketPrice, setRelativeTicketPrice] = useState<string>()
    const [ticketSupply, setTicketSupply] = useState<number>()
    const [ticketPrice, setTicketPrice] = useState<number>()
    const debouncedTicketPrice = useDebounce(ticketPrice, 4000)
    const [ticketEventTitle, setTicketEventTitle] = useState<string>()
    const [ticketEventImageResult, setTicketEventImageResult] = useState<{eventTitle: string, image: string}>()
    const [priceFieldSubtitle, setPriceFieldSubtitle] = useState<string | ReactElement>()
    const [beneficiary, setBeneficiary] = useState<string>()
    const [isScanningBeneficiaryQr, setIsScanningBeneficiaryQr] = useState(false)
    const [scannedBeneficiaryAddress, setScannedBeneficiaryAddress] = useState('')
    const [eventPoster, setEventPoster] = useState<File>()
    const [isUpgradableEventReward, setIsUpgradableEventReward] = useState(false)
    const targetBlockchainLabel = isTestMode ? 'polygon testnet' : 'polygon mainnet'

    useEffect(() => {
        !web3APIProvider.isAuthenticated() && web3APIProvider.auth()
    }, [])

    useEffect(() => {
        setCurrentStage(({
            '/#createEvent': Stage.eventConfig,
            '/#eventRewards': Stage.rewardConfig
        })[router.asPath]!)
    }, [router.asPath])

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
            web3APIProvider.getMaticToUsdPrice()
                .then(price => setRelativeTicketPrice(ethers.utils.formatUnits(price, 8).toString()))
        )
    }, [isFreeTicketPrice, debouncedTicketPrice])

    useEffect(() => {
        currentStage == Stage.creatingEvent &&
            eventTitle ==ticketEventImageResult?.eventTitle &&
            createEvent()
    }, [currentStage, eventTitle, ticketEventImageResult])

    const onFieldBlur = (): void => {
        setFieldInFocus(undefined)
    }

    const onQrScanResult = (result: string): void => {
        setScannedBeneficiaryAddress(result)
    }

    const toggleActiveDialog = (fieldId: FieldIds): void => {
        setTimeout(() => setFieldInFocus(fieldInFocus === fieldId ? undefined : fieldId))
    }

    // const prepareNFTFilesForMoralis = (files: Array<File>): Array<{path: string, content: string}> =>
    //     files.map((file, fileIndex) => ({
    //         path: `tickero/${eventNonce}/${file.name}`,
    //         content: file.text
    //     }))

    const uploadNFTFiles = (files: Array<File>): Promise<any> =>
        web3APIProvider.uploadEventNFTFolder(files)

    const onNFTFilesUpload = (files: Array<File>): void => {
        files.length && validateNFTFiles(files) && uploadNFTFiles
    }

    const validateNFTFiles = (files: Array<File>): true|string =>
        true

    const validateEventForm = (): true|string =>
        (!beneficiary && 'Add event description') ||
        (!eventTitle && !eventDescription && 'Add event description') ||
        (!ticketPrice && !isFreeTicketPrice && 'Add ticket or subscription price') ||
        true

    const goToEventRewardsStage = (): void => {
        let errorMessage = validateEventForm()

        errorMessage === true
            ? beforeEventCreation()
            : alert(errorMessage)
    }

    const mbUploadEventPoster = async (eventPoster: File|undefined) =>
        await eventPoster && web3APIProvider.uploadEventFiles({files: [eventPoster]})

    const uploadTicketImage = async (ticketImage: string) =>
        await web3APIProvider.uploadEventFiles({files: [{base64: ticketImage}]})

    const getEventMetadata = (): TickeroEventMetadata => ({
        name: eventTitle!,
        description: eventDescription,
        attributes: [
            (eventTimespan?.fromDate || eventTimespan?.fromTime) && {
                trait_type: "Event Start Date/Time",
                value: `
                    ${eventTimespan.fromDate
                        ? eventTimespan.fromDate + ' '
                        : ''}
                    ${eventTimespan.fromTime
                        ? eventTimespan.fromTime
                        : ''}
                    `
            },
            eventTimespan?.weekdays?.length && {
                trait_type: "Happens On Every",
                value: eventTimespan.weekdays.map(weekday => weekday.title).join(', ')
            },
            eventTimespan?.at && {
                trait_type: "Happens At",
                value: eventTimespan.at
            },
            eventLocation && {
                trait_type: "Location",
                value: eventLocation
            }
        ].filter(Boolean) as object[]
    })

    const uploadEventMetadata = (data: object): Promise<string> =>
        web3APIProvider.uploadEventFiles({files: [{base64: Buffer.from(JSON.stringify(data)).toString('base64')}]})

    const beforeEventCreation = () => {
        setCurrentStage(Stage.creatingEvent)
        setTicketEventTitle(eventTitle)
    }

    const createEvent = async (): void => {
        const eventPosterUrl = await mbUploadEventPoster(eventPoster)
        const eventMetadata = getEventMetadata()

        const eventMetadataUrl = await uploadEventMetadata({
            ...eventMetadata,
            image: eventPosterUrl
        })

        const ticketImageUrl = await uploadTicketImage(ticketEventImageResult!.image)

        const ticketMetadataUrl = await uploadEventMetadata({
            image: ticketImageUrl
        })

        const eventTokenId = await web3APIProvider.createEvent({
            calldata: {
                payload: {
                    ticketSupply: [Math.floor((+ticketSupply! || 0))],
                    ticketPrice: [ethers.utils.parseEther(`${+ticketPrice! || 0}`)],
                    beneficiary: beneficiary,
                    managers: [beneficiary],
                    params: [0],
                    subscriptionDuration: [subscriptionDuration || 0],
                    eventMetadataUri: eventMetadataUrl,
                    ticketMetadataUri: [ticketMetadataUrl]
                }
            }
        })

        const response = await eventTokenId.wait()

        router.push('/#event?id=' + response.events.filter(({event}) => event == 'EventCreated')[0].args[0])
    }

    return (
        <Flex sx={{flexDirection: 'column', width: '22rem', margin: '31rem auto', transform: 'translateY(-50%)'}}>
            <EventTicketImage eventTitle={ticketEventTitle} onImageGenerated={setTicketEventImageResult}/>
            {({
                [Stage.eventConfig]: <>
                    <Text mt='.75em' as='h1'>
                        New Event
                    </Text>
                    {/* <Flex mt='3rem' sx={{flexDirection: 'column'}}>
                        <Flex sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                            <Flex>
                                <Switch value={+isTestMode} checked={isTestMode} id="isTestMode" onChange={() => setIsTestMode(!isTestMode)} />
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
                        {!!isTestMode &&
                            <Flex mt='1rem' sx={{justifyContent: 'center'}}>
                                <Link href='https://faucet.polygon.technology/' target='_blank'>
                                    <Button variant='accentSmall'>get free tokens</Button>
                                </Link>
                            </Flex>
                        }
                    </Flex> */}
                    <Flex mt='2rem' sx={{gap: '2rem'}}>
                        <Box sx={{position: 'relative'}}>
                            <Field variant='forms.input.dialog' placeholder='description' onMouseDown={event => handleOnMouseDown(event, () => toggleActiveDialog(FieldIds.description))} icon='✏️' readOnly />
                            {fieldInFocus == FieldIds.description &&
                                <ContainerPopup onOutsideClick={() => setFieldInFocus(undefined)}>
                                    <Field value={eventTitle} autoFocus variant='forms.input.dialogTransparent' placeholder='title' onChange={event => setEventTitle(event.target.value)} sx={{textAlign: 'center'}} />
                                    <Textarea value={eventDescription} mt='1rem' placeholder='description' onChange={event => setEventDescription(event.target.value)} />
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
                                                <Switch value={+isInSubscriptionMode} checked={isInSubscriptionMode} id="isInSubscriptionMode" onChange={() => setIsInSubscriptionMode(!isInSubscriptionMode)} />
                                                <Label htmlFor="isInSubscriptionMode" variant='forms.label.switch' sx={{ whiteSpace: 'nowrap' }}>
                                                    as subscription
                                                </Label>
                                            </Flex>
                                        </Flex>
                                        {!!isInSubscriptionMode &&
                                            <Flex mb='1rem' sx={{flexDirection: 'column'}}>
                                                <Flex sx={{alignItems: 'center', gap: '1rem'}}>
                                                    <Field value={subscriptionDuration} onChange={event => setSubscriptionDuration(+event.target.value)} type='number' variant='forms.input.dialogTransparent' placeholder='duration' disabled={!!isIndefiniteSubscription} autoFocus sx={{width: '7rem'}}/>
                                                    <Flex>
                                                        <Switch value={+isIndefiniteSubscription} checked={isIndefiniteSubscription} id="isIndefiniteSubscription" onChange={() => setIsIndefiniteSubscription(!isIndefiniteSubscription)} />
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
                                            <Field value={ticketSupply} onChange={event => setTicketSupply(+event.target.value)} variant='forms.input.dialogTransparent' placeholder='supply' disabled={!!isUnlimitedTicketSupply} autoFocus sx={{width: '7rem'}}/>
                                            <Flex sx={{alignItems: 'center'}}>
                                                <Switch value={+isUnlimitedTicketSupply} checked={isUnlimitedTicketSupply} id="isUnlimitedTicketSupply" onChange={() => setIsUnlimitedTicketSupply(!isUnlimitedTicketSupply)} />
                                                <Label htmlFor="isUnlimitedTicketSupply" variant='forms.label.switch'>
                                                    unlimited
                                                </Label>
                                            </Flex>
                                        </Flex>
                                        <Flex mt='1rem' sx={{alignItems: 'center'}}>
                                            <Flex sx={{flexDirection: 'column'}}>
                                                <Flex sx={{alignItems: 'center', gap: '1rem'}}>
                                                    <Field value={ticketPrice} type='number' variant='forms.input.dialogTransparent' placeholder='price' disabled={!!isFreeTicketPrice} onChange={event => setTicketPrice(+event.target.value)} postfix='$' sx={{width: '7rem'}}/>
                                                    <Flex>
                                                        <Switch value={+isFreeTicketPrice} checked={isFreeTicketPrice} id="isFreeTicketPrice" onChange={() => setIsFreeTicketPrice(!isFreeTicketPrice)} />
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
                                        <Button variant='fieldDialog' onMouseDown={event => handleOnMouseDown(event, () => setBeneficiary(web3APIProvider.getEthAddress()))}>
                                            <Flex sx={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                                <Text>
                                                    me
                                                </Text>
                                            </Flex>
                                        </Button>
                                        <Button variant='fieldDialog' onMouseDown={event => handleOnMouseDown(event, () => setIsScanningBeneficiaryQr(true))}>
                                            <Flex sx={{flexDirection: 'column'}}>
                                                {/* <NextImage src={cameraIcon} width='30px' height='30px' alt='camera icon' /> */}
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
                                                {/* <NextImage src={crossIcon} width='30px' height='30px' alt='back' onClick={() => setIsScanningBeneficiaryQr(false)}/> */}
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
                        <FileUploader subtitle='add poster' onChange={files => setEventPoster(files[0])} config={{
                            maxFiles: 1,
                            accept: {'image/*': [], 'video/*': []}
                        }} />
                    </Box>
                    <Button onClick={goToEventRewardsStage} mt='4rem' variant='accent' sx={{alignSelf: 'flex-end'}}>
                        <Flex sx={{alignItems: 'center'}}>
                            next
                            <Box ml='1rem' sx={{transform: 'rotate(180deg)'}}>
                                {/* <NextImage width='30px' height='30px' src={arrowBackSvg} /> */}
                            </Box>
                        </Flex>
                    </Button>
                </>,
                [Stage.rewardConfig]: <>
                    <NavigateBack href='#createEvent' >
                        to event
                    </NavigateBack>
                    <Flex mt='2rem' sx={{alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text as='h2'>
                            Participation Rewards
                        </Text>
                        <Button variant='accentSmall' onClick={beforeEventCreation}>
                            skip
                        </Button>
                    </Flex>
                    <Flex mt='3rem' sx={{flexDirection: 'column'}}>
                        {/* <Flex mt='3rem'>
                            <Flex sx={{alignItems: 'center', flex: 1}}>
                                <Switch value={+isUpgradableEventReward} checked={isUpgradableEventReward} id="isUpgradableEventReward" onChange={() => setIsUpgradableEventReward(!isUpgradableEventReward)} />
                                <Label htmlFor="isUpgradableEventReward" variant='forms.label.switch'>
                                    upgradable NFTs
                                </Label>
                            </Flex>
                            <Tooltip />
                        </Flex> */}
                        <Flex sx={{flexDirection: 'column', alignItems: 'center'}}>
                            <Flex>
                                <Text mr='1rem'>
                                    how to upload nft files
                                </Text>
                                <Tooltip />
                            </Flex>
                            <Box mt='2rem'>
                                <FileUploader onChange={onNFTFilesUpload} subtitle='add NFT files' />
                            </Box>
                            {/* <Text mt='2rem' variant='hint'>
                                file structure primer
                            </Text>
                            <Container mt='.5rem' variant='layout.container.image' sx={{width: '15rem'}}>
                                <NextImage src={isUpgradableEventReward ? upgradableEventRewardImage : simpleEventRewardImage} objectFit='cover' />
                            </Container> */}
                            <Button onClick={beforeEventCreation} mt='4rem' variant='accent' sx={{alignSelf: 'center'}}>
                                complete
                            </Button>
                        </Flex>
                    </Flex>
                </>,
                [Stage.creatingEvent]: <>
                    <Flex sx={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Spinner />
                        <Text mt='2rem' as='h2'>
                            creating the event
                        </Text>
                        <Text mt='1rem' variant='hint'>
                            might take a minute
                        </Text>
                    </Flex>
                </>
            })[currentStage]}
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
