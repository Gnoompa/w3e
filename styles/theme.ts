import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: ["#202020", "bg"],
      },
    }),
  },
  colors: {
    bg: "#F1F1F1",
    bgAccent: "#fff",
    text: "#333",
    textAccent: "#EC2CB6",
    textSecondary: "#3F3F3F",
    textContrast: "#fff",
    textContrastSecondary: "#747474",
    accentPrimary: "#202020",
    accentPrimaryContrast: "#2E2E2E",
    accentPrimaryFaded: "#0000000F",
    accentSecondary: "#3396FE",
    border: "#C4C4C4",
  },
  radii: {
    sm: "8px",
    md: "18px",
    lg: "36px",
  },
  fontSizes: {
    "xxx-large": "6rem",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "md",
        py: "1.5em",
        textTransform: "capitalize",
        fontWeight: "bold",
      },
      sizes: {
        sm: {
          fontSize: "md",
        },
        md: {
          px: "2em",
        },
      },
      variants: {
        outline: {
          border: ".15em solid",
          borderColor: "bg",
          color: "bg",
          py: "1.25em",
          _hover: {
            color: "black",
            borderColor: "black",
          },
        },
        ghost: {
          fontWeight: "md",
          textTransform: "none",
        },
        outlineAccent: (props) => ({
          ...theme.components.Button.variants.outline(props),
          borderColor: "accentSecondary",
          color: "accentSecondary",
        }),
        walletConnect: (props) => ({
          bg: "accentPrimary",
          color: "textContrast",
        }),
        accent: (props) => ({
          color: "textContrast",
          bg: "accentSecondary",
        }),
        secondary: (props) => ({
          borderRadius: "sm",
          height: "2.5rem",
          py: 0,
          px: "1rem",
        }),
      },
    },
    Link: {
      baseStyle: {
        color: "textSecondary",
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: "border",
            _focusVisible: {
              borderColor: "accentSecondary",
            },
            _hover: {
              borderColor: "accentSecondary",
            },
          },
          addon: {
            borderColor: "border",
            bg: "bgAccent",
          },
        },
      },
      sizes: {
        md: {
          field: {
            py: "1.5rem",
          },
          addon: {
            py: "1.5rem",
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          borderColor: "border",
        },
      },
    },
    Container: {
      baseStyle: {
        maxWidth: "initial",
        px: "0",
      },
      variants: {
        mainNav: {
          borderBottom: "1px solid",
          borderColor: "border",
          bg: "bg",
          zIndex: "overlay",
        },
        padded: {
          px: ["1rem", "2rem"],
        },
        fullscreen: {
          width: "100vw",
        },
        undersceen: {
          boxShadow: "0 -45px 45px #00000082",
        },
        simple: {
          borderRadius: "lg",
          bg: "bgAccent",
          px: ["1.5rem", "1.5rem", "2rem"],
          py: "2rem",
        },
        contrast: {
          borderRadius: "lg",
          bg: "accentPrimary",
          px: "2rem",
          py: "2rem",
        },
        contrastAccent: {
          bg: "accentPrimaryContrast",
          borderRadius: "md",
          px: ["1rem", "1.5rem"],
          py: ["1rem", "1rem"],
        },
        fileUploader: {
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          border: "1px dashed",
          borderColor: "border",
          borderRadius: "md",
          height: "7rem",
          color: "textContrast",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          bg: "bgContrast",
        },
        scanner: {
          video: {
            borderRadius: "md",
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            borderColor: "border",
						height: "50px"
          },
        },
      },
    },
    Tabs: {
      baseStyle: {
        tab: {
          alignSelf: "center",
          color: "text",
          mr: ".5em",
          h: "2.5em",
          borderRadius: ".5em",
          bg: "accentPrimaryFaded",
          _selected: {
            bg: "accentPrimary",
            color: "textContrast",
          },
        },
        tabpanel: {
          padding: "0",
        },
      },
    },
    Heading: {
      baseStyle: {
        textTransform: "capitalize",
      },
      variants: {
        contrast: {
          color: "textContrast",
        },
        contrastFaded: {
          color: "textContrastSecondary",
        },
      },
    },
    Text: {
      baseStyle: {
        lineHeight: "1em",
      },
    },
    Highlight: {
      baseStyle: {
        color: "textContrast",
        fontWeight: "bold",
      },
    },
    Form: {
      variants: {
        floating: {
          helperText: {
            px: "1rem",
            mt: ".25rem",
            fontSize: "sm",
          },
          container: {
            _focusWithin: {
              label: {
                transform: "scale(0.85) translateY(-26px)",
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                transform: "scale(0.85) translateY(-26px)",
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
							fontSize: ["sm", "sm", "sm", "md"],
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: ".5rem",
              my: ".75rem",
              transformOrigin: "left top",
              ".chakra-form__required-indicator": {
                color: "textAccent",
              },
            },
          },
        },
      },
    },
  },
});

export default theme;
