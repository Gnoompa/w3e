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
    textContrastAccent: "#BCBCBC",
    accentPrimary: "#202020",
    accentPrimaryContrast: "#2E2E2E",
    accentPrimaryFaded: "#0000000F",
    accentSecondary: "#3396FE",
    border: "#C4C4C4",
    warn: "#FFB21C",
    success: "#4caf50",
    accentGradient: "linear-gradient(194.04deg, #3396FE 0%, #00FFFF 100%)",
    accentGradientSecondary:
      "linear-gradient(0deg, rgba(253,171,7,1) 0%, rgba(246,119,66,1) 34%, rgba(221,46,0,1) 100%)",
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
        cursor: "pointer",
        _hover: {
          opacity: 0.7,
          // bg: "accentSecondary !important",
        },
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
          py: "22px",
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
          _hover: {
            bg: "accentSecondary !important",
          },
        }),
        secondary: (props) => ({
          borderRadius: "sm",
          height: "2.5rem",
          fontSize: "sm",
          py: 0,
          px: [".5rem", "1rem"],
        }),
        icon: {
          py: "1.25rem",
          px: "1.25rem",
          bg: "bg",
          textTransform: "none",
          borderRadius: "sm",
        },
        socialIcon: {
          py: "1.25rem",
          px: "1.25rem",
          bg: "bg",
          textTransform: "none",
          borderRadius: "lg",
        }
      },
    },
    CloseButton: {
      baseStyle: {
        color: "accentPrimaryContrast",
      },
    },
    Link: {
      baseStyle: {
        color: "textSecondary",
        fontWeight: "medium",
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
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "border",
          bg: "#f1f1f1d1",
          zIndex: "overlay",
        },
        padded: {
          px: ["1rem", "2rem"],
        },
        fullscreen: {
          width: "100vw",
        },
        undersceen: {
          boxShadow: "0 -125px 45px #000000a6",
        },
        scrollableOverlap: {
          overflowX: "scroll",
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        simple: {
          borderRadius: "lg",
          bg: "bgAccent",
          px: ["1.5rem", "1.5rem", "2rem"],
          py: "2rem",
        },
        contrast: {
          borderRadius: "lg",
          bg: "#111",
          px: "3rem",
          py: "3rem",
        },
        contrastAccent: {
          bg: "accentPrimary",
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
        graphics: {
          borderRadius: "md",
          overflow: "hidden",
          px: 0,
          marginInlineStart: 0,
          marginInlineEnd: 0,
          width: "5rem",
        },
        graphicsSmall: (props) => ({
          ...theme.components.Container.variants.graphics,
          width: "3rem",
          borderRadius: "sm",
        }),
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            borderColor: "border",
            height: "50px",
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
      variants: {
        switch: {
          tablist: {
            bg: "accentPrimaryContrast",
            borderRadius: "md",
            px: "0",
            py: ".5rem",
            ".switchTabIndicator": {
              position: "absolute",
              bg: "accentPrimary",
              height: "calc(100% - .5rem)",
              top: ".25rem",
              borderRadius: "14px",
            },
          },
          tab: {
            px: "2rem",
            color: "textContrast",
            bg: "transparent",
            zIndex: "docked",
            mr: 0,
            fontWeight: "bold",
            _selected: {
              color: "textContrast",
              bg: "transparent",
            },
          },
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
          color: "textContrastAccent",
        },
      },
    },
    Text: {
      baseStyle: {},
      variants: {
        accent: {
          backgroundClip: "text",
          textFillColor: "transparent",
          backgroundImage:
            "linear-gradient(194.04deg, #3396FE 0%, #00FFFF 100%)",
        },
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
          errorText: {
            px: "1rem",
            mt: ".25rem",
            fontSize: "sm",
          },
          container: {
            textarea: {
              transition: "margin-top .5s",
            },
            _focusWithin: {
              textarea: {
                mt: "1rem",
              },
              label: {
                transform: "scale(0.85) translateY(-26px)",
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                transform: "scale(0.85) translateY(-26px)",
              },
            "textarea:not(:placeholder-shown)": {
              mt: "1rem",
            },
            label: {
              top: 0,
              left: 0,
              mt: 0,
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
    Badge: {
      variants: {
        solid: {
          py: ".15rem",
          px: ".5rem",
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          p: ".5rem",
        },
        item: {
          _focus: {
            borderRadius: "sm",
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: "lg",
        },
      },
    },
  },
});

export const fadeTopSlideAnimation = {
  true: { opacity: 1, y: 0 },
  false: { opacity: 0, y: "-20px" },
};

export const fadeRightSlideAnimation = {
  true: { opacity: 1, x: 0 },
  false: { opacity: 0, x: "20px" },
};

export default theme;
