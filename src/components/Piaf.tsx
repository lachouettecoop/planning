import type { PIAF } from "src/types/model"
import type { IStatus } from "src/types/app"

import styled from "@emotion/styled/macro"

import Chouettos from "src/images/chouettos.png"

const STATUS_COLORS: Record<IStatus, string> = {
  available: "white",
  replacement: "orange",
  occupied: "green",
}

const IMAGES: Record<string, string> = {
  Chouettos,
}

const getImg = (role?: string) => {
  if (role) {
    const img = IMAGES[role]
    if (img) {
      return `url(${img})`
    }
  }
}

export const PiafIcon = styled.span<{ $status: IStatus; $role?: string }>`
  flex-shrink: 0;
  display: inline-block;
  margin: 2px;
  width: 32px;
  height: 32px;
  border: 2px solid ${({ $status }) => STATUS_COLORS[$status]};
  border-radius: 50%;
  background-color: #ddd;
  background-image: ${({ $role }) => getImg($role) || "none"};
  background-position: center;
  background-size: 24px;
  background-repeat: no-repeat;
  line-height: 28px;
  text-align: center;
`

export const getStatus = (piaf: PIAF): IStatus => {
  if (piaf.statut === "remplacement") {
    return "replacement"
  }
  if (piaf.piaffeur) {
    return "occupied"
  }
  return "available"
}

const ROLE_INITIALS: Record<string, string> = {
  Caissier: "C",
  "Grand Hibou": "GH",
}

interface Props {
  piaf: PIAF
}

const Piaf = ({ piaf }: Props) => (
  <PiafIcon $status={getStatus(piaf)} $role={piaf.role.libelle}>
    {ROLE_INITIALS[piaf.role.libelle] || ""}
  </PiafIcon>
)

export default Piaf
