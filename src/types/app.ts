import { CreneauGenerique, PIAF, Task } from "src/types/model"

export interface ISlot {
  id: string
  title: string
  information: string
  demiPiaf: boolean
  start: Date
  end: Date
  horsMag: boolean
  piafs?: PIAF[] // undefined = loading
  tasks?: Task[]
}

export interface IDay {
  start: Date
  slots: ISlot[]
}

export type IWeekId = "A" | "B" | "C" | "D" | string

export interface IWeek {
  start: Date
  days: IDay[]
  weekId?: IWeekId
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
