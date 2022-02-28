import { differenceInDays } from "date-fns"
import type { ISlot, IWeekId } from "src/types/app"

import { PIAF, RoleId } from "src/types/model"

export const CRITICAL_DAYS = 5 // until how many days ahead a slot can be critical
const CRITICAL_RATIO = 75 // % minimum ratio of taken PIAFs to not be a critical slot

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
  if (isTaken(piaf)) {
    return false
  }
  if (!slot.piafs) {
    return false
  }
  if (slot.horsMag) {
    return false
  }
  if (differenceInDays(slot.start, new Date()) > CRITICAL_DAYS) {
    return false
  }
  if (slot.title.toLowerCase().toString().startsWith("formation")) {
    return false
  }
  if (piaf.role?.roleUniqueId == RoleId.GrandHibou || piaf.role?.roleUniqueId == RoleId.Caissier) {
    return true
  }
  // TODO: we might want to calculate a ratio per type of slot instead of overall
  const countTaken = slot.piafs.filter(isTaken).length
  const ratio = (100 * countTaken) / slot.piafs.length
  return ratio < CRITICAL_RATIO
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

export const getWeekId = (creneauGenerique: string): IWeekId => {
  const num = Number(creneauGenerique)
  return num ? String.fromCharCode(64 + num) : creneauGenerique
}
