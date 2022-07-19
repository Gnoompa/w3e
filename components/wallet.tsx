import { useState, useRef, SyntheticEvent, useEffect, useContext } from 'react'
import { Link, Flex, Box, Button, Text, Label, Input, Container, Textarea, Divider } from "theme-ui"
import { useMoralis, MoralisProvider, useMoralisWeb3Api } from "react-moralis"
import personIcon from '../styles/icons/person.svg'
import Image from 'next/image'
import { AppContext } from '../helpers/context'
import OutsideClickHandler from 'react-outside-click-handler'

const Menu = () => {
    const {web3APIProvider} = useContext(AppContext)
    const [isWalletDialogToggled, setIsWalletDialogToggled] = useState(false)
    const isAuthenticated = web3APIProvider.isAuthenticated()
    const walletLabel = isAuthenticated ? 'my account' : 'sign in'
    const [walletAddressLabel, setWalletAddressLabel] = useState(web3APIProvider.getEthAddress({short: true}))

    useEffect(() => {
        setWalletAddressLabel(isAuthenticated ? web3APIProvider.getEthAddress({short: true}) : 'not connected')
    }, [isAuthenticated])

    const connectWallet = (): Promise<any> =>
        web3APIProvider.auth({ provider: "walletconnect" })
            .catch(console.error)

    const unauth = (): Promise<any> =>
        web3APIProvider.unauth()
            .catch(console.error)

    const onWalletButtonClick = (): void => {
        web3APIProvider.isAuthenticated()
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
            <Button variant='accent' onClick={onWalletButtonClick} sx={{zIndex: 1}}>
                <Flex>
                    <Box mr='1rem' sx={{width: '1em', height: '1em', lineHeight: '0em'}}>
                        <Image src={personIcon} alt='person icon' objectFit='contain' />
                    </Box>
                    {walletLabel}
                </Flex>
            </Button>
            {isAuthenticated && isWalletDialogToggled &&
                <OutsideClickHandler
                    onOutsideClick={hideWalletDialog}
                    useCapture={true}
                    display='contents'
                >
                    <Container variant='layout.container.popup' sx={{right: 0}}>
                        <Flex sx={{flexDirection: 'column'}}>
                            <Text variant='secondary'>
                                wallet address: {walletAddressLabel}
                            </Text>
                            <Box sx={{alignSelf: 'center'}}>
                                <Button onClick={unauth} variant='accent' mt='1em'>sign out</Button>
                            </Box>
                        </Flex>
                    </Container>
                </OutsideClickHandler>
            }
        </Flex>
    )
}

export default Menu
