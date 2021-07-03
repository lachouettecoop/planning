import { RoleId } from "src/types/model"

import CA from "./ca.svg"
import CAA from "./caa.svg"
import CAF from "./caf.svg"
import CH from "./ch.svg"
import GH from "./gh.svg"
import GHA from "./gha.svg"
import GHF from "./ghf.svg"

import P from "./piaf.svg"
import F from "./formation.svg"
import A from "./acc.svg"

//TODO: add MAG and BDM to remove Partial<>

const ICONS: Partial<Record<RoleId, string>> = { CA, CAA, CAF, CH, GH, GHA, GHF, P, F, A }

export default ICONS
