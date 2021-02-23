import { PIAF } from "src/types/model"

export interface ISlot {
  id: string
  title: string
  start: Date
  end: Date
  piafs: PIAF[]
}

export interface IDay {
  date: Date
  slots: ISlot[]
}

export interface IWeek {
  date: Date
  days: IDay[]
}
