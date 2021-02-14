import { createContext, useContext, useState, FC } from "react"
import { addWeeks, startOfWeek } from "date-fns"

export interface IDatePlanningContext {
  start: Date
  end: Date
  goBack: () => void
  goForward: () => void
}

const NUM_WEEKS = 4
const DatePlanningContext = createContext<IDatePlanningContext>({} as IDatePlanningContext)

export const DatePlanningProvider: FC = ({ children }) => {
  const now = new Date()
  const [start, setStart] = useState<Date>(startOfWeek(now, { weekStartsOn: 1 }))
  const [end, setEnd] = useState<Date>(addWeeks(start, NUM_WEEKS))

  const goBack = () => {
    setStart(addWeeks(start, -1))
    setEnd(addWeeks(end, -1))
  }

  const goForward = () => {
    setStart(addWeeks(start, 1))
    setEnd(addWeeks(end, 1))
  }

  return (
    <DatePlanningContext.Provider value={{ start, end, goBack, goForward }}>{children}</DatePlanningContext.Provider>
  )
}

export function useDatePlanning() {
  return useContext(DatePlanningContext) as IDatePlanningContext
}
