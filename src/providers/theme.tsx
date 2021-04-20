import type { FC } from "react"

import { createMuiTheme, ThemeProvider as MUIThemeProvider } from "@material-ui/core/styles"
import { CssBaseline } from "@material-ui/core"

// see public/index.html
const TITLE_FONT = "Montserrat, sans-serif"
const TEXT_FONT = "Cabin, sans-serif"
export const MAIN_COLOR = "#445448"

const THEME = createMuiTheme({
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
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
})

const ThemeProvider: FC = ({ children }) => (
  <MUIThemeProvider theme={THEME}>
    <CssBaseline />
    {children}
  </MUIThemeProvider>
)

export default ThemeProvider
