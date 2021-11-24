import type { PIAF } from "src/types/model"

import styled from "@emotion/styled/macro"

import { RoleId } from "src/types/model"
import { getPiafRole, isTaken } from "src/helpers/piaf"

const KNOWN_ROLES = Object.values(RoleId)

const Svg = styled.svg<{ $taken?: boolean; $critical?: boolean }>`
  flex-shrink: 0;
  display: inline-block;
  margin: 3px;
  width: 32px;
  height: 32px;
  opacity: ${({ $taken }) => ($taken ? 0.25 : 1)};
  use {
    fill: ${({ $critical }) => ($critical ? "#e53935" : "black")};
  }
`

interface RoleProps {
  role?: RoleId | null
  taken?: boolean
  critical?: boolean
}

export const PiafIcon = ({ role, taken, critical }: RoleProps) => {
  if (!role || !KNOWN_ROLES.includes(role)) {
    role = RoleId.Chouettos
  }
  return (
    <Svg $taken={taken} $critical={critical}>
      <use xlinkHref={"#" + role} width="100%" height="100%" />
    </Svg>
  )
}

interface Props {
  piaf: PIAF
  critical?: boolean
}

const PiafCircle = ({ piaf, critical }: Props) => (
  <PiafIcon role={getPiafRole(piaf)} taken={isTaken(piaf)} critical={critical} />
)

export default PiafCircle
