import type { NextPage } from 'next'
import Image from 'next/image'
import { default as NextLink } from 'next/link'
import { useEffect, useState } from 'react'
import { Flex, Box, Button, Heading, useColorMode, useThemeUI, Card, Text, Link, Label } from 'theme-ui'
import { useRouter } from 'next/router'
import tickeroLogo from '../public/logo/logo@0.5x.png'
import notepadPicture from '../public/notepad/notepad@0.5x.png'
import sharePicture from '../public/share/share@0.5x.png'
import walletsPicture from '../public/wallets/wallets@0.75x.png'
import verifyPicture from '../public/verify/verify@0.5x.png'
import { Parallax, ParallaxProvider } from 'react-scroll-parallax'
import { MoralisProvider } from 'react-moralis'
import Pulse from 'react-reveal/Pulse'


const Index: NextPage = () => {
  const [colorMode, setColorMode] = useColorMode()
  const router = useRouter()
  const [colorModeOpposite, setColorModeOpposite] = useState<String>('')
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true)
  const [shouldShowTicketForm, setShouldShowTicketForm] = useState<boolean>(false)

  useEffect(() => {
    setColorModeOpposite(colorMode == 'light' ? 'dark' : 'light')
  }, [colorMode])

  useEffect(() => {
    isWalletConnected && setShouldShowTicketForm(true)
  }, [isWalletConnected])

  const onToggleColorModeButtonClick = (): void => {
    setColorMode(colorMode == 'light' ? 'dark' : 'light')
  }

  const onConnectWalletButtonClick = (): void => {

  }

  return (
    <MoralisProvider
      appId="nqUifo7bhYwPUOb9YonrC6eJ1eLndO2lCHKXZqmz"
      serverUrl="https://lhy1mjmm823t.usemoralis.com:2053/server"
    >
      <ParallaxProvider>
        <Flex bg='bg' sx={{flexDirection: 'column', maxWidth: '100%'}}>
          <Flex sx={{flexDirection: 'column', width: '100%', maxWidth: '1280px', position: 'relative', margin: '0 auto'}}>
            <Flex sx={{height: '100vh', minHeight: '45rem', position: 'relative'}}>
              <Box sx={{position: 'absolute', top: '5%', right: '3rem'}}>
                {/* <NextLink href='/'>
                  <Link>🏠</Link>
                </NextLink> */}
                <NextLink href='/about'>
                  <Link ml='2rem'>about</Link>
                </NextLink>
              </Box>
              <Box sx={{width: ['3.5rem', '3rem', '10rem'], top: '5%', left: '2rem', position: 'absolute'}}>
                <Image src={tickeroLogo} alt="logo" layout='fill' objectFit='contain'></Image>
              </Box>
              <Flex sx={{flexDirection: 'column', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1}}>
                <Flex sx={{alignItems: 'end'}}>
                  <Heading as='h3' sx={{textTransform: 'uppercase', letterSpacing: '.25em'}}>
                    meet
                  </Heading>
                  <Heading ml='.25em' sx={{WebkitTextStroke: '3px rgba(34, 9, 35, 0.69)', fontSize: '2.5rem', letterSpacing: '.25em', lineHeight: '2.5rem'}}>
                    TICKERO
                  </Heading>
                </Flex>
                <Box sx={{height: '1.5em'}}>
                  <Box mt='.5rem' mb='.5rem' sx={{position: 'absolute', background: 'gradient', width: 'calc(50vw + 50%)', height: '.5em'}} />
                </Box>
                <Box>
                  <Heading as='h1' sx={{fontSize: '1rem', letterSpacing: '.2em'}}>
                    ticketing on blockchain
                  </Heading>
                </Box>
                <Box mt='10rem' ml='50%' sx={{position: 'absolute', transform: 'translateX(-50%)'}}>
                  <Link href='/app'>
                    <Button variant='accent'>
                      enter app
                    </Button>
                  </Link>
                </Box>
              </Flex>
              <Box ml='50%' sx={{transform: 'translateX(-50%)', position: 'absolute', bottom: '1rem'}}>
                <Flex sx={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text mb='1rem' variant='hint'>scroll for more</Text>
                  <svg xmlns="http://www.w3.org/2000/svg" width="91" height="103" viewBox="0 0 91 103" fill="none"> <g filter="url(#filter0_d_133_28)"> <path d="M4 47.7273C4 38.7636 14.6067 34.0247 21.2835 40.0052L24.75 43.1101C28.758 46.7001 35.125 43.8554 35.125 38.4747V10.9555C35.125 8.71369 35.8592 6.53352 37.2152 4.74831C41.2013 -0.499122 49.0295 -0.683117 53.2577 4.37125L53.4333 4.58116C55.0107 6.46682 55.875 8.84702 55.875 11.3055V38.4747C55.875 43.8554 62.242 46.7001 66.25 43.1101L69.7165 40.0052C76.3933 34.0247 87 38.7636 87 47.7273C87 50.0854 86.196 52.3731 84.7208 54.2127L56.8792 88.9322C54.1109 92.3844 49.9251 94.3932 45.5 94.3932C41.0749 94.3932 36.8891 92.3844 34.1208 88.9322L6.2792 54.2127C4.80396 52.3731 4 50.0854 4 47.7273Z" fill="url(#paint0_linear_133_28)"/> <path d="M5.5 47.7273C5.5 40.0606 14.572 36.0074 20.2827 41.1225L23.7492 44.2274C28.7233 48.6827 36.625 45.1524 36.625 38.4747V10.9555C36.625 9.04139 37.2518 7.17991 38.4097 5.65565C41.8131 1.17525 48.497 1.01815 52.1072 5.3337L52.2828 5.5436C53.6344 7.15938 54.375 9.1989 54.375 11.3055V38.4747C54.375 45.1524 62.2767 48.6827 67.2508 44.2274L70.7173 41.1225C76.428 36.0074 85.5 40.0606 85.5 47.7273C85.5 49.7442 84.8124 51.7008 83.5506 53.2743L55.709 87.9938C53.2254 91.091 49.47 92.8932 45.5 92.8932C41.53 92.8932 37.7747 91.091 35.291 87.9938L7.44942 53.2743C6.18763 51.7008 5.5 49.7442 5.5 47.7273Z" stroke="white" strokeWidth="3"/> </g> <defs> <filter id="filter0_d_133_28" x="0" y="0.693848" width="91" height="101.699" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"> <feFlood floodOpacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset dy="4"/> <feGaussianBlur stdDeviation="2"/> <feComposite in2="hardAlpha" operator="out"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_133_28"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_133_28" result="shape"/> </filter> <linearGradient id="paint0_linear_133_28" x1="-7.95524" y1="-179.138" x2="121.689" y2="-168.806" gradientUnits="userSpaceOnUse"> <stop stopColor="#F342F3"/> <stop offset="0.4" stopColor="#ECB5FF"/> <stop offset="0.75" stopColor="#BDD7FF"/> <stop offset="1" stopColor="#ECF4FF"/> </linearGradient> </defs> </svg>
                </Flex>
              </Box>
            </Flex>
            <Flex mt='10%' sx={{position: 'relative', minWidth: '35rem', flexDirection: 'column', alignSelf: 'center', maxWidth: '50rem'}}>
              <Parallax speed={-10} style={{marginTop: '0rem', width: '100%'}}>
                  <Box sx={{position: 'absolute', transform: 'translateX(-50%)', borderRadius: '15rem', padding: '15rem', background: 'gradient'}} />
                  <Box sx={{position: 'absolute', transform: 'translateX(-60%) rotateZ(315deg)', filter: 'opacity(0.8) blur(4px)', borderRadius: '12rem', top: '50rem', padding: '12rem', background: 'gradient2'}} />
                  <Box sx={{position: 'absolute', transform: 'translateX(50%) rotateZ(35deg)', right: 0, top: '30rem', filter: 'opacity(0.6) blur(2px)', borderRadius: '15rem', padding: '10rem', background: 'gradient2'}} />
                  <Box sx={{position: 'absolute', transform: 'translateX(50%) rotateZ(215deg)', filter: 'opacity(0.8) blur(8px)', left: '60%', top: '80rem', borderRadius: '6rem', padding: '6rem', background: 'gradient'}} />
              </Parallax>
              <Flex sx={{flexDirection: 'column', alignItems: 'center', gap: '7rem'}}>
                <Pulse>
                  <Card variant='info' sx={{background: 'radial-gradient(92.21% 174.12% at 31.07% 100%, rgba(204, 45, 255, 0.28) 0%, rgba(255, 255, 255, 0.196) 100%)'}}>
                    <Flex sx={{flexDirection: 'column'}}>
                      <Text variant='infoHeader' as='h2'>
                        create an event
                      </Text>
                      <Text mt='.75rem' variant='infoContent' as='h3'>
                        each event is a unique NFT
                      </Text>
                      <Box mt='2rem' mb='-6rem' sx={{alignSelf: 'center'}}>
                        <Image src={notepadPicture} width='300px' height={'200px'} objectFit='contain' layout='fill' alt='notepad picture' />
                      </Box>
                    </Flex>
                  </Card>
                </Pulse>
                <Pulse>
                  <Card variant='info' sx={{background: 'radial-gradient(91.23% 91.23% at 50.15% 91.23%, rgba(199, 13, 52, 0.28) 0%, rgba(255, 255, 255, 0.196) 100%)'}}>
                    <Flex sx={{flexDirection: 'column'}}>
                      <Text variant='infoHeader' as='h2'>
                        sell tickets
                      </Text>
                      <Text mt='.75rem' variant='infoContent' as='h3'>
                        choose the beneficiary and a pricing model
                        <br/><br/>
                        Tickets are also NFTs!
                      </Text>
                      <Box mt='2rem' mb='-6rem' sx={{alignSelf: 'center'}}>
                        <Image src={sharePicture} width='300px' height={'200px'} objectFit='contain' alt='share picture' />
                      </Box>
                    </Flex>
                  </Card>
                </Pulse>
                <Pulse>
                  <Card variant='info' sx={{background: 'radial-gradient(92.21% 174.12% at 31.07% 100%, rgba(12, 90, 255, 0.28) 0%, rgba(255, 255, 255, 0.196) 100%)'}}>
                    <Flex sx={{flexDirection: 'column'}}>
                      <Text variant='infoHeader' as='h2'>
                        wallet friendly
                      </Text>
                      <Text mt='.75rem' variant='infoContent' as='h3'>
                        events and tickets will display in your wallet
                      </Text>
                      <Box mt='2rem' mb='-7rem' sx={{alignSelf: 'center'}}>
                        <Image src={walletsPicture} width='300px' height={'200px'} objectFit='contain' alt='share picture' />
                      </Box>
                    </Flex>
                  </Card>
                </Pulse>
                <Pulse>
                  <Card variant='info' sx={{background: 'radial-gradient(92.21% 174.12% at 31.07% 100%, rgba(204, 11, 73, 0.28) 0%, rgba(255, 255, 255, 0.196) 100%)'}}>
                    <Flex sx={{flexDirection: 'column'}}>
                      <Text variant='infoHeader' as='h2'>
                        proof of attendance
                      </Text>
                      <Text mt='.75rem' mb='-1rem' variant='infoContent' as='h3'>
                        attendance is proovable by  non-transferable NFT
                      </Text>
                      <Box mt='2rem' mb='-9rem' sx={{alignSelf: 'center', transform: 'rotate(315deg)'}}>
                        <Image src={verifyPicture} width='300px' height={'250px'} objectFit='contain' alt='share picture' />
                      </Box>
                    </Flex>
                  </Card>
                </Pulse>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </ParallaxProvider>
    </MoralisProvider>
  )
}

export default Index
