import type { Creneau } from "src/types/model"
import type { List } from "src/helpers/apollo"

import { useQuery } from "@apollo/client"
import { Button, CircularProgress, Grid } from "@material-ui/core"
import { ArrowBackIos, ArrowForwardIos, Search } from "@material-ui/icons"
import styled from "@emotion/styled/macro"

import { useDatePlanning } from "src/providers/datePlanning"
import { PLANNING } from "src/graphql/queries"
import Calendar from "src/components/Calendar"
import { PiafIcon } from "src/components/Piaf"
import { formatInterval } from "src/helpers/date"

type Result = { creneaus: List<Creneau> }

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
  width: 350px;
  margin: 20px 0 20px auto;
  padding: 10px;
  font-size: 11px;
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
    margin-left: 20px;
  }
`
const Title = styled.h2`
  flex: 1;
  text-align: center;
`

const Planning = () => {
  const { goBack, goForward, start, end } = useDatePlanning()

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

  const handleSearch = () => {
    // TODO
  }

  return (
    <div>
      <Nav>
        <Button variant="contained" color="primary" startIcon={<Search />} onClick={handleSearch}>
          Recherche
        </Button>
        <Title>{formatInterval(start, end)}</Title>
        <Button disabled={loading} variant="contained" color="primary" startIcon={<ArrowBackIos />} onClick={goBack}>
          Précédent
        </Button>
        <Button
          disabled={loading}
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIos />}
          onClick={goForward}
        >
          Suivant
        </Button>
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
            <PiafIcon />
            <div>PIAF occupée</div>
          </Grid>
        </Grid>
      </Caption>
    </div>
  )
}

export default Planning
