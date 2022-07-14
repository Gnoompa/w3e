import React, { useRef, useState, useMemo, useEffect, SyntheticEvent, BaseSyntheticEvent, MouseEventHandler, useContext, ReactElement } from 'react'
import { Flex, Box, Button, Label, Input, Text, Container, Textarea, Switch, Spinner, SxProp, ThemeUIStyleObject, Link } from "theme-ui"
import { NavigateBack, Tooltip, Field, LocationPicker, TimespanPicker, FileUploader } from '@components/index'
import { useDebounce, handleOnMouseDown, formatWalletAddress } from 'helpers/hooks'
import OutsideClickHandler from 'react-outside-click-handler'
import { BigNumber, ethers } from 'ethers'
import NextImage from 'next/image'
import { Location } from './ui/locationPicker'
import { Timespan } from './ui/timespanPicker'
import { Portal } from 'react-portal'
import walletIcon from '../styles/icons/wallet.svg'
import arrowBackSvg from '../styles/icons/arrowBack.svg'
import pictureIcon from '../styles/icons/picture.svg'
import cameraIcon from '../styles/icons/camera.svg'
import crossIcon from '../styles/icons/cross.svg'
import { useRouterQuery } from 'helpers/hooks'
import dynamic from 'next/dynamic'
import { Stage, Layer, Text as KonvaText, Image } from "react-konva";
import { useRouter } from 'next/router'
import { AppContext } from '../helpers/context'

const QrScanner = dynamic(() => import('./ui/qrScanner'), {
    ssr: false
})

const EventPage = () => {
    enum Stage {

    }

    const router = useRouter()
    const context = useContext(AppContext)
    const {web3APIProvider} = useContext(AppContext)
    const routerQuery = useRouterQuery(router)
    // const [currentStage, setCurrentStage] = useState<Stage>(Stage.eventConfig)

    useEffect(() => {
        routerQuery.id ? fetchEvent(routerQuery.id) : router.push('/app')
    }, [])

    const fetchEvent = (eventTokenId: number): Promise<any> => {
        web3APIProvider.getEvent({params: {eventTokenId})
    }

    const onQrScanResult = (result: string): void => {
        // setScannedBeneficiaryAddress(result)
    }

    return (
        <Flex sx={{flexDirection: 'column', width: '22rem', margin: '31rem auto', transform: 'translateY(-50%)'}}>
            eventPage
        </Flex>
    )
}

export default EventPage
