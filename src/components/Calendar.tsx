import type { Creneau } from "src/types/model"
import type { IWeek } from "src/types/app"

import styled from "@emotion/styled/macro"
import { addDays, differenceInWeeks, eachWeekOfInterval, getDay } from "date-fns"

import CalendarDay from "src/components/CalendarDay"

const Container = styled.div`
  border: 1px solid gray;
  margin: 0;
  padding: 0;
`
const WeekRow = styled.div`
  @media screen and (min-width: 800px) {
    display: flex;
    > div {
      flex: 1 0 14.29%;
    }
  }
`

interface Props {
  start: Date
  end: Date
  list?: Creneau[]
}

const Calendar = ({ start, end, list }: Props) => {
  if (!list) {
    return null
  }

  const weeks: IWeek[] = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).map((date) => ({
    start: date,
    days: [0, 1, 2, 3, 4, 5, 6].map((i) => ({ start: addDays(date, i), slots: [] })),
  }))

  list.forEach((node) => {
    const date = new Date(node.debut)
    const weekIndex = differenceInWeeks(date, weeks[0].start)
    const week = weeks[weekIndex]
    const day = (getDay(date) || 7) - 1 // Monday = 0, ..., Sunday = 6
    const piafs = node.piafs.slice().sort((left, right) => (left.role.id > right.role.id ? 1 : -1))

    week.days[day].slots.push({
      id: node.id,
      title: node.titre,
      start: date,
      end: new Date(node.fin),
      piafs,
    })
  })

  return (
    <Container>
      {weeks.map((week, index) => (
        <WeekRow key={index}>
          {week.days.map((day, i) => (
            <CalendarDay day={day} key={i} />
          ))}
        </WeekRow>
      ))}
    </Container>
  )
}

export default Calendar
