import type { ColorMode, Theme as ThemeType } from "theme-ui";

class DarkThemeFactory {
    primary = '#F1E7C6'
    bg = '#1F2421'
    background = '#1F2421'
    text = '#F1E7C6'
}

const darkTheme: ColorMode = {...(new DarkThemeFactory())}

const ButtonStyles = {
    cursor: 'pointer',
    whiteSpace: 'nowrap'
}

const labelStyles = {
    fontSize: '1.25rem',
    fontWeight: 500
}

const boxShadow = '4px 4px 4px rgba(167, 127, 169, 0.18)'
const borderRadius = '1.75rem'

const Theme: ThemeType = {
    breakpoints: ['40em', '52em', '64em'],
    config: {
        initialColorModeName: 'light',
        useColorSchemeMediaQuery: false
    },
    fonts: {
        body: 'inter',
        heading: 'inter'
    },
    colors: {
        text: '#220923',
        background: '#ECDEEC',
        bg: '#ECDEEC',
        primary: '#1F2421',
        gradient: 'linear-gradient(95deg, #F342F3 -28.36%, #ECB5FF 29.02%, #BDD7FF 79.22%, #ECF4FF 115.08%)',
        gradient2: 'linear-gradient(94.24deg, #FF8DFF -28.89%, rgba(243, 66, 243, 0.66) 6.46%, rgba(228, 0, 10, 0.38) 27.51%, rgba(165, 226, 226, 0.19) 87.69%, rgba(217, 217, 217, 0) 115.49%, #E46ED9 115.51%)',
        modes: {
            dark: darkTheme
        }
    },
    buttons: {
        accent: {
            ...ButtonStyles,
            border: '3px solid #fff',
            boxShadow,
            background: 'gradient',
            borderRadius: '2em',
            color: 'text',
            fontWeight: 600,
            padding: '.75em 2em',
            fontSize: '1.25rem'
        }
    },
    styles: {
        a: {
            textDecoration: 'underline',
            fontWeight: 800,
            fontSize: '1.25rem',
            cursor: 'pointer'
        }
    },
    text: {
        paragraph: {
            fontSize: '1rem'
        },
        hint: {
            color: '#CAAECA',
            letterSpacing: '2px'
        },
        infoHeader: {
            fontSize: '2rem',
            letterSpacing: '.15em'
        },
        infoContent: {
            fontSize: '1.25rem',
            letterSpacing: '.1em',
            lineHeight: '1.25em',
            fontWeight: 500
        }
    },
    forms: {
        label: labelStyles,
        contrast: {
            ...labelStyles,
            color: 'bg'
        }
    },
    cards: {
        info: {
            width: '33rem',
            borderRadius: '3rem',
            minHeight: '10rem',
            padding: '2rem 3rem',
            backdropFilter: 'blur(20px)'
        }
    },
    layout: {
        container: {
            bg: 'primary',
            p: '3rem 2rem',
            outline: '3px dashed var(--theme-ui-colors-primary)'
        }
    }
}

export default Theme
