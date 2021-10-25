import type { Creneau, PIAF } from "src/types/model"
import type { IWeek, IWeekNumber } from "src/types/app"

import { useMediaQuery, useTheme } from "@material-ui/core"
import styled from "@emotion/styled/macro"
import { addDays, differenceInWeeks, eachWeekOfInterval, getDay } from "date-fns"

import CalendarDay, { DayPlaceholder } from "src/components/CalendarDay"
import { orderPiafsByRoleId } from "src/helpers/piaf"

const Container = styled.div`
  border: 1px solid gray;
  margin: 0;
  padding: 0;
`
const WeekRow = styled.div`
  @media (min-width: 800px) {
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
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down("sm"))

  if (!list) {
    return null
  }

  const weeks: IWeek[] = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).map((date) => ({
    start: date,
    days: [0, 1, 2, 3, 4, 5, 6].map((i) => ({ start: addDays(date, i), slots: [] })),
    weekNumber: 1,
  }))

  list.forEach((node) => {
    const date = new Date(node.debut)
    const weekIndex = differenceInWeeks(date, weeks[0].start)
    const week = weeks[weekIndex]
    const day = (getDay(date) || 7) - 1 // Monday = 0, ..., Sunday = 6

    const piaffeursCount = node.piafs.length
    const piaffeursCountFirstPiaf = node.piafs.filter(({ piaffeur }) => piaffeur?.nbPiafEffectuees === 0).length
    const infoCreneau = { piaffeursCount, piaffeursCountFirstPiaf }

    const piafs: PIAF[] = node.piafs
      .map((piaf) => ({
        ...piaf,
        infoCreneau,
      }))
      .sort(orderPiafsByRoleId)

    week.days[day].slots.push({
      id: node.id,
      title: node.titre,
      information: node.informations,
      start: date,
      end: new Date(node.fin),
      piafs,
    })

    if (node.creneauGenerique) {
      week.weekNumber = Number(node.creneauGenerique.frequence) as IWeekNumber
    }
  })

  return (
    <Container>
      {weeks.map((week, index) => (
        <WeekRow key={index}>
          {week.days.map((day, i) =>
            day.start >= start && day.start < end ? (
              <CalendarDay day={day} key={i} weekNumber={week.weekNumber} />
            ) : matches ? null : (
              <DayPlaceholder key={i} />
            )
          )}
        </WeekRow>
      ))}
    </Container>
  )
}

export default Calendar
