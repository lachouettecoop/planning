import PropTypes from "prop-types"
import { Navigate } from "react-router-dom"

import { useUser } from "src/providers/user"
import { hasAtLeastOneRole } from "src/helpers/role"
import { RoleId } from "src/types/model"

interface Props {
  roleIds: RoleId[]
  redirectionPath: string
  children: React.ReactNode
}

const RestrictedRoute = ({ children, roleIds, redirectionPath }: Props) => {
  const { user } = useUser<true>()
  return <>{user && (hasAtLeastOneRole(roleIds, user.rolesChouette) ? children : <Navigate to={redirectionPath} />)}</>
}
RestrictedRoute.propTypes = {
  roleIds: PropTypes.arrayOf(PropTypes.oneOf(Object.values(RoleId))),
  redirectionPath: PropTypes.string,
  children: PropTypes.node,
}

export default RestrictedRoute
