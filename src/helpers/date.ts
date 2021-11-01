import { format } from "date-fns"
import fr from "date-fns/locale/fr"

const getDate = (date: Date | number | string) => {
  if (typeof date !== "object") {
    return new Date(date)
  }
  return date
}

const formatInFrench = (date: Date | number | string, pattern: string) => format(getDate(date), pattern, { locale: fr })

export const formatDateShort = (date: Date | number | string) => formatInFrench(date, "EEEE d MMM")
export const formatDateLong = (date: Date | number | string) => formatInFrench(date, "EEEE d MMMM yyyy")

export const formatMonthYear = (date: Date | number | string) => formatInFrench(date, "MMMM yyyy")

export const formatTime = (date: Date | number | string) => formatInFrench(date, "HH:mm")

export const formatDateTime = (date: Date | number | string) => formatInFrench(date, "EEEE d MMMM yyyy à HH:mm")

export const formatDateInterval = (start: Date | number | string, end: Date | number | string) => {
  start = getDate(start)
  end = getDate(end)

  let startPattern = "d"
  if (start.getFullYear() !== end.getFullYear()) {
    startPattern = "d MMMM yyyy"
  } else if (start.getMonth() !== end.getMonth()) {
    startPattern = "d MMMM"
  } else if (start.getDate() === end.getDate()) {
    return formatDateLong(start)
  }
  return `du ${formatInFrench(start, startPattern)} au ${formatInFrench(end, "d MMMM yyyy")}`
}

const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
export const getDayOfWeek = (index: number) => WEEKDAYS[index]

export const queryDate = (date: Date | number) => format(date, "yyyy-MM-dd")
