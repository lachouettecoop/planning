import { Role, RoleId } from "src/types/model"

export const getIdRoleAccompagnateur = (id: RoleId) => {
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
  switch (id) {
    case RoleId.Caissier:
      return roles.find(
        ({ roleUniqueId }) => roleUniqueId === RoleId.Caissier || roleUniqueId === RoleId.Caissier_Formation
      )
    case RoleId.GrandHibou:
      return roles.find(
        ({ roleUniqueId }) => roleUniqueId === RoleId.GrandHibou || roleUniqueId === RoleId.GrandHibou_Formation
      )
    default:
      return roles.find(({ roleUniqueId }) => roleUniqueId === id)
  }
}

const FORMATION_ROLES = [RoleId.Caissier_Formation, RoleId.GrandHibou_Formation]

export const hasRoleFormation = (roles: Role[]) =>
  roles.find(({ roleUniqueId }) => FORMATION_ROLES.includes(roleUniqueId))

export const formatRoles = (roles: Role[]) => roles.map(({ libelle }) => libelle).join(", ")
