import { format } from "date-fns"
import fr from "date-fns/locale/fr"

const formatInFrench = (date: Date | number, pattern: string) => format(date, pattern, { locale: fr })

export const formatTime = (date: Date | number) => formatInFrench(date, "HH:mm")

export const formatDateShort = (date: Date | number) => formatInFrench(date, "EE dd/MM/yyyy")
export const formatDateLong = (date: Date | number) => formatInFrench(date, "EEEE dd MMMM yyyy")

export const formatDateTime = (date: Date | number) => formatInFrench(date, "dd/MM/yyyy HH:mm")

export const formatInterval = (start: Date | number, end: Date | number) =>
  `Du ${formatInFrench(start, "EEEE dd MMMM")} au ${formatInFrench(end, "EEEE dd MMMM yyyy")}`
