import { Role } from "src/types/model"

export enum RoleId {
  GH = "/api/roles/1",
  Chouettos = "/api/roles/2",
  Cassier = "/api/roles/3",
  Comptable = "/api/roles/4",
  GH_Formation = "/api/roles/5",
  Cassier_Formation = "/api/roles/6",
  Cassier_Acc = "/api/roles/7",
  GH_Acc = "/api/roles/8",
  AdminMAG = "/api/roles/9",
  AdminBdM = "/api/roles/10",
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
      return roles.find(({ id }) => id === idRequiredRole) || roles.find(({ id }) => id === RoleId.Cassier_Formation)
    case RoleId.GH:
      return roles.find(({ id }) => id === idRequiredRole) || roles.find(({ id }) => id === RoleId.GH_Formation)
    default:
      return roles.find(({ id }) => id === idRequiredRole)
  }
}

export const hasRoleFormation = (roles: Role[]) => {
  return roles.find(({ id }) => id === RoleId.GH_Formation) || roles.find(({ id }) => id === RoleId.Cassier_Formation)
}
