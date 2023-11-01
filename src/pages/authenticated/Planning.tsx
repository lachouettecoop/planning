import { useEffect, useState } from "react"

import type { Creneau } from "src/types/model"

import { Button, Typography } from "@mui/material"
import { ArrowBackIos, ArrowForwardIos, CalendarToday } from "@mui/icons-material"
import styled from "@emotion/styled/macro"
import { isSameMonth } from "date-fns"

import Loader from "src/components/Loader"
import Calendar from "src/components/Calendar"
import IconsCaption, { CaptionDialog } from "src/components/IconsCaption"
import { useDatePlanning } from "src/providers/datePlanning"
import { useUser } from "src/providers/user"
import { formatMonthYear } from "src/helpers/date"
import { ErrorBlock } from "src/helpers/errors"
import PrivacyPolicy from "src/components/PrivacyPolicy"

const Loading = styled.div`
  border: 2px solid gray;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Nav = styled.nav`
  display: flex;
  justify-content: end;
  margin-bottom: 1rem;
  button:not(:first-of-type) {
    margin-left: 1rem;
  }
  h2 {
    flex: 1;
    text-transform: capitalize;
  }
  ${({ theme }) => theme.breakpoints.down("xs")} {
    h2 {
      font-size: 1.15rem;
    }
  }
`
const ButtonArea = styled.div`
  display: flex;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    span.text {
      display: none;
    }
    .MuiButton-root {
      min-width: 32px;
    }
    .MuiButton-startIcon {
      margin-right: -4px;
    }
    .MuiButton-endIcon {
      margin-left: -4px;
    }
  }
`
const ButtonAreaBottom = styled.div`
  margin-top: 1rem;
  display: flex;
  span.text {
    display: none;
  }
  .MuiButton-root {
    min-width: 32px;
  }
  .MuiButton-startIcon {
    margin-right: -4px;
  }
  .MuiButton-endIcon {
    margin-left: -4px;
  }
`
const BottomCaption = styled.div`
  max-width: 500px;
  margin: 20px 0 100px auto;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 20px 10px;
`

const orderSlotsByDate = (left: Creneau, right: Creneau) => (left.debut > right.debut ? 1 : -1)

const PlanningPage = () => {
  const { user } = useUser<true>()
  const [displayPrivacyPolicyDialog, setDisplayPrivacyPolicyDialog] = useState(false)
  useEffect(() => {
    if (user) setDisplayPrivacyPolicyDialog(!user.affichageDonneesPersonnelles)
  }, [user])

  const { goBack, goForward, goToday, start, end, data, error, loading } = useDatePlanning()
  if (error) {
    return <ErrorBlock error={error} />
  }

  const slots = data?.creneaus.filter(({ horsMag }) => !horsMag).sort(orderSlotsByDate)

  return (
    <>
      <Nav>
        <Typography variant="h2">{formatMonthYear(start)}</Typography>
        <ButtonArea>
          <Button disabled={loading} variant="contained" color="primary" startIcon={<ArrowBackIos />} onClick={goBack}>
            <span className="text">Précédent</span>
          </Button>
          <Button
            disabled={loading || isSameMonth(start, new Date())}
            variant="contained"
            color="primary"
            startIcon={<CalendarToday />}
            onClick={goToday}
          >
            <span className="text">Aujourd’hui</span>
          </Button>
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIos />}
            onClick={goForward}
          >
            <span className="text">Suivant</span>
          </Button>
        </ButtonArea>
      </Nav>
      {loading ? (
        <Loading>
          <Loader />
        </Loading>
      ) : (
        <>
          {displayPrivacyPolicyDialog && <PrivacyPolicy />}
          <Calendar start={start} end={end} list={slots} />
        </>
      )}
      <Nav>
        <ButtonAreaBottom>
          <Button disabled={loading} variant="contained" color="primary" startIcon={<ArrowBackIos />} onClick={goBack}>
            <span className="text">Précédent</span>
          </Button>
          <Button
            disabled={loading || isSameMonth(start, new Date())}
            variant="contained"
            color="primary"
            startIcon={<CalendarToday />}
            onClick={goToday}
          ></Button>
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIos />}
            onClick={goForward}
          >
            <span className="text">Suivant</span>
          </Button>
        </ButtonAreaBottom>
      </Nav>
      <BottomCaption>
        <IconsCaption />
      </BottomCaption>
      <CaptionDialog />
    </>
  )
}

export default PlanningPage
