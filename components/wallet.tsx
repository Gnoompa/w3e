import { useState, useRef, SyntheticEvent, useEffect, useContext } from 'react'
import { Link, Flex, Box, Button, Text, Label, Input, Container, Textarea, Divider } from "theme-ui"
import { useMoralis, MoralisProvider, useMoralisWeb3Api } from "react-moralis"
import personIcon from '../styles/icons/person.svg'
import Image from 'next/image'
import { AppContext } from '../pages/context'
import OutsideClickHandler from 'react-outside-click-handler'

const Menu = () => {
    const context = useContext(AppContext)
    const { Moralis, authenticate, isAuthenticated, user } = useMoralis()
    const Web3Api = useMoralisWeb3Api()
    const walletButtonRef = useRef()
    const [isWalletDialogToggled, setIsWalletDialogToggled] = useState(false)
    const walletLabel = isAuthenticated ? 'my account' : 'sign in'
    const walletAddress = user?.get('ethAddress')
    const walletAddressLabel = walletAddress ? `${walletAddress.slice(0, 5)}...${walletAddress.slice(-3)}` : ''

    useEffect(() => {
        context.formattedWalletAddress = walletAddressLabel
    }, [walletAddressLabel])

    const connectWallet = (): Promise<any> =>
        authenticate({ provider: 'walletconnect' })
            .catch(console.error)

    const onWalletButtonClick = (): void => {
        isAuthenticated
            ? toggleWalletDialog()
            : connectWallet()
    }

    const toggleWalletDialog = (): void => {
        setIsWalletDialogToggled(!isWalletDialogToggled)
    }

    const hideWalletDialog = (): void => {
        setTimeout(() => isWalletDialogToggled && setIsWalletDialogToggled(false))
    }

    return (
        <Flex sx={{position: 'absolute', top: '4rem', right: '2rem'}}>
            <Button variant='primary' ref={walletButtonRef} onClick={onWalletButtonClick} sx={{zIndex: 1}}>
                <Box sx={{width: '1em', height: '1em', lineHeight: '0em'}}>
                    <Image src={personIcon} alt='person icon' objectFit='contain' />
                </Box>
                <Text>
                    {walletLabel}
                </Text>
            </Button>
            {isWalletDialogToggled &&
                <OutsideClickHandler
                    onOutsideClick={hideWalletDialog}
                    useCapture={true}
                    display='contents'
                >
                    <Container variant='layout.container.popup'>
                        <Flex sx={{flexDirection: 'column'}}>
                            <Text variant='secondary'>
                                wallet address: {walletAddressLabel}
                            </Text>
                            <Box sx={{alignSelf: 'center'}}>
                                <Button variant='primary' mt='1em'>sign out</Button>
                            </Box>
                        </Flex>
                    </Container>
                </OutsideClickHandler>
            }
        </Flex>
    )
}

export default Menu
