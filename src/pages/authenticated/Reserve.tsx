import { CreneauGenerique, Reserve } from "src/types/model"
import { IReserve } from "src/types/app"

import { useEffect, useState, ChangeEvent } from "react"
import { Button, FormGroup, FormControlLabel, Checkbox, TextField, Typography } from "@material-ui/core"
import { useQuery } from "@apollo/client"
import styled from "@emotion/styled/macro"

import Loader from "src/components/Loader"
import apollo from "src/helpers/apollo"
import { handleError } from "src/helpers/errors"
import { RESERVE_CREATE, RESERVE_UPDATE, CRENEAUX_GENERIQUES, RESERVE_USER } from "src/graphql/queries"
import { useUser } from "src/providers/user"
import { useDialog } from "src/providers/dialog"
import { formatTime, getDayOfWeek } from "src/helpers/date"
import { ErrorBlock } from "src/helpers/errors"

const Loading = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ReserveGrid = styled.div`
  margin-top: 2rem;
  @media screen and (min-width: 980px) {
    display: flex;
    > div {
      flex: 1 0 14.29%;
    }
  }
`
const Infos = styled.div`
  margin: 20px 0 40px;
`

type ResultCG = { creneauGeneriques: CreneauGenerique[] }
type ResultRU = { reserves: Reserve[] }

const ReservePage = () => {
  const { user } = useUser<true>()
  const [saving, setSaving] = useState(false)
  const { openDialog } = useDialog()
  const [information, setInformation] = useState<string>("")
  const [slots, setSlots] = useState<string[]>([])

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
      setSlots(dataCreneauxUser.reserves[0].creneauGeneriques.map((cg) => cg.id))
    }
  }, [dataCreneauxUser])

  const queryError = errorCreneauxList || errorReserve
  if (queryError) {
    return <ErrorBlock error={queryError} />
  }

  const slotList: IReserve[] = []

  if (dataCreneauxList) {
    for (let day = 0; day < 7; day++) {
      dataCreneauxList?.creneauGeneriques
        .filter(({ jour, actif }) => jour === day && actif)
        .forEach((slot) => {
          const reserveFound = slotList.find((s) => s.day === day)
          const startTime = new Date(slot.heureDebut).getTime()
          if (reserveFound) {
            const slotReserveFound = reserveFound.slots.find(({ time }) => time === startTime)
            if (slotReserveFound) {
              slotReserveFound.allSlotIds.push(slot.id)
            } else {
              reserveFound.slots.push({
                time: startTime,
                slotDisplayed: slot,
                allSlotIds: [slot.id],
              })
            }
          } else {
            slotList.push({
              day: day,
              slots: [
                {
                  time: startTime,
                  slotDisplayed: slot,
                  allSlotIds: [slot.id],
                },
              ],
            })
          }
        })
    }
  }

  const handleInfoChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setInformation(target.value)
  }

  const getSlots = (idCreneauGenerique: string) => {
    let list: string[] = []
    slotList.forEach((slot) => {
      const selected = slot.slots.find((displayed) => displayed.slotDisplayed.id === idCreneauGenerique)
      if (selected) {
        list = selected.allSlotIds
      }
    })
    return list
  }

  const handleCheckboxChange = (idCreneauGenerique: string, checked: boolean) => {
    const temp = slots.slice()
    if (checked) {
      temp.push(...getSlots(idCreneauGenerique))
      setSlots(temp)
    } else {
      getSlots(idCreneauGenerique).forEach((slot) => {
        temp.splice(temp.indexOf(slot), 1)
      })
      setSlots(temp)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    const variables: Record<string, any> = {
      user: user?.id,
      informations: information,
      creneauGenerique: slots,
    }
    if (dataCreneauxUser?.reserves.length) {
      variables.id = dataCreneauxUser.reserves[0].id
    }

    try {
      await apollo.mutate({
        mutation: variables.id ? RESERVE_UPDATE : RESERVE_CREATE,
        variables,
      })

      openDialog(
        (variables.id
          ? "Votre inscription à la réserve a bien été mise à jour."
          : "Vous êtes désormais inscrit·e à la reserve.") + " Merci !"
      )
    } catch (error) {
      handleError(error as Error)
    }

    setSaving(false)
  }

  return (
    <>
      <Typography variant="h2">Réserve</Typography>
      {loading ? (
        <Loading>
          <Loader />
        </Loading>
      ) : (
        <>
          Jours pour lesquels je peux parfois me rendre disponible. Si un créneau est libre moins de 48h avant, un mail
          sera envoyé à tous les inscrits·es
          <ReserveGrid>
            {slotList.map((reserve) => (
              <FormGroup key={reserve.day}>
                {getDayOfWeek(reserve.day)}
                {reserve.slots.map(({ slotDisplayed }) => (
                  <FormControlLabel
                    key={slotDisplayed.id}
                    control={
                      <Checkbox
                        color="default"
                        checked={slots.includes(slotDisplayed.id)}
                        onChange={({ target }) => {
                          handleCheckboxChange(slotDisplayed.id, target.checked)
                        }}
                      />
                    }
                    label={`${formatTime(slotDisplayed.heureDebut)} - ${formatTime(slotDisplayed.heureFin)}`}
                  />
                ))}
              </FormGroup>
            ))}
          </ReserveGrid>
          <Infos>
            <TextField
              multiline
              disabled={loading}
              label="Informations supplémentaires (optionnel)"
              value={information}
              onChange={handleInfoChange}
              fullWidth
            />
          </Infos>
          <Button disabled={saving} color="primary" variant="contained" onClick={handleSave}>
            Enregistrer
          </Button>
        </>
      )}
    </>
  )
}

export default ReservePage
