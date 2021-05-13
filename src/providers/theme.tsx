import type { FC } from "react"

import { createMuiTheme, ThemeProvider as MUIThemeProvider, Theme as MUITheme } from "@material-ui/core/styles"
import { frFR as dataGridLocale } from "@material-ui/data-grid"
import { CssBaseline } from "@material-ui/core"
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react/macro"
import { frFR as coreLocale } from "@material-ui/core/locale"

// see public/index.html
const TITLE_FONT = "Montserrat, sans-serif" // https://style.lachouettecoop.fr/#/typographie?a=titres-et-sous-titres
const TEXT_FONT = "Cabin, sans-serif" // https://style.lachouettecoop.fr/#/typographie?a=texte

const MAIN_COLOR = "#445448" // https://style.lachouettecoop.fr/#/couleurs
const SECONDARY_COLOR = "#9e9e9e" // material grey 500

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends MUITheme {}
}

const THEME = createMuiTheme(
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
  },
  coreLocale,
  dataGridLocale
)

const ThemeProvider: FC = ({ children }) => (
  <EmotionThemeProvider theme={THEME}>
    <MUIThemeProvider theme={THEME}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  </EmotionThemeProvider>
)

export default ThemeProvider
