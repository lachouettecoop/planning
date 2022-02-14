import type { IDay, IWeekId } from "src/types/app"

import styled from "@emotion/styled/macro"
import { isPast, isToday } from "date-fns"
import { capitalize, Typography } from "@material-ui/core"

import Slot from "src/components/Slot"
import { formatDateShort } from "src/helpers/date"

type TimeStatus = "past" | "present" | "future"

const WEEK_COLORS: Record<IWeekId, string> = {
  A: "#89C7A8",
  B: "#638F79",
  C: "#3A5447",
  D: "#27382F",
}

const Header = styled.div<{ $weekId?: IWeekId }>`
  background-color: ${({ $weekId, theme }) => ($weekId && WEEK_COLORS[$weekId]) || theme.palette.grey[400]};
  height: 18px;
  color: white;
  font-size: 12px;
  padding: 0 4px;
`

const Container = styled.div<{ $when: TimeStatus }>`
  opacity: ${({ $when }) => ($when === "past" ? 0.25 : 1)};
  scroll-margin-top: 64px;
  border: 1px solid gray;
  min-height: 80px;
  background-color: ${({ $when }) => ($when === "present" ? "#d0d9d0" : "#eee")};
  h3 {
    font-size: 1em;
    margin: 4px;
  }
`
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

interface Props {
  day: IDay
  weekId?: IWeekId
}

const CalendarDay = ({ day, weekId }: Props) => {
  const { start, slots } = day
  const today = isToday(start)
  const monday = start.getDay() === 1 || start.getDate() === 1

  return (
    <Container
      $when={today ? "present" : isPast(start) ? "past" : "future"}
      ref={(el) => {
        if (today && el) {
          el.scrollIntoView({ behavior: "smooth" })
        }
      }}
    >
      <Header $weekId={weekId}>{monday && weekId && `Semaine ${weekId}`}</Header>
      <Typography variant="h3">{capitalize(formatDateShort(start))}</Typography>
      <List>
        {slots.map((slot) => (
          <Slot slot={slot} key={slot.id}></Slot>
        ))}
      </List>
    </Container>
  )
}

export default CalendarDay

export const DayPlaceholder = () => <Container $when="past" />
