import { CreneauGenerique, PIAF } from "src/types/model"

export interface ISlot {
  id: string
  title: string
  information: string
  start: Date
  end: Date
  piafs?: PIAF[] // undefined = loading
}

export interface IDay {
  start: Date
  slots: ISlot[]
}

export type IWeekNumber = 1 | 2 | 3 | 4

export interface IWeek {
  start: Date
  days: IDay[]
  weekNumber: IWeekNumber
}

export interface ISlotReserve {
  time: number
  slotDisplayed: CreneauGenerique
  allSlotIds: string[]
}

export interface IReserve {
  day: number
  slots: ISlotReserve[]
}
