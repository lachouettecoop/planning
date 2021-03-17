import { BrowserRouter } from "react-router-dom"

import { useUser } from "src/providers/user"

import Anonymous from "src/pages/anonymous"
import Authenticated from "src/pages/authenticated"

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#445448",
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

const App = () => {
  const { auth } = useUser()

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>{auth ? <Authenticated /> : <Anonymous />}</BrowserRouter>
    </ThemeProvider>
  )
}

export default App
