import normalizeCss from '../node_modules/normalize.css/normalize.css'
import resetCss from '../styles/reset.css'
import globalCss from '../styles/index.css'
import theme from '../styles/theme'
import { useAmp } from 'next/amp'
import { ThemeProvider } from 'theme-ui'
import type { AppProps } from 'next/app'
import { StyledEngineProvider } from '@mui/material/styles'
import { MoralisProvider } from "react-moralis"

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
          <MoralisProvider appId={process.env.MORALIS_APP_ID} serverUrl={process.env.MORALIS_SERVER_URL}>
            <Component {...pageProps} />
          </MoralisProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export default MyApp
