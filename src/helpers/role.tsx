import { Role } from "src/types/model"

export enum RoleId {
  GH = "GH",
  Chouettos = "CH",
  Cassier = "CA",
  GH_Formation = "GHF",
  Cassier_Formation = "CAF",
  Cassier_Acc = "CAA",
  GH_Acc = "GHA",
  AdminMAG = "MAG",
  AdminBdM = "BdM",
}

export const getIdRoleAccompagnateur = (idRole: string) => {
  switch (idRole) {
    case RoleId.Cassier:
      return RoleId.Cassier_Acc
    case RoleId.GH:
      return RoleId.GH_Acc
  }
}

export const hasRole = (idRequiredRole: string, roles: Role[]) => {
  switch (idRequiredRole) {
    case RoleId.Cassier:
      return (
        roles.find(({ roleUniqueId }) => roleUniqueId.toString() === idRequiredRole) ||
        roles.find(({ roleUniqueId }) => roleUniqueId.toString() === RoleId.Cassier_Formation)
      )
    case RoleId.GH:
      return (
        roles.find(({ roleUniqueId }) => roleUniqueId.toString() === idRequiredRole) ||
        roles.find(({ roleUniqueId }) => roleUniqueId.toString() === RoleId.GH_Formation)
      )
    default:
      return roles.find(({ roleUniqueId }) => roleUniqueId === idRequiredRole)
  }
}

export const hasRoleFormation = (roles: Role[]) => {
  return (
    roles.find(({ roleUniqueId }) => roleUniqueId === RoleId.GH_Formation) ||
    roles.find(({ roleUniqueId }) => roleUniqueId === RoleId.Cassier_Formation)
  )
}
