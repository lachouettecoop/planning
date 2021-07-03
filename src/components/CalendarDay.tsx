import type { IDay } from "src/types/app"

import styled from "@emotion/styled/macro"
import { isPast, isToday } from "date-fns"
import { capitalize } from "@material-ui/core"

import Slot from "src/components/Slot"
import { formatDateShort } from "src/helpers/date"

type TimeStatus = "past" | "present" | "future"

const Header = styled.div<{ $when: number }>`
  background-color: ${({ $when }) => {
    switch ($when) {
      case 1:
        return "#132a13"
      case 2:
        return "#31572c"
      case 3:
        return "#4f772d"
      case 4:
        return "#90a955"
    }
  }};
  height: 15px;
`

const Container = styled.div<{ $when: TimeStatus }>`
  opacity: ${({ $when }) => ($when === "past" ? 0.25 : 1)};
  border: 1px solid gray;
  min-height: 80px;
  background-color: ${({ $when }) => ($when === "present" ? "#d0d9d0" : "#eee")};
`
const Title = styled.h3`
  margin: 0 5px;
  font-weight: 500;
`
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

interface Props {
  day: IDay
  weekNumber: number
}

const CalendarDay = ({ day, weekNumber }: Props) => {
  return (
    <Container $when={isToday(day.start) ? "present" : isPast(day.start) ? "past" : "future"}>
      <Header $when={weekNumber}></Header>
      <Title>{capitalize(formatDateShort(day.start))}</Title>
      <List>
        {day.slots.map((slot) => (
          <Slot slot={slot} key={slot.id}></Slot>
        ))}
      </List>
    </Container>
  )
}

export default CalendarDay

export const DayPlaceholder = () => <Container $when="past" />
