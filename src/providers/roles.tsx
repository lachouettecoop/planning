import type { Role } from "src/types/model"

import { createContext, useContext, FC } from "react"

import { ROLES } from "src/graphql/queries"
import { useQuery } from "@apollo/client"

export interface IRolesContext {
  roles: Role[]
}
type Result = { roles: Role[] }

const RolesContext = createContext<IRolesContext>({} as IRolesContext)

export const RolesProvider: FC = ({ children }) => {
  let roles: Role[] = []

  const { data } = useQuery<Result>(ROLES)

  if (data) {
    roles = data.roles
  }

  return <RolesContext.Provider value={{ roles }}>{children}</RolesContext.Provider>
}

export function useRoles() {
  return (useContext(RolesContext) as IRolesContext).roles
}
