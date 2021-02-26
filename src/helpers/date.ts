import { format } from "date-fns"
import fr from "date-fns/locale/fr"

const formatInFrench = (date: Date | number, pattern: string) => format(date, pattern, { locale: fr })

export const formatDateShort = (date: Date | number) => formatInFrench(date, "EEEE d MMM")
export const formatDateLong = (date: Date | number) => formatInFrench(date, "EEEE d MMMM yyyy")

export const formatMonthYear = (date: Date | number) => formatInFrench(date, "MMMM yyyy")

export const formatTime = (date: Date | number) => formatInFrench(date, "HH:mm")
