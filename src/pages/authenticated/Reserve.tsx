import React, { useEffect, useState } from "react"
import { Button, Checkbox, CircularProgress, TextField } from "@material-ui/core"
import { useQuery } from "@apollo/client"
import styled from "@emotion/styled/macro"

import apollo from "src/helpers/apollo"
import { handleError } from "src/helpers/errors"
import { RESERVE_CREATE, RESERVE_UPDATE, CRENEAUX_GENERIQUES, RESERVE_USER } from "src/graphql/queries"
import { useUser } from "src/providers/user"
import { formatTime, getDayOfWeek } from "src/helpers/date"
import InfoDialog from "src/components/InfoDialog"
import { CreneauGenerique, Reserve } from "src/types/model"
import { IReserve } from "src/types/app"

const ErrorMessage = styled.div`
  color: #e53935;
`
const Loading = styled.div`
  border: 2px solid gray;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const List = styled.div`
  display: inline-flex;
`

const ReserveGrid = styled.div`
  @media screen and (min-width: 800px) {
    display: flex;
    > div {
      flex: 1 0 14.29%;
    }
  }
`

const ReserveCell = styled.div`
  display: flex;
`

const ButtonArea = styled.div`
  margin: 15px auto;
  width: 100%;
  > div {
    width: 100%;
  }
`

type ResultCG = { creneauGeneriques: CreneauGenerique[] }
type ResultRU = { reserves: Reserve[] }

const ReservePage = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const { user } = useUser<true>()
  const [information, setInformation] = useState<string>("")
  const [creneauGeneriqueChecked, setCreneauGeneriqueChecked] = useState<string[]>([])
  const handleClickOpenDialog = () => {
    setOpenDialog(true)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const { data: dataCreneauxList, loading: loadingCL, error: errorCreneauxList } = useQuery<ResultCG>(
    CRENEAUX_GENERIQUES
  )
  const { data: dataCreneauxUser, loading: loadingCU, error: errorReserve } = useQuery<ResultRU>(RESERVE_USER, {
    variables: { idUser: user?.id },
  })

  useEffect(() => {
    if (dataCreneauxUser && dataCreneauxUser?.reserves.length > 0) {
      setInformation(dataCreneauxUser.reserves[0].informations)
      setCreneauGeneriqueChecked(dataCreneauxUser.reserves[0].creneauGeneriques.map((cg) => cg.id))
      console.log(dataCreneauxUser.reserves[0].creneauGeneriques.map((cg) => cg.id))
    }
  }, [dataCreneauxUser])

  if (errorCreneauxList || errorReserve) {
    return (
      <ErrorMessage>
        <h2>
          <strong>Une erreur est survenue.</strong> Essayez de recharger la page.
        </h2>
        <p>{errorCreneauxList?.message}</p>
        {<p>{errorReserve?.message}</p>}
      </ErrorMessage>
    )
  }

  const slotList: IReserve[] = []
  for (let day = 0; day < 6; day++) {
    slotList.push({
      day: day,
      slots: dataCreneauxList?.creneauGeneriques.filter((c) => c.jour == day) || [],
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInformation(e.target.value)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, idCreneauGenerique: string) => {
    const isChecked = e.target.checked
    const temp = creneauGeneriqueChecked.slice()
    if (isChecked) {
      temp.push(idCreneauGenerique)
      setCreneauGeneriqueChecked(temp)
    } else {
      temp.splice(temp.indexOf(idCreneauGenerique), 1)
      setCreneauGeneriqueChecked(temp)
    }
  }

  const register = async () => {
    if (dataCreneauxUser) {
      apollo
        .mutate({
          mutation: RESERVE_UPDATE,
          variables: {
            id: dataCreneauxUser.reserves[0].id,
            idUser: user?.id,
            informations: information,
            creneauGenerique: creneauGeneriqueChecked,
          },
        })
        .then((response) => {
          console.log(response)
          handleClickOpenDialog()
        })
        .catch(handleError)
    } else {
      apollo
        .mutate({
          mutation: RESERVE_CREATE,
          variables: { idUser: user?.id, informations: information, creneauGenerique: creneauGeneriqueChecked },
        })
        .then((response) => {
          console.log(response)
          handleClickOpenDialog()
        })
        .catch(handleError)
    }
  }

  return (
    <>
      <ReserveGrid>
        {loadingCL || loadingCU ? (
          <Loading>
            <CircularProgress />
          </Loading>
        ) : (
          slotList.map((reserve) => (
            <div key={reserve.day}>
              {reserve.slots.map(
                (c) =>
                  c.actif && (
                    <ReserveCell key={c.id}>
                      <Checkbox
                        color="default"
                        key={"checkbox" + c.id}
                        checked={creneauGeneriqueChecked.indexOf(c.id) >= 0}
                        onChange={(event) => {
                          handleCheckboxChange(event, c.id)
                        }}
                      />
                      <List key={c.id}>
                        {getDayOfWeek(c.jour)} {formatTime(new Date(c.heureDebut))} {formatTime(new Date(c.heureFin))}{" "}
                        {c.titre}
                      </List>
                    </ReserveCell>
                  )
              )}
            </div>
          ))
        )}
      </ReserveGrid>
      <ButtonArea>
        <TextField label="Information supplémentaire (optionel)" value={information} onChange={handleInputChange} />
      </ButtonArea>
      <ButtonArea>
        <Button color="primary" variant="contained" onClick={register}>
          S’inscrire
        </Button>
      </ButtonArea>
      <InfoDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        title=""
        message={"Vous êtes désormais inscrits à la reserve. Merci !"}
      ></InfoDialog>
    </>
  )
}

export default ReservePage
