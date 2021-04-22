import type { Creneau } from "src/types/model"

import { useQuery } from "@apollo/client"
import { Button, CircularProgress, Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { ArrowBackIos, ArrowForwardIos, CalendarToday } from "@material-ui/icons"
import styled from "@emotion/styled/macro"
import { isSameMonth } from "date-fns"

import { useDatePlanning } from "src/providers/datePlanning"
import { PLANNING } from "src/graphql/queries"
import Calendar from "src/components/Calendar"
import { PiafIcon } from "src/components/PiafCircle"
import { formatMonthYear } from "src/helpers/date"
import { ErrorBlock } from "src/helpers/errors"

type Result = { creneaus: Creneau[] }

const Loading = styled.div`
  border: 2px solid gray;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Caption = styled.div`
  border: 1px solid gray;
  border-radius: 10px;
  max-width: 500px;
  margin: 20px 0 100px auto;
  padding: 10px;
  text-align: center;
`
const CaptionTitle = styled.h3`
  text-align: left;
  margin-top: 0;
`
const Nav = styled.nav`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  button:not(:first-of-type) {
    margin-left: 1rem;
  }
  h2 {
    flex: 1;
    text-transform: capitalize;
  }
`

const ButtonArea = styled.div`
  display: flex;
  justify-content: end;
`

const PlanningPage = () => {
  const { goBack, goForward, goToday, start, end } = useDatePlanning()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))
  const textTodayButton = matches ? "Aujourd’hui" : ""
  const textBeforeButton = matches ? "Précédent" : ""
  const textAfterButton = matches ? "Suivant" : ""

  const { data, loading, error } = useQuery<Result>(PLANNING, {
    variables: { after: start, before: end },
  })

  if (error) {
    return <ErrorBlock error={error} />
  }

  return (
    <>
      <Nav>
        <Typography variant="h2">{formatMonthYear(start)}</Typography>
        <ButtonArea>
          <Button disabled={loading} variant="contained" color="primary" startIcon={<ArrowBackIos />} onClick={goBack}>
            {textBeforeButton}
          </Button>
          <Button
            disabled={loading || isSameMonth(start, new Date())}
            variant="contained"
            color="primary"
            startIcon={<CalendarToday />}
            onClick={goToday}
          >
            {textTodayButton}
          </Button>
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIos />}
            onClick={goForward}
          >
            {textAfterButton}
          </Button>
        </ButtonArea>
      </Nav>
      {loading ? (
        <Loading>
          <CircularProgress />
        </Loading>
      ) : (
        <Calendar start={start} end={end} list={data?.creneaus} />
      )}
      <Caption>
        <CaptionTitle>Légende</CaptionTitle>
        <Grid container>
          <Grid item xs={4}>
            <PiafIcon $status="available" />
            <div>PIAF disponible</div>
          </Grid>
          <Grid item xs={4}>
            <PiafIcon $status="replacement" />
            <div>Cherche remplaçant·e</div>
          </Grid>
          <Grid item xs={4}>
            <PiafIcon $status="occupied" />
            <div>PIAF occupée</div>
          </Grid>
        </Grid>
        <br />
        <Grid container>
          <Grid item xs={4}>
            <PiafIcon $status="available" $role="CH">
               
            </PiafIcon>
            <div>Chouettos</div>
          </Grid>
          <Grid item xs={4}>
            <PiafIcon $status="available">CA</PiafIcon>
            <div>Caissier·ère</div>
          </Grid>
          <Grid item xs={4}>
            <PiafIcon $status="available">GH</PiafIcon>
            <div>Grand Hibou</div>
          </Grid>
        </Grid>
      </Caption>
    </>
  )
}

export default PlanningPage
