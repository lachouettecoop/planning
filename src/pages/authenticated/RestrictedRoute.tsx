import { ComponentType } from "react"
import { Redirect, Route } from "react-router-dom"

import { useUser } from "src/providers/user"
import { hasAtLeastOneRole } from "src/helpers/role"
import { RoleId } from "src/types/model"

interface Props {
  path: string
  component: ComponentType<any>
  roleIds: RoleId[]
  redirectionPath: string
}

const RestrictedRoute = ({ path, component, roleIds, redirectionPath }: Props) => {
  const { user } = useUser<true>()
  return (
    <>
      {user &&
        (hasAtLeastOneRole(roleIds, user.rolesChouette) ? (
          <Route path={path} component={component} />
        ) : (
          <Redirect to={redirectionPath} />
        ))}
    </>
  )
}

export default RestrictedRoute
