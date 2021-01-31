import { BrowserRouter } from "react-router-dom"

import { useUser } from "src/providers/user"

import Anonymous from "./pages/anonymous"
import Authenticated from "src/pages/authenticated"

const App = () => {
  const { user } = useUser()

  return (
    <BrowserRouter>
      {user ? (
        <div>
          <Authenticated />
        </div>
      ) : (
        <Anonymous />
      )}
    </BrowserRouter>
  )
}

export default App
