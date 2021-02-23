import { createContext, useContext, useState, FC } from "react"
import { startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns"

export interface IDatePlanningContext {
  start: Date
  end: Date
  goBack: () => void
  goForward: () => void
  goToday: () => void
}

const DatePlanningContext = createContext<IDatePlanningContext>({} as IDatePlanningContext)

const getInitialStart = () => startOfMonth(new Date())
const getInitialEnd = () => endOfMonth(new Date())

export const DatePlanningProvider: FC = ({ children }) => {
  const [start, setStart] = useState<Date>(getInitialStart)
  const [end, setEnd] = useState<Date>(getInitialEnd)

  const goBack = () => {
    setStart(subMonths(start, 1))
    setEnd(subMonths(end, 1))
  }

  const goForward = () => {
    setStart(addMonths(start, 1))
    setEnd(addMonths(end, 1))
  }

  const goToday = () => {
    setStart(new Date())
    setEnd(addWeeks(new Date(), NUM_WEEKS))
  }

  return (
    <DatePlanningContext.Provider value={{ start, end, goBack, goForward, goToday }}>
      {children}
    </DatePlanningContext.Provider>
  )
}

export function useDatePlanning() {
  return useContext(DatePlanningContext) as IDatePlanningContext
}
