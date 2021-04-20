import type { IDay } from "src/types/app"

import styled from "@emotion/styled/macro"
import { isPast, isToday } from "date-fns"

import Slot from "src/components/Slot"
import { formatDateShort } from "src/helpers/date"

type TimeStatus = "past" | "present" | "future"

const Container = styled.div<{ $when: TimeStatus }>`
  opacity: ${({ $when }) => ($when === "past" ? 0.5 : 1)};
  border: 1px solid gray;
  min-height: 80px;
  background-color: ${({ $when }) => ($when === "present" ? "#d0d9d0" : "#eee")};
`
const Title = styled.h3`
  margin: 0 5px;
  font-weight: 500;
  text-transform: capitalize;
`
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

interface Props {
  day: IDay
}

const CalendarDay = ({ day }: Props) => {
  return (
    <Container $when={isToday(day.start) ? "present" : isPast(day.start) ? "past" : "future"}>
      <Title>{formatDateShort(day.start)}</Title>
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
