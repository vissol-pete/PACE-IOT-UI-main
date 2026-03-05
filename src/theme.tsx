import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    common: {
      black: "#000",
      white: "#fff",
    },
    primary: {
      main: "#193561",
      dark: "#001E4D",
      light: "#00A5A8",
      //   selected: "#A4DAD6",
    },
    secondary: {
      main: "#6D51A4",
      dark: "#543B85",
      light: "#977CCC",
    },
    background: {
      default: "#FFFFFF",
    },
    text: {
      primary: "#37393C",
      secondary: "#687178",
      disabled: "#969CA2",
      // hint: "#969CA2",
    },
    divider: "#E2E9F4",
  },
  typography: {
    fontFamily: ["Lato", "sans-serif"].join(","),
    h1: {
      fontSize: "2rem", // 32px
      fontWeight: 700,
      lineHeight: 1.25,
      textTransform: "uppercase",
      // letterSpacing: "0.2rem",
    },
    h2: {
      fontSize: "1.5rem", //24px
      fontWeight: 700,
      lineHeight: 1.25,
      textTransform: "uppercase",
    },
    h3: {
      fontSize: "1.25rem", // 20px
      fontWeight: 700,
      lineHeight: 1.25,
      textTransform: "uppercase",
    },
    h4: {
      fontSize: "1rem", // 16px
      fontWeight: 700,
      lineHeight: 1.25,
      textTransform: "uppercase",
    },
    h5: {
      fontSize: "0.875rem", // 14px
      fontWeight: 700,
      lineHeight: 1.25,
      textTransform: "uppercase",
    },
    h6: {
      fontSize: "0.75rem", // 12px
      fontWeight: 700,
      lineHeight: 1.25,
      textTransform: "uppercase",
    },
    body1: {
      fontSize: "1rem", // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem", // 14px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: "1rem", // 16px
      fontWeight: 400,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: "0.875rem", // 14px
      fontWeight: 400,
      lineHeight: "1.75",
    },
    button: {
      textTransform: "uppercase",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
        containedPrimary: {
          boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.15)",
          '&:hover': {
            boxShadow: "0px 6px 25px 0px rgba(0, 0, 0, 0.20)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
  shadows: [
    ...createTheme().shadows, // Keep all default shadows
  ]
  // shadow: {
  //   elevation_1: "0px 0px 4px 0px rgba(65, 77, 92, 0.20), 0px 1px 14px 0px rgba(0, 7, 22, 0.14)",
  //   elevation_2: "0px 4px 20px 0px rgba(0, 7, 22, 0.12)",
  // },
});

// Override specific shadow levels
theme.shadows[1] = "0px 0px 4px 0px rgba(65, 77, 92, 0.20), 0px 1px 14px 0px rgba(0, 7, 22, 0.14)";
theme.shadows[2] = "0px 4px 20px 0px rgba(0, 7, 22, 0.12)";

export default theme;
