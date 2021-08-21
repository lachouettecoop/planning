import type { PIAF, RoleId } from "src/types/model"

import styled from "@emotion/styled/macro"

import { getPiafRole, isTaken } from "src/helpers/piaf"

import ICONS from "src/images/icons"

const getImg = (role?: RoleId) => {
  if (role) {
    const img = ICONS[role]
    if (img) {
      return `url(${img})`
    }
  }
  return "none" // TODO
}

const getRoleText = (role?: string) => {
  if (getImg(role as RoleId) === "none") return role
}

export const PiafIcon = styled.span<{ $taken?: boolean; $role?: RoleId }>`
  flex-shrink: 0;
  display: inline-block;
  margin: 3px;
  width: 32px;
  height: 32px;
  background-image: ${({ $role }) => getImg($role)};
  background-size: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  opacity: ${({ $taken }) => ($taken ? 0.25 : 1)};
`

interface Props {
  piaf: PIAF
}

const PiafCircle = ({ piaf }: Props) => (
  <PiafIcon $taken={isTaken(piaf)} $role={getPiafRole(piaf)}>
    {getRoleText(getPiafRole(piaf))}
  </PiafIcon>
)

export default PiafCircle
