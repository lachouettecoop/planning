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

const ButtonArea = styled.div`
  margin: 15px auto 100px auto;
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
    skip: !user,
    variables: { idUser: user?.id },
  })
  const loading = loadingCL || loadingCU

  useEffect(() => {
    if (dataCreneauxUser && dataCreneauxUser?.reserves.length > 0) {
      setInformation(dataCreneauxUser.reserves[0].informations)
      setCreneauGeneriqueChecked(dataCreneauxUser.reserves[0].creneauGeneriques.map((cg) => cg.id))
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

  if (dataCreneauxList) {
    for (let day = 0; day < 6; day++) {
      dataCreneauxList?.creneauGeneriques
        .filter((c) => c.jour == day && c.actif)
        .forEach((cg) => {
          const reserveFound = slotList.find((s) => s.day == day)
          if (reserveFound) {
            const slotReserveFound = reserveFound.slots.find((c) => c.time == new Date(cg.heureDebut).getTime())
            if (slotReserveFound) {
              slotReserveFound.allSlotIds.push(cg.id)
            } else {
              reserveFound.slots.push({
                time: new Date(cg.heureDebut).getTime(),
                slotDisplayed: cg,
                allSlotIds: [cg.id],
              })
            }
          } else {
            slotList.push({
              day: day,
              slots: [
                {
                  time: new Date(cg.heureDebut).getTime(),
                  slotDisplayed: cg,
                  allSlotIds: [cg.id],
                },
              ],
            })
          }
        })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInformation(e.target.value)
  }

  const getSlot = (idCreneauGenerique: string) => {
    let allSlotsSelected: string[] = []
    slotList.forEach((s) => {
      const selSlot = s.slots.find((displayed) => displayed.slotDisplayed.id == idCreneauGenerique)
      if (selSlot) {
        allSlotsSelected = selSlot.allSlotIds
      }
    })
    return allSlotsSelected
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, idCreneauGenerique: string) => {
    const isChecked = e.target.checked
    const temp = creneauGeneriqueChecked.slice()
    if (isChecked) {
      temp.push(...getSlot(idCreneauGenerique))
      setCreneauGeneriqueChecked(temp)
    } else {
      getSlot(idCreneauGenerique).forEach((s) => {
        temp.splice(temp.indexOf(s), 1)
      })
      setCreneauGeneriqueChecked(temp)
    }
  }

  const register = async () => {
    if (dataCreneauxUser?.reserves.length) {
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
        {loading ? (
          <Loading>
            <CircularProgress />
          </Loading>
        ) : (
          slotList.map((reserve) => (
            <div key={reserve.day}>
              {getDayOfWeek(reserve.day)}
              {reserve.slots.map((s) => (
                <div key={s.slotDisplayed.id}>
                  <Checkbox
                    color="default"
                    key={"checkbox" + s.slotDisplayed.id}
                    checked={creneauGeneriqueChecked.indexOf(s.slotDisplayed.id) >= 0}
                    onChange={(event) => {
                      handleCheckboxChange(event, s.slotDisplayed.id)
                    }}
                  />
                  <List key={s.slotDisplayed.id}>
                    {formatTime(new Date(s.slotDisplayed.heureDebut))} -{" "}
                    {formatTime(new Date(s.slotDisplayed.heureFin))}
                  </List>
                </div>
              ))}
            </div>
          ))
        )}
      </ReserveGrid>
      <ButtonArea>
        <TextField
          disabled={loading}
          label="Information supplémentaire (optionel)"
          value={information}
          onChange={handleInputChange}
        />
      </ButtonArea>
      <ButtonArea>
        <Button disabled={loading} color="primary" variant="contained" onClick={register}>
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
