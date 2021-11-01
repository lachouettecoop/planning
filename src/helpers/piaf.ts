import { PIAF } from "src/types/model"

export const getPiafRole = ({ role }: PIAF) => {
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
