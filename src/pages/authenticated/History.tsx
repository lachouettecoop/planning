import { addMonths } from "date-fns"
import { TextField, Typography } from "@mui/material"
import styled from "@emotion/styled/macro"
import { useState } from "react"

import { useUser } from "src/providers/user"
import { queryDate } from "src/helpers/date"

import UserPiafHistory from "src/components/UserPiafHistory"

const DateField = styled(TextField)`
  margin: ${({ theme }) => theme.spacing(1)};
`

const currentDate = new Date(Date.now())

const HistoryPage = () => {
  const { auth } = useUser<true>()
  const [selectedDateIni, setSelectedDateIni] = useState(addMonths(currentDate, -3))
  const [selectedDateFin, setSelectedDateFin] = useState(currentDate)

  const handleChange = (event: any) => {
    if (event.target.valueAsDate) {
      if (event.target.id === "dateIni") {
        setSelectedDateIni(event.target.valueAsDate)
      } else if (event.target.id === "dateFin") {
        setSelectedDateFin(event.target.valueAsDate)
      }
    }
  }

  return (
    <>
      <Typography variant="h2">Historique des PIAF</Typography>
      <DateField
        id="dateIni"
        label="Depuis"
        type="date"
        defaultValue={queryDate(selectedDateIni)}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChange}
      />
      <DateField
        id="dateFin"
        label="Jusqu’au"
        type="date"
        defaultValue={queryDate(selectedDateFin)}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleChange}
      />
      <UserPiafHistory
        userId={`api/users/${auth.id}`}
        after={queryDate(selectedDateIni)}
        before={queryDate(selectedDateFin)}
      />
    </>
  )
}

export default HistoryPage
