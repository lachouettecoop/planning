import styled from "@emotion/styled/macro"

import { PIAF, RoleId } from "src/types/model"
import ICONS from "src/images/icons"

export const isTaken = (piaf: PIAF) => {
  if (piaf.statut === "remplacement") {
    return false
  }
  return Boolean(piaf.piaffeur)
}

const getImg = (role?: RoleId) => {
  if (role) {
    const img = ICONS[role]
    if (img) {
      return `url(${img})`
    }
  }
  return "none" // TODO
}

export const PiafIcon = styled.span<{ $taken?: boolean; $role?: RoleId }>`
  flex-shrink: 0;
  display: inline-block;
  margin: 3px;
  width: 24px;
  height: 24px;
  background-image: ${({ $role }) => getImg($role)};
  background-size: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: ${({ $taken }) => ($taken ? 0.25 : 1)};
`

interface Props {
  piaf: PIAF
}

const PiafCircle = ({ piaf }: Props) => <PiafIcon $taken={isTaken(piaf)} $role={piaf.role.roleUniqueId} />

export default PiafCircle
