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
    text: "#333",
		textAccent: "#EC2CB6",
    textSecondary: "#3F3F3F",
    textContrast: "#fff",
    textContrastSecondary: "#BCBCBC",
    accentPrimary: "#202020",
		accentPrimaryContrast: "#2E2E2E",
    accentPrimaryFaded: "#0000000F",
    accentSecondary: "#3396FE",
    border: "#C4C4C4",
  },
	radii: {
		sm: "8px",
		md: "18px"
	},
  fontSizes: {
    "xxx-large": "6rem",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "1em",
        py: "1.5em",
        textTransform: "capitalize",
        fontWeight: "bold",
        maxWidth: "fit-content",
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
				secondary: props => ({
					borderRadius: 'sm',
					height: "2.5rem",
					py: 0,
					px: "1rem"
				})
      },
    },
    Link: {
      baseStyle: {
        color: "textSecondary",
      },
    },
		Input: {
			baseStyle: {
				field: {
					borderColor: "border",
				},
				addon: {
					borderColor: "border",
				}
      },
		},
		Textarea: {
			baseStyle: {
        borderColor: "border",
      },
		},
    Container: {
      baseStyle: {
        maxWidth: "initial",
				px: "0"
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
					width: "100vw"
				},
				undersceen: {
					boxShadow: "0 -30px 45px #00000082"
				},
				contrast: {
					borderRadius: "md",
					bg: "accentPrimary",
					px: "2rem",
					py: "2rem",
				},
				contrastAccent: {
					bg: "accentPrimaryContrast",
					borderRadius: "md",
					px: ["1rem", "1.5rem"],
					py: ["1rem", "1rem"]
				},
        fileUploader: {
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          border: "1px solid #C4C4C4",
          borderColo: "border",
          borderRadius: "md",
          width: "9rem",
          height: "7rem",
					color: "textContrast",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          bg: "accentPrimary",
        },
				scanner: {
					video: {
						borderRadius: "md"
					}
				}
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
				textTransform: "capitalize"
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
				lineHeight: "1em"
			}
		},
    Highlight: {
      baseStyle: {
        color: "textContrast",
        fontWeight: "bold",
      },
    },
  },
});

export default theme;
