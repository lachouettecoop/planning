import { ComponentType } from "react"
import { Redirect, Route, Switch } from "react-router-dom"

import { currentUserIsPA } from "src/helpers/user"
import { useUser } from "src/providers/user"

interface Props {
  path: string
  component: ComponentType<any>
}

const ProtectedRoute = ({ path, component }: Props) => {
  const { user } = useUser<true>()
  return (
    <Switch>
      {user && (currentUserIsPA(user) ? <Redirect to="/planning" /> : <Route path={path} component={component} />)}
    </Switch>
  )
}

export default ProtectedRoute
