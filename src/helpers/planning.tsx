import { Creneau } from "src/types/model"

export const orderSlotsByDate = (left: Creneau, right: Creneau) => (left.debut > right.debut ? 1 : -1)
