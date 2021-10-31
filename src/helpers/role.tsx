import { Role, RoleId, User } from "src/types/model"

export const getTrainerRoleId = (id: RoleId) => {
  switch (id) {
    case RoleId.Caissier:
      return RoleId.Caissier_Acc
    case RoleId.GrandHibou:
      return RoleId.GrandHibou_Acc
    default:
      return null
  }
}

export const hasRole = (id: RoleId, roles: Role[]) => {
  return roles.find(({ roleUniqueId }) => roleUniqueId === id)
}

export const needsTraining = (user: User | null, roleId: RoleId) => {
  if (user) {
    if (roleId == RoleId.GrandHibou) {
      return !user.nbPiafGH
    } else if (roleId == RoleId.Caissier) {
      return !user.nbPiafCaisse
    }
  }
  return false
}

export const formatRoles = (roles: Role[]) => roles.map(({ libelle }) => libelle).join(", ")
