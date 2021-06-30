import { RoleId } from "src/types/model"

import CA from "./ca.svg"
import CAA from "./caa.svg"
import CAF from "./caf.svg"
import CH from "./ch.svg"
import GH from "./gh.svg"
import GHA from "./gha.svg"
import GHF from "./ghf.svg"

//TODO: add MAG and BDM to remove Partial<>

const ICONS: Partial<Record<RoleId, string>> = { CA, CAA, CAF, CH, GH, GHA, GHF }

export default ICONS
