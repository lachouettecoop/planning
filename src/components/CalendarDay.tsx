import type { IDay } from "src/types/app"

import styled from "@emotion/styled/macro"

import Slot from "src/components/Slot"
import { formatDateShort } from "src/helpers/date"

const Container = styled.div`
  border: 1px solid gray;
  min-height: 60px;
`
const Title = styled.div`
  text-align: center;
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
    <Container>
      <Title>{formatDateShort(day.date)}</Title>
      <List>
        {day.slots.map((slot) => (
          <Slot slot={slot} key={slot.id}></Slot>
        ))}
      </List>
    </Container>
  )
}

export default CalendarDay
