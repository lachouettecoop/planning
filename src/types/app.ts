import { CreneauGenerique, PIAF } from "src/types/model"

export interface ISlot {
  id: string
  title: string
  start: Date
  end: Date
  piafs: PIAF[]
}

export interface IDay {
  start: Date
  slots: ISlot[]
}

export interface IWeek {
  start: Date
  days: IDay[]
}

export interface IReserve {
  day: number
  slots: CreneauGenerique[]
}

export type IStatus = "available" | "replacement" | "occupied"
