import { Role, RoleId } from "src/types/model"

export const hasRole = (id: RoleId, roles: Role[]) => {
  return roles.some(({ roleUniqueId }) => roleUniqueId === id)
}

export const hasAtLeastOneRole = (roleIds: RoleId[], rolesUser: Role[]) => {
  return rolesUser.some(({ roleUniqueId }) => roleIds.includes(roleUniqueId))
}

export const formatRoles = (roles: Role[]) => roles.map(({ libelle }) => libelle).join(", ")
