import { PIAF } from "src/types/model"

import styled from "@emotion/styled/macro"

type Status = "available" | "replacement"

const STATUS_COLORS: Record<Status, string> = {
  available: "green",
  replacement: "orange",
}

export const PiafIcon = styled.span<{ $status?: Status }>`
  flex-shrink: 0;
  display: inline-block;
  text-align: center;
  background-color: #ccc;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${({ $status }) => ($status ? STATUS_COLORS[$status] : "grey")};
`

const getStatus = (piaf: PIAF): Status | undefined => {
  if (!piaf.piaffeur && piaf.statut !== "remplacement") {
    return "available"
  }
  if (piaf.statut === "remplacement") {
    return "replacement"
  }
}

const ROLE_INITIALS: Record<string, string> = {
  Caissier: "C",
  "Grand Hibou": "GH",
}

interface Props {
  piaf: PIAF
}

const Piaf = ({ piaf }: Props) => {
  return <PiafIcon $status={getStatus(piaf)}>{ROLE_INITIALS[piaf.role.libelle] || ""}</PiafIcon>
}

export default Piaf
