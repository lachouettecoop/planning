import { createContext, useContext, useState, FC } from "react"
import { addWeeks, subSeconds, subWeeks, startOfWeek } from "date-fns"

export interface IDatePlanningContext {
  start: Date
  end: Date
  goBack: () => void
  goForward: () => void
}

const NUM_WEEKS = 4
const DatePlanningContext = createContext<IDatePlanningContext>({} as IDatePlanningContext)

const getInitialStart = () => startOfWeek(new Date(), { weekStartsOn: 1 })
const getInitialEnd = () => subSeconds(addWeeks(getInitialStart(), NUM_WEEKS), 1)

export const DatePlanningProvider: FC = ({ children }) => {
  const [start, setStart] = useState<Date>(getInitialStart)
  const [end, setEnd] = useState<Date>(getInitialEnd)

  const goBack = () => {
    setStart(subWeeks(start, 1))
    setEnd(subWeeks(end, 1))
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
