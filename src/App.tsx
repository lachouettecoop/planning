import { BrowserRouter } from "react-router-dom"

import { useUser } from "src/providers/user"

import Anonymous from "src/pages/anonymous"
import Authenticated from "src/pages/authenticated"

const App = () => {
  const { auth } = useUser()

  return <BrowserRouter>{auth ? <Authenticated /> : <Anonymous />}</BrowserRouter>
}

export default App
