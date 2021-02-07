import { format } from "date-fns"
import fr from "date-fns/locale/fr"

const formatInFrench = (date: Date | number, pattern: string) => format(date, pattern, { locale: fr })

export const formatTime = (date: Date | number) => formatInFrench(date, "HH:mm")
