import type { Creneau } from "src/types/model"
import type { IDay } from "src/types/app"
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

interface Week {
  date: Date
  days: IDay[]
}

interface Props {
  start: Date
  end: Date
  list?: List<Creneau>
}

const Calendar = ({ start, end, list }: Props) => {
  if (!list) {
    return null
  }

  const weeks: Week[] = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).map((date) => ({
    date,
    days: [0, 1, 2, 3, 4, 5, 6].map((i) => ({ date: addDays(date, i), slots: [] })),
  }))

  list.edges.forEach(({ node }) => {
    const dateStr = node.date.split("T")[0]

    const date = new Date(dateStr)
    const weekIndex = differenceInWeeks(date, start)
    const week = weeks[weekIndex]
    const day = (getDay(date) || 7) - 1 // Monday = 0, ..., Sunday = 6

    const startTime = node.heureDebut.split("T")[1]
    const endTime = node.heureFin.split("T")[1]

    week.days[day]?.slots.push({
      id: node.id,
      title: node.titre,
      start: new Date(`${dateStr}T${startTime}`),
      end: new Date(`${dateStr}T${endTime}`),
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
