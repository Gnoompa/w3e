import normalizeCss from '../node_modules/normalize.css/normalize.css'
import resetCss from '../styles/reset.css'
import globalCss from '../styles/index.css'
import theme from '../styles/theme'
import { useAmp } from 'next/amp'
import { ThemeProvider } from 'theme-ui'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { StyledEngineProvider } from '@mui/material/styles'

function MyApp({ Component, pageProps }: AppProps) {
  const isAmp = useAmp()

  return (
    <>
      <Head>
        <title>Tickero</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {!isAmp &&
          <style>{`
            ${resetCss}
            ${normalizeCss}
            ${globalCss}
        `}</style>
        }
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default MyApp
