import { differenceInDays } from "date-fns"
import type { ISlot } from "src/types/app"

import { PIAF, RoleId } from "src/types/model"

const CRITICAL_DAYS = 5 // until how many days ahead a slot can be critical
const CRITICAL_MINIMUM_TAKEN = 3 // minimum number of taken PIAFs to not be a critical slot

export const getPiafRole = ({ role }: PIAF) => {
  if (!role) {
    return null
  }
  return role.roleUniqueId
}

export const isTaken = (piaf: PIAF) => {
  if (piaf.statut === "remplacement") {
    return false
  }
  return Boolean(piaf.piaffeur)
}

export const isCritical = (slot: ISlot, piaf: PIAF) => {
  if (!slot.piafs) {
    return false
  }
  if (differenceInDays(slot.start, new Date()) > CRITICAL_DAYS) {
    return false
  }
  const countTaken = slot.piafs.filter(isTaken).length
  return (
    countTaken < CRITICAL_MINIMUM_TAKEN ||
    piaf.role?.roleUniqueId == RoleId.GrandHibou ||
    piaf.role?.roleUniqueId == RoleId.Caissier
  )
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
