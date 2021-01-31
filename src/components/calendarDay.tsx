export interface Day {
  date: Date
  title: string
}

interface Props {
  day: Day
}

const CalendarDay = ({ day }: Props) => {
  return <div>{day.title}</div>
}

export default CalendarDay
