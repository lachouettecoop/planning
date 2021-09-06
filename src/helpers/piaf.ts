import { PIAF, RoleId } from "src/types/model"

export const getPiafRole = ({ role, piaffeur }: PIAF) => {
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
export const orderPiafsByRoleId = (left: PIAF, right: PIAF) => (left.role.id > right.role.id ? 1 : -1)
