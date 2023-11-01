import { createTheme, ThemeProvider as MUIThemeProvider, Theme as MUITheme } from "@mui/material/styles"
import { frFR as dataGridLocale } from "@mui/x-data-grid"
import { CssBaseline } from "@mui/material"
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react/macro"
import { frFR as coreLocale } from "@mui/material/locale"
import { grey } from "@mui/material/colors"

import { ReactComponent as Icons } from "src/images/icons.svg"
import { ReactFCWithChildren } from "src/types/react"

// see public/index.html
const TITLE_FONT = "Montserrat, sans-serif" // https://style.lachouettecoop.fr/#/typographie?a=titres-et-sous-titres
const TEXT_FONT = "Cabin, sans-serif" // https://style.lachouettecoop.fr/#/typographie?a=texte

const MAIN_COLOR = "#3A5447" // https://style.lachouettecoop.fr/#/couleurs
const SECONDARY_COLOR = grey[500]

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends MUITheme {}
}

const THEME = createTheme(
  {
    typography: {
      fontFamily: TEXT_FONT,
      body1: {
        fontFamily: TEXT_FONT,
        fontSize: "1rem",
      },
      body2: {
        fontFamily: TEXT_FONT,
        fontSize: "1rem",
      },
      subtitle1: {
        fontFamily: TITLE_FONT,
      },
      subtitle2: {
        fontFamily: TITLE_FONT,
      },
      h1: {
        fontFamily: TITLE_FONT,
        fontWeight: 600,
        fontSize: "2.5rem",
      },
      h2: {
        fontFamily: TITLE_FONT,
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h3: {
        fontFamily: TITLE_FONT,
        fontWeight: 600,
        color: MAIN_COLOR,
      },
      h4: {
        fontFamily: TITLE_FONT,
      },
      h5: {
        fontFamily: TITLE_FONT,
      },
      h6: {
        fontFamily: TITLE_FONT,
      },
    },
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: MAIN_COLOR,
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
      secondary: {
        main: SECONDARY_COLOR,
      },
      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      contrastThreshold: 3,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            color: MAIN_COLOR,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "1rem",
          },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            marginBottom: "1rem",
          },
        },
      },
    },
  },
  coreLocale,
  dataGridLocale,
)

const ThemeProvider: ReactFCWithChildren = ({ children }) => (
  <EmotionThemeProvider theme={THEME}>
    <MUIThemeProvider theme={THEME}>
      <CssBaseline />
      <Icons />
      {children}
    </MUIThemeProvider>
  </EmotionThemeProvider>
)

export default ThemeProvider
