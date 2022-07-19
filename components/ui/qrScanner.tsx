import { ethers } from 'ethers';
import QrScannerAdapter from 'qr-scanner'
import { formatWalletAddress } from 'helpers/hooks';
import { useEffect, useRef, useState } from 'react';
import { Flex, Container, Text } from 'theme-ui';

type QrScannerProps = {
    showResult?: boolean;
    onResult?: (result: string) => any;
    onError?: (error: any) => any
}

export const QrScanner = (props: QrScannerProps) => {
    const videoRef = useRef()

    const [result, setResult] = useState('')
    const [resultLabel, setResultLabel] = useState('scanning for wallet address QR...')

    useEffect(() => {
        let scanner = new QrScannerAdapter(
            videoRef.current,
            setResult,
            {
                highlightScanRegion: true
            }
        )

        scanner.start().then(() => {}, props.onError)

        return () => scanner.stop()
    }, [])

    const formatAddress = (address: string): string|undefined =>
        address ? [...(address.match(/0x[a-fA-F0-9]{40}/) || [])][0] : undefined

    useEffect(() => {
        let formattedAddress = formatAddress(result?.data)

        formattedAddress
            && ethers.utils.isAddress(formattedAddress)
            && props.onResult(formattedAddress)

        props.showResult && formattedAddress && setResultLabel('scanned wallet address: ' + formatWalletAddress(formattedAddress))
    }, [result])

    return (
        <Container variant='layout.container.video'>
            <Flex sx={{flexDirection: 'column', alignItems: 'center'}}>
                <video style={{width: '100%'}} ref={videoRef} />
                <Text mt='.5rem' variant='hint' sx={{whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {resultLabel}
                </Text>
            </Flex>
        </Container>
    )
}

QrScanner.defaultProps = {
    showResult: true
}

export default QrScanner
