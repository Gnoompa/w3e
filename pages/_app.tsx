import normalizeCss from 'normalize.css'
import resetCss from '../styles/reset.css'
import globalCss from '../styles/index.css'
import theme from '../styles/theme'
import { useAmp } from 'next/amp'
import { ThemeProvider } from 'theme-ui'
import type { AppProps } from 'next/app'
import { StyledEngineProvider } from '@mui/material/styles';
import tickerPrinterImage from '../public/ticketPrinter.png'
import { Flex, Box } from '@components/index'
import Image from 'next/image'
import NextLink from 'next/link'
import { Button, Heading, useColorMode, useThemeUI, Text, Link } from 'theme-ui'

function MyApp({ Component, pageProps }: AppProps) {
  const isAmp = useAmp()

  return (
    <>
      {!isAmp &&
        <style>{`
          ${resetCss}
          ${normalizeCss}
          ${globalCss}
      `}</style>
      }
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default MyApp
