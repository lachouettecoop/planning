import InfoIcon from "@material-ui/icons/Info"

import type { PIAF } from "src/types/model"

import styled from "@emotion/styled/macro"

import { RoleId } from "src/types/model"
import { getPiafRole, isTaken } from "src/helpers/piaf"
import { Tooltip } from "@material-ui/core"

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

const InfoIconPiaf = styled(InfoIcon)`
  position: absolute;
  z-index: 10;
  left: -5px;
  top: 0px;
  height: 1rem !important;
`

const ImageContainer = styled.div`
  position: relative;
`

interface RoleProps {
  role?: RoleId | null
  taken?: boolean
  critical?: boolean
  info?: string
}

export const PiafIcon = ({ role, taken, critical, info }: RoleProps) => {
  if (!role || !KNOWN_ROLES.includes(role)) {
    role = RoleId.Chouettos
  }
  return (
    <Tooltip title={info ? info : ""}>
      <ImageContainer>
        {info && <InfoIconPiaf />}
        <Svg $taken={taken} $critical={critical}>
          <use xlinkHref={"#" + role} width="100%" height="100%" />
        </Svg>
      </ImageContainer>
    </Tooltip>
  )
}

interface Props {
  piaf: PIAF
  critical?: boolean
  displayTooltip?: boolean | false
}

const PiafCircle = ({ piaf, critical, displayTooltip }: Props) => (
  <>
    <PiafIcon
      role={getPiafRole(piaf)}
      taken={isTaken(piaf)}
      critical={critical}
      info={displayTooltip ? piaf.informations || "" : ""}
    />
  </>
)

export default PiafCircle
