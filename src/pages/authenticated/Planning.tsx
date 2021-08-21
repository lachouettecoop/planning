import { Button, Typography, useMediaQuery, useTheme } from "@material-ui/core"
import { ArrowBackIos, ArrowForwardIos, CalendarToday } from "@material-ui/icons"
import styled from "@emotion/styled/macro"
import { isSameMonth } from "date-fns"

import Loader from "src/components/Loader"
import Calendar from "src/components/Calendar"
import IconsCaption, { CaptionDialog } from "src/components/IconsCaption"
import { useDatePlanning } from "src/providers/datePlanning"
import { formatMonthYear } from "src/helpers/date"
import { ErrorBlock } from "src/helpers/errors"

const Loading = styled.div`
  border: 2px solid gray;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Nav = styled.nav`
  display: flex;
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
const BottomCaption = styled.div`
  max-width: 500px;
  margin: 20px 0 100px auto;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 20px 10px;
`

const PlanningPage = () => {
  const { goBack, goForward, goToday, start, end, data, error, loading } = useDatePlanning()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up("sm"))
  const textTodayButton = matches ? "Aujourd’hui" : ""
  const textBeforeButton = matches ? "Précédent" : ""
  const textAfterButton = matches ? "Suivant" : ""

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
          <Loader />
        </Loading>
      ) : (
        <Calendar start={start} end={end} list={data?.creneaus.slice().sort((a, b) => (a.debut > b.debut ? 1 : -1))} />
      )}
      <BottomCaption>
        <IconsCaption />
      </BottomCaption>
      <CaptionDialog />
    </>
  )
}

export default PlanningPage
