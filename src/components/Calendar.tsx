import type { Creneau } from "src/types/model"
import type { IWeek } from "src/types/app"
import type { List } from "src/helpers/apollo"

import styled from "@emotion/styled/macro"
import { addDays, differenceInWeeks, eachWeekOfInterval, getDay } from "date-fns"

import CalendarDay from "src/components/CalendarDay"

const Container = styled.div`
  border: 1px solid gray;
`
const WeekRow = styled.div`
  display: flex;
  > div {
    flex: 1 0 14.29%;
  }
`

interface Props {
  start: Date
  end: Date
  list?: List<Creneau>
}

const Calendar = ({ start, end, list }: Props) => {
  if (!list) {
    return null
  }

  const weeks: IWeek[] = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).map((date) => ({
    start: date,
    days: [0, 1, 2, 3, 4, 5, 6].map((i) => ({ start: addDays(date, i), slots: [] })),
  }))

  list.edges.forEach(({ node }) => {
    const date = new Date(node.debut)
    const weekIndex = differenceInWeeks(date, weeks[0].start)
    const week = weeks[weekIndex]
    const day = (getDay(date) || 7) - 1 // Monday = 0, ..., Sunday = 6

    week.days[day].slots.push({
      id: node.id,
      title: node.titre,
      start: date,
      end: new Date(node.fin),
      piafs: node.piafs.edges
        .map(({ node: piaf }) => piaf)
        .sort((left, right) => (left.role.id > right.role.id ? 1 : -1)),
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
