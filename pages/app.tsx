import type { NextPage } from 'next'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { default as NextLink } from 'next/link'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Flex, Box, Button, Heading, useColorMode, useThemeUI, Card, Text, Link, Label, Divider, Spinner } from 'theme-ui'
import { useMoralis, useMoralisFile, useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis"
import { useRouter } from 'next/router'
import tickeroLogo from '../public/logo/logo@0.5x.png'
import Menu from '../components/menu'
import Wallet from '../components/wallet'
import { APITypes, useWeb3APIProvider } from 'helpers/contract'
import { AppContextProvider } from '../helpers/context'
import { MoralisProvider } from "react-moralis"

const EventForm = dynamic(() => import('../components/eventForm'), {
    loading: () => <Spinner sx={{margin: '20rem auto', transform: 'translateY(-50%)'}} />
})

const EventPage = dynamic(() => import('../components/eventPage'), {
    loading: () => <Spinner sx={{margin: '20rem auto', transform: 'translateY(-50%)'}} />
})

const Main: NextPage = () => {
    enum Routes {
        Menu,
        EventForm,
        EventPage,
        // Collectives
    }

    const router = useRouter()
    const [routerPath, setRouterPath] = useState<Routes>()
    const Moralis = useMoralis()
    const MoralisWeb3Api = useMoralisWeb3Api()

    const web3APIProvider = useWeb3APIProvider(APITypes.Moralis, {Moralis, MoralisWeb3Api})

    const contextData = {
        web3APIProvider
    }

    useEffect(() => {
        console.log(Moralis.isInitialized, Moralis.isWeb3Enabled, Moralis.isAuthenticated, Moralis.isAuthenticating)
        Moralis.isInitialized && (
            (!Moralis.isWeb3Enabled && Moralis.enableWeb3({ provider: "walletconnect" }).then(() => {
                !Moralis.isAuthenticated && !Moralis.isAuthenticating && enableAPI()
            }))
        )

    }, [Moralis.isInitialized])

    useEffect(() => {
        setRouterPath(({
            '/app': Routes.Menu,
            '/app#createEvent': Routes.EventForm,
            '/app#event': Routes.EventPage,
            '/app#eventRewards': Routes.EventForm,
            // '/app#collectives': Routes.Collectives
        })[router.asPath.split('?')[0] || '/app'])
    }, [router.asPath])

    const enableAPI = async () => {
        await Moralis.authenticate({ provider: "walletconnect" })
            .then(function (user) {
                console.log(user!.get("ethAddress"));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <AppContextProvider value={contextData}>
            <Flex bg='gradient' sx={{flexDirection: 'column'}}>
                <Box sx={{width: ['3.5rem', '3rem', '5rem'], top: '4rem', left: '2rem', position: 'absolute'}}>
                    <Image src={tickeroLogo} alt="logo" layout='fill' objectFit='contain'></Image>
                </Box>
                <Wallet />
                {Moralis.isAuthenticated && (routerPath !== undefined) && ({
                    [Routes.Menu]: <Menu />,
                    [Routes.EventForm]: <EventForm />,
                    [Routes.EventPage]: <EventPage />,
                    // [Routes.Collectives]: <EventPage />
                })[routerPath]}
                <Flex as='nav' variant='styles.nav' sx={{alignItems: 'center', gap: '3rem', position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: '2rem'}}>
                    <Box>
                        <NextLink href='/app' passHref>
                            <Link variant='nav'>
                                home
                            </Link>
                        </NextLink>
                    </Box>
                    <Divider variant='styles.hr.nav' />
                    {/* <Box>
                        <NextLink href='/app#collectives' passHref>
                            <Link variant='nav'>
                                collectives
                            </Link>
                        </NextLink>
                    </Box>
                    <Divider variant='styles.hr.nav' /> */}
                    <Box sx={{position: 'relative'}}>
                        <Box variant='styles.navLabel'>
                            <Text variant='hint'>soon</Text>
                        </Box>
                        <NextLink href='/' passHref>
                            <Link variant='navDisabled'>
                                DAO
                            </Link>
                        </NextLink>
                    </Box>
                </Flex>
            </Flex>
        </AppContextProvider>
    )
}

// const MoralisWrapper: React.FC = () =>
//     <MoralisProvider appId={process.env.MORALIS_APP_ID} serverUrl={process.env.MORALIS_SERVER_URL}>
//         <Main />
//     </MoralisProvider>

export default Main
