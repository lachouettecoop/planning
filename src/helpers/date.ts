import { format } from "date-fns"
import fr from "date-fns/locale/fr"

const formatInFrench = (date: Date | number | string, pattern: string) => {
  if (typeof date === "string") {
    date = new Date(date)
  }
  return format(date, pattern, { locale: fr })
}

export const formatDateShort = (date: Date | number | string) => formatInFrench(date, "EEEE d MMM")
export const formatDateLong = (date: Date | number | string) => formatInFrench(date, "EEEE d MMMM yyyy")

export const formatMonthYear = (date: Date | number | string) => formatInFrench(date, "MMMM yyyy")

export const formatTime = (date: Date | number | string) => formatInFrench(date, "HH:mm")

const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
export const getDayOfWeek = (index: number) => WEEKDAYS[index]

export const queryDate = (date: Date | number) => formatInFrench(date, "yyyy-MM-dd")
