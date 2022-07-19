import type { ColorMode, Theme as ThemeType } from "theme-ui"
import { keyframes } from '@emotion/react'

class DarkThemeFactory {
    primary = '#F1E7C6'
    bg = '#1F2421'
    background = '#1F2421'
    text = '#F1E7C6'
}

const darkTheme: ColorMode = {...(new DarkThemeFactory())}

const boxShadow = '4px 4px 4px rgba(167, 127, 169, 0.18)'
const intenseBoxShadow = '0px 3px 3px rgb(0 0 0 / 30%)'
const borderRadius = '1em'
const fieldBackground = 'rgba(255, 255, 255, 0.5)'
const transitionDuration = '.2s'
const transition = 'background ' + transitionDuration
const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })

const ButtonStyles = {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    '&:disabled': {
        opacity: '.6'
    }
}

const dialogFieldStyles = {
    background: 'fieldBackground',
    border: 'none',
    color: 'secondaryText',
    outline: 'none',
    fontWeight: 600,
    borderRadius: '.5rem',
    height: '2.75rem',
    padding: '0.75rem 1rem',
    transition,
    '&:focus': {
        background: '#fff'
    },
    '&:read-only': {
        cursor: 'pointer'
    },
    '&:disabled': {
        cursor: 'not-allowed',
        color: 'light',
        boxShadow: 'none'
    },
    '&:disabled::placeholder': {
        cursor: 'not-allowed',
        color: 'light'
    },
    '&::-webkit-calendar-picker-indicator': {
        color: 'secondaryText',
        opacity: .7,
        marginRight: '-.5rem'
    },
    '&::-webkit-time-picker-indicator': {
        color: 'secondaryText'
    },
    '::placeholder': {
        color: 'secondaryText'
    },
    boxShadow
}

const containerPopupStyles = {
    zIndex: 2,
    position: 'absolute',
    top: 'calc(100% + .5rem)',
    borderRadius,
    animation: `${fadeIn} .2s backwards`,
    background: 'gradient',
    padding: '1em 1.5em',
    width: 'max-content',
    boxShadow,
    minWidth: '10rem'
}

const buttonWeekdaySelectorStyles = {
    background: fieldBackground,
    color: 'secondaryText',
    fontWeight: 600,
    padding: '1rem 0',
    borderRadius: 0,
    width: '2.75rem',
    borderRight: '1px solid white',
    fontSize: '.75rem',
    cursor: 'pointer',
    outline: 'none',
    transition,
    '&:last-child': {
        borderRight: 'none'
    }
}

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
        secondaryText: '#624E63',
        light: '#A77FA9',
        background: '#ECDEEC',
        fieldBackground: '#f5f2f4',
        dialogFieldBackground: 'linear-gradient(95deg, #F342F3 -28.36%, #ECB5FF 29.02%, #BDD7FF 79.22%, #ECF4FF 115.08%)',
        foreground: '#f5edf47d',
        bg: '#ECDEEC',
        primary: '#1F2421',
        gradient: 'linear-gradient(95deg, #F342F3 -28.36%, #ECB5FF 29.02%, #BDD7FF 79.22%, #ECF4FF 115.08%)',
        gradient2: 'linear-gradient(94.24deg, #FF8DFF -28.89%, rgba(243, 66, 243, 0.66) 6.46%, rgba(228, 0, 10, 0.38) 27.51%, rgba(165, 226, 226, 0.19) 87.69%, rgba(217, 217, 217, 0) 115.49%, #E46ED9 115.51%)',
        invalid: 'linear-gradient(90deg, #FF0000 0.41%, #FF8DFF 100.41%), linear-gradient(0deg, #FFFFFF, #FFFFFF)',
        dialog: 'radial-gradient(117.47% 137.15% at 20.35% 117.81%, #EE99FD 0%, #ECDEEC 100%)',
        dialogHover: 'radial-gradient(117.47% 137.15% at 20.35% 117.81%, #EE99FD 0%, #f3cef3 100%)',
        modes: {
            dark: darkTheme
        }
    },
    buttons: {
        primary: {
            boxShadow: '0px 2px 2px rgb(0 0 0 / 12%), inset 0px 2px 2px rgb(0 0 0 / 12%)',
            whiteSpace: 'nowrap',
            background: '#ecaffe',
            border: '3px solid #fff',
            color: 'text',
            fontSize: '1.25rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '.5em',
            borderRadius: '1em',
            padding: '.5em 1em',
            cursor: 'pointer',
            transition: transitionDuration,
            ':hover': {
                color: 'text'
            }
        },
        accent: {
            ...ButtonStyles,
            boxShadow,
            whiteSpace: 'nowrap',
            background: 'linear-gradient(180deg, #FFFFFF -4.48%, #E6E0E6 100%)',
            borderRadius: '.75em',
            color: 'text',
            fontWeight: 600,
            padding: '.75em 1em',
            fontSize: '1.25rem'
        },
        accentSmall: {
            ...ButtonStyles,
            boxShadow,
            background: fieldBackground,
            borderRadius: '.75em',
            color: 'text',
            fontWeight: 600,
            padding: '.75em 1em',
            fontSize: '1rem'
        },
        formNav: {
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: 400,
            color: 'secondaryText',
            background: 'none',
            padding: 0,
            cursor: 'pointer'
        },
        weekdaySelector: buttonWeekdaySelectorStyles,
        weekdaySelectorActive: {
            ...buttonWeekdaySelectorStyles,
            background: '#fff'
        },
        link: {
            background: 'none',
            textDecoration: 'underline',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'text'
        },
        toggle: {
            background: 'none',
            color: 'text',
            fontSize: '1.25rem',
            fontWeight: 600,
            padding: '1em 2em',
            whiteSpace: 'nowrap',
        },
        fieldDialog: {
            boxShadow,
            whiteSpace: 'nowrap',
            background: 'dialog',
            border: 'none',
            color: 'text',
            fontSize: '1.25rem',
            fontWeight: 600,
            borderRadius: '.5em',
            padding: '.5em 1em',
            cursor: 'pointer',
            transition: transitionDuration,
            ':hover': {
                background: 'dialogHover'
            }
        }
    },
    styles: {
        a: {
            textDecoration: 'underline',
            fontWeight: 800,
            fontSize: '1.25rem',
            cursor: 'pointer',
        },
        nav: {
            background: 'gradient',
            border: '3px solid #fff',
            position: 'fixed',
            padding: '1rem 3rem',
            borderRadius: '1.25rem',
            boxShadow: '0px 2px 2px rgb(0 0 0 / 12%), inset 0px 2px 2px rgb(0 0 0 / 12%)'
        },
        hr: {
            nav: {
                background: '#ffffffb3',
                width: '1px',
                padding: '1.25rem 0',
                marginTop: '-1.5rem',
                marginBottom: '-1.5rem',
                lineHeight: 0
            },
            dialog: {
                color: '#ffffffb3',
                background: '#ffffffb3',
                opacity: '.5',
                height: '1px',
                marginTop: '-.75em',
                marginBottom: '-.75em',
                lineHeight: 0
            },
            vertical: {
                color: '#ffffffb3',
                background: '#ffffffb3',
                width: '1px'
            },
            field: {
                width: '100%',
                background: 'dialog',
                height: '6px',
                border: '1px solid #fff',
                borderRadius: '6px',
                boxShadow,
                marginTop: '-.25rem',
                marginBottom: '-.25rem',
            },
            invalidField: {
                width: '100%',
                background: 'invalid',
                height: '6px',
                border: '1px solid #fff',
                borderRadius: '6px',
                boxShadow,
                marginTop: '-.25rem',
                marginBottom: '-.25rem',
            }
        },
        navLabel: {
            background: '#fff',
            position: 'absolute',
            top: '-2.75rem',
            padding: '0.25rem 1rem 0.4rem',
            lineHeight: '1rem',
            fontSize: '1rem',
            borderRadius: '11px 11px 0px 0px',
            fontWeight: 700,
            left: '50%',
            transform: 'translateX(-50%)'
        },
        dialog: {
            background: 'dialog',
            gap: '1.5em',
            borderRadius: '1.25em',
            padding: '1em 1.5em'
        }
    },
    links: {
        nav: {
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '.1em',
            color: 'text'
        },
        formNav: {
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: 400,
            color: 'secondaryText'
        },
        navDisabled: {
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'text',
            opacity: .5,
            pointerEvents: 'none'
        },
        dialog: {
            textDecoration: 'none',
            fontWeight: 800,
            color: 'text',
            letterSpacing: '.1em'
        }
    },
    text: {
        paragraph: {
            fontWeight: 500,
            fontSize: '1rem'
        },
        hint: {
            color: '#977f97'
        },
        dialogSecondary: {
            color: 'light',
            textDecoration: 'uppercase',
            fontWeight: 800
        },
        dialog: {
            fontSize: '1.25rem',
            letterSpacing: '1px',
            color: 'secondaryText'
        },
        secondary: {
            color: 'text',
            opacity: .5,
            letterSpacing: '1px',
            fontSize: '1rem'
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
        },
        navigation: {
            fontWeight: 500
        },
        fieldIcon: {
            position: 'absolute',
            fontSize: '1.5rem',
            top: '50%',
            left: '1rem',
            pointerEvents: 'none',
            transform: 'translateY(-50%)'
        },
        fieldPostfix: {
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            marginTop: 0,
            transform: 'translateY(-50%)',
            color: 'light',
            fontSize: '1.25rem',
            fontWeight: 700
        },
        fieldSubtitle: {
            fontSize: '.75rem',
            color: 'secondaryText',
            fontWeight: 600
        }
    },
    forms: {
        label: {
            width: 'initial',
            switch: {
                color: 'secondaryText',
                fontWeight: 500,
                width: 'initial'
            }
        },
        switch: {
            color: 'text',
            fontSize: '1.25rem',
            background: 'secondaryText',
            width: '40px',
            'input:focus ~ &': {
                boxShadow: intenseBoxShadow
            }
        },
        input: {
            field: {
                border: 'none',
                outline: 'none',
                fontWeight: 500
            },
            dialogContrast: {
                background: 'dialogFieldBackground',
                border: 'none',
                outline: 'none',
                fontWeight: 500,
            },
            dialog: dialogFieldStyles,
            dialogTransparent: {
                ...dialogFieldStyles,
                background: fieldBackground
            }
        },
        textarea: {
            background: fieldBackground,
            border: 'none',
            borderRadius: '.5rem',
            color: 'secondaryText',
            outline: 'none',
            fontWeight: 600,
            padding: '0.75rem 1rem',
            boxShadow,
            transition,
            maxWidth: '100%',
            '::placeholder': {
                color: 'secondaryText'
            },
            '&:focus': {
                background: '#fff'
            },
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
            popup: containerPopupStyles,
            popupTransparent: {
                ...containerPopupStyles,
                background: 'none',
                boxShadow: 'none',
                padding: 0
            },
            weekdaySelector: {
                boxShadow,
                borderRadius: '.5rem',
                overflow: 'hidden'
            },
            video: {
                'video': {
                    borderRadius: '1.5rem',
                    boxShadow
                }
            },
            image: {
                'img': {
                    borderRadius: '1rem'
                }
            },
            tooltip: {
                cursor: 'help',
                width: '2rem',
                height: '2rem',
                textAlign: 'center',
                paddingTop: '0.12rem',
                border: '3px solid #fff',
                borderRadius: '1rem',
                fontWeight: '800',
                background: 'background',
                position: 'relative'
            },
            fileUploader: {
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                background: 'fieldBackground',
                borderRadius: '0.75em',
                width: '9rem',
                height: '7rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow
            },
            modalBackground: {
                position: 'fixed',
                width: '100%',
                height: '100%',
                background: 'foreground',
                top: 0,
                left: 0,
                animation: `${fadeIn} .2s backwards`,
                backdropFilter: 'blur(5px)'
            },
            field: {
                icon: {
                    justifyContent: 'center',
                    background: 'fieldBackground',
                    width: '2.25rem',
                    position: 'absolute',
                    height: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    right: '0',
                    pointerEvents: 'none',
                    borderRadius: '0 6px 6px 0'
                }
            }
        }
    }
}

export default Theme
