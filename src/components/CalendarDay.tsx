import type { IDay, IWeekNumber } from "src/types/app"

import styled from "@emotion/styled/macro"
import { isPast, isToday } from "date-fns"
import { capitalize, Typography } from "@material-ui/core"

import Slot from "src/components/Slot"
import { formatDateShort } from "src/helpers/date"

type TimeStatus = "past" | "present" | "future"

const WEEK_COLORS: Record<IWeekNumber, string> = {
  1: "#89C7A8",
  2: "#638F79",
  3: "#3A5447",
  4: "#27382F",
}

const Header = styled.div<{ $when?: IWeekNumber }>`
  background-color: ${({ $when, theme }) => ($when ? WEEK_COLORS[$when] : theme.palette.grey[400])};
  height: 18px;
  color: white;
  font-size: 12px;
  padding: 0 4px;
`

const Container = styled.div<{ $when: TimeStatus }>`
  opacity: ${({ $when }) => ($when === "past" ? 0.25 : 1)};
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
  weekNumber?: IWeekNumber
}

const CalendarDay = ({ day, weekNumber }: Props) => {
  const { start, slots } = day
  const isFirstDoW = start.getDay() === 1 || start.getDate() === 1

  return (
    <Container $when={isToday(start) ? "present" : isPast(start) ? "past" : "future"}>
      <Header $when={weekNumber}>{isFirstDoW && weekNumber && `Semaine ${weekNumber}`}</Header>
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
