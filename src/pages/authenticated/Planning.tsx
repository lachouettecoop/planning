import type { Creneau } from "src/types/model"

import { useQuery } from "@apollo/client"
import { Button, CircularProgress, Grid, useMediaQuery, useTheme } from "@material-ui/core"
import { ArrowBackIos, ArrowForwardIos, Search, CalendarToday } from "@material-ui/icons"
import styled from "@emotion/styled/macro"

import { useDatePlanning } from "src/providers/datePlanning"
import { PLANNING } from "src/graphql/queries"
import Calendar from "src/components/Calendar"
import { PiafIcon } from "src/components/Piaf"
import { formatMonthYear } from "src/helpers/date"
import { isSameMonth } from "date-fns"

type Result = { creneaus: Creneau[] }

const Loading = styled.div`
  border: 2px solid gray;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ErrorMessage = styled.div`
  color: #e53935;
`
const Caption = styled.div`
  border: 1px solid gray;
  border-radius: 10px;
  max-width: 450px;
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
  margin-bottom: 10px;
  button:not(:first-of-type) {
    margin-left: 10px;
  }
`
const Title = styled.h2`
  flex: 1;
  margin: 0 20px;
  text-transform: capitalize;
  min-width: 160px;
  text-align: center;
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
    return (
      <ErrorMessage>
        <h2>
          <strong>Une erreur est survenue.</strong> Essayez de recharger la page.
        </h2>
        <p>{error.message}</p>
      </ErrorMessage>
    )
  }

  return (
    <>
      <Nav>
        <Grid container>
          <Grid item xs={12} md={3}>
            <Button variant="contained" color="primary" startIcon={<Search />} disabled>
              Recherche
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Title>{formatMonthYear(start)}</Title>
          </Grid>
          <Grid item xs={12} md={6}>
            <ButtonArea>
              <Button
                disabled={loading}
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIos />}
                onClick={goBack}
              >
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
          </Grid>
        </Grid>
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
            <div>Cherche remplaçant</div>
          </Grid>
          <Grid item xs={4}>
            <PiafIcon $status="occupied" />
            <div>PIAF occupée</div>
          </Grid>
        </Grid>
      </Caption>
    </>
  )
}

export default PlanningPage
