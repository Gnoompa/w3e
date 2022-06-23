import type { NextPage } from 'next'
import Image from 'next/image'
import { default as NextLink } from 'next/link'
import { useEffect, useState } from 'react'
import { Flex, Box, Button, Heading, useColorMode, useThemeUI, Card, Text, Link, Label, Divider } from 'theme-ui'
import { useRouter } from 'next/router'
import { BrowserRouter, Routes, Route } from "react-router-dom"

const Main: NextPage = () => {
  const [colorMode, setColorMode] = useColorMode()
  const router = useRouter()
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true)

  const onConnectWalletButtonClick = (): void => {

  }

  return (
    <Flex bg='gradient' sx={{flexDirection: 'column'}}>
         <BrowserRouter>
            <Routes>
                <Route path="/" element={<Root />}>
                    <Route path="event" element={<EventForm />} />
                </Route>
            </Routes>
        </BrowserRouter>
        <Flex as='nav' variant='styles.nav' sx={{alignItems: 'center', gap: '3rem', position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: '2rem'}}>
            <Box>
                <NextLink href='/' passHref>
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
  )
}

export default Main
