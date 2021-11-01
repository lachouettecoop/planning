import { PIAF, RoleId } from "src/types/model"

export const getPiafRole = ({ role, piaffeur }: PIAF) => {
  if (!role) {
    return null
  }
  if (piaffeur) {
    if (role.roleUniqueId === RoleId.GrandHibou && !piaffeur.nbPiafGH) {
      return RoleId.GrandHibou_Formation
    }
    if (role.roleUniqueId === RoleId.Caissier && !piaffeur.nbPiafCaisse) {
      return RoleId.Caissier_Formation
    }
  }
  return role.roleUniqueId
}

export const isTaken = (piaf: PIAF) => {
  if (piaf.statut === "remplacement") {
    return false
  }
  return Boolean(piaf.piaffeur)
}

export const orderPiafsByDate = (left: PIAF, right: PIAF) => (left.creneau.debut > right.creneau.debut ? 1 : -1)
export const orderPiafsByRoleId = (left: PIAF, right: PIAF) => {
  if (!left.role) {
    return -2
  }
  if (!right.role) {
    return 2
  }
  return left.role.id > right.role.id ? 1 : -1
}
