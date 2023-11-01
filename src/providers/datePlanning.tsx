import { createContext, useContext, useState } from "react"
import { startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns"
import { ApolloError, ApolloQueryResult, OperationVariables, useQuery } from "@apollo/client"

import { PLANNING } from "src/graphql/queries"
import { Creneau } from "src/types/model"
import { ReactFCWithChildren } from "src/types/react"

export interface IDatePlanningContext {
  start: Date
  end: Date
  goBack: () => void
  goForward: () => void
  goToday: () => void
  data?: Result
  loading: boolean
  error?: ApolloError
  refetch: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<Result>>
}

type Result = { creneaus: Creneau[] }

const DatePlanningContext = createContext<IDatePlanningContext>({} as IDatePlanningContext)

const getInitialStart = () => startOfMonth(new Date())
const getInitialEnd = () => endOfMonth(new Date())

export const DatePlanningProvider: ReactFCWithChildren = ({ children }) => {
  const [start, setStart] = useState<Date>(getInitialStart)
  const [end, setEnd] = useState<Date>(getInitialEnd)

  const { data, loading, error, refetch } = useQuery<Result>(PLANNING, {
    variables: { after: start, before: end },
  })

  const goBack = () => {
    const date = subMonths(start, 1)
    setStart(date)
    setEnd(endOfMonth(date))
  }

  const goForward = () => {
    const date = addMonths(start, 1)
    setStart(date)
    setEnd(endOfMonth(date))
  }

  const goToday = () => {
    setStart(getInitialStart)
    setEnd(getInitialEnd)
  }

  return (
    <DatePlanningContext.Provider value={{ start, end, goBack, goForward, goToday, data, loading, error, refetch }}>
      {children}
    </DatePlanningContext.Provider>
  )
}

export function useDatePlanning() {
  return useContext(DatePlanningContext) as IDatePlanningContext
}
