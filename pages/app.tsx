import type { NextPage } from 'next'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { default as NextLink } from 'next/link'
import { useEffect, useState } from 'react'
import { Flex, Box, Button, Heading, useColorMode, useThemeUI, Card, Text, Link, Label, Divider, Spinner } from 'theme-ui'
import { useRouter } from 'next/router'
import tickeroLogo from '../public/logo/logo@0.5x.png'
import Menu from '../components/menu'
import Wallet from '../components/wallet'
import { AppContextProvider, data as contextData } from '../components/context'
import { MoralisProvider } from "react-moralis"

const EventForm = dynamic(() => import('../components/eventForm'), {
    loading: () => <Spinner sx={{margin: '20rem auto', transform: 'translateY(-50%)'}} />
})

const Main: NextPage = () => {
    const router = useRouter()
    const [routerPath, setRouterPath] = useState('')

    useEffect(() => {
        setRouterPath(router.asPath)
    }, [router.asPath])

    return (
        <MoralisProvider appId='nqUifo7bhYwPUOb9YonrC6eJ1eLndO2lCHKXZqmz' serverUrl='https://lhy1mjmm823t.usemoralis.com:2053/server'>
            <AppContextProvider value={contextData}>
                <Flex bg='gradient' sx={{flexDirection: 'column'}}>
                    <Box sx={{width: ['3.5rem', '3rem', '5rem'], top: '4rem', left: '2rem', position: 'absolute'}}>
                        <Image src={tickeroLogo} alt="logo" objectFit='contain'></Image>
                    </Box>
                    <Wallet />
                    {({
                        '/app': <Menu />,
                        '/app#createEvent': <EventForm />
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
        </MoralisProvider>
    )
}

export default Main
