import type { PIAF } from "src/types/model"
import type { ISlot } from "src/types/app"

import { useState } from "react"
import { Button, capitalize, Dialog, DialogContent, DialogTitle, IconButton, CircularProgress } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import styled from "@emotion/styled/macro"
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns"

import { formatTime, formatDateLong } from "src/helpers/date"
import { REGISTRATION_UPDATE, PIAFS } from "src/graphql/queries"
import { useUser } from "src/providers/user"
import apollo from "src/helpers/apollo"
import PiafCircle, { getStatus } from "src/components/PiafCircle"
import { handleError } from "src/helpers/errors"
import { useDialog } from "src/providers/dialog"

type Result = { piafs: PIAF[] }

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
`
const Title = styled.div`
  span {
    color: gray;
    margin-left: 5px;
  }
`
const PiafRow = styled.div`
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`
const Status = styled.div`
  flex: 1;
  margin: 0 8px;
  span {
    color: #888;
  }
`
const Contact = styled.div`
  text-align: right;
`

interface Props {
  slot: ISlot
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const SlotInfo = ({ slot, show, handleClose }: Props) => {
  const [loading, setLoading] = useState(false)
  const { openDialog } = useDialog()
  const { user } = useUser<true>()
  const piafCurrentUser = slot.piafs?.find(({ piaffeur, statut }) => piaffeur?.id === user?.id && statut === "occupe")
  const hideButtons = slot.start.getTime() < Date.now()

  const getPiafCountByWeek = async () => {
    const after = startOfWeek(slot.start)
    const before = endOfWeek(slot.start)
    try {
      const result = await apollo.query<Result>({
        query: PIAFS,
        variables: { idPiaffeur: user?.id, after: after, before: before },
      })
      return result.data.piafs.length
    } catch (ex) {
      handleError(ex)
    }
    return 0
  }

  const getPiafCountByDay = async () => {
    const after = startOfDay(slot.start)
    const before = endOfDay(slot.start)
    try {
      const result = await apollo.query<Result>({
        query: PIAFS,
        variables: { idPiaffeur: user?.id, after: after, before: before },
      })
      return result.data.piafs.length
    } catch (ex) {
      handleError(ex)
    }
    return 0
  }

  const register = async (piaf: PIAF) => {
    const roles = user?.rolesChouette
    if (!roles || !roles.find(({ id }) => id === piaf.role.id)) {
      openDialog(`Pour t’inscrire à cette PIAF tu dois d’abord passer la formation ${piaf.role.libelle}`)
      return
    }

    setLoading(true)
    const piafOfWeek = await getPiafCountByWeek()
    if (piafOfWeek >= 3) {
      openDialog(`Il n'est pas possible de s'inscriresur plus de 3 PIAF par semaine`)
      return
    }
    const piafOfDay = await getPiafCountByDay()
    if (piafOfDay >= 2) {
      openDialog(`Il n'est pas possible de s'inscrire sur plus de 2 PIAF par jour`)
      return
    }

    // If there is a piaf with status "remplacement" and the same role,
    // the user will be register in this piaf by default
    let idPiaf = piaf.id
    const piafReplacement = slot.piafs?.find(
      ({ statut, role }) => statut === "remplacement" && role.id === piaf.role.id
    )
    if (piafReplacement) {
      idPiaf = piafReplacement.id
    }

    try {
      await apollo.mutate({
        mutation: REGISTRATION_UPDATE,
        variables: { idPiaf, idPiaffeur: user?.id, statut: "occupe" },
      })

      openDialog("Inscription OK. Merci !")
    } catch (error) {
      handleError(error)
    }

    setLoading(false)
  }

  const unregister = async (piaf: PIAF) => {
    setLoading(true)

    try {
      await apollo.mutate({
        mutation: REGISTRATION_UPDATE,
        variables: { idPiaf: piaf.id, idPiaffeur: user?.id, statut: "remplacement" },
      })

      openDialog("Désinscription faite : la PIAF est désormais en recherche de remplacement")
    } catch (error) {
      handleError(error)
    }

    setLoading(false)
  }

  return (
    <Dialog open={show} onClose={handleClose} fullWidth>
      <CloseButton onClick={handleClose}>
        <Close />
      </CloseButton>
      <DialogTitle>
        {capitalize(formatDateLong(slot.start))}
        <br />
        <Title>
          <strong>
            {formatTime(slot.start)}–{formatTime(slot.end)}
          </strong>
          <span>{slot.title}</span>
        </Title>
      </DialogTitle>
      <DialogContent>
        {slot.piafs ? (
          slot.piafs.map((piaf) => {
            const { id, role, piaffeur } = piaf
            const status = getStatus(piaf)

            return (
              <PiafRow key={id}>
                <PiafCircle piaf={piaf} />
                <Status>
                  {status === "occupied" && piaffeur ? `${piaffeur.prenom} ${piaffeur.nom}` : "Place disponible"}
                  <br />
                  <span>{role.libelle}</span>
                </Status>
                {status === "occupied" &&
                  piafCurrentUser &&
                  piafCurrentUser.role.roleUniqueId === "GH" &&
                  piaffeur &&
                  piaffeur.id != user?.id && (
                    //Show info contacts only if the current user is the GH of the slot
                    <Contact>
                      <a href={`mailto:${piaffeur.email}`}>{piaffeur.email}</a>
                      <br />
                      <a href={`tel:${piaffeur.telephone}`}>{piaffeur.telephone}</a>
                    </Contact>
                  )}
                {status !== "occupied" && !piafCurrentUser && !hideButtons && (
                  <Button disabled={loading} color="primary" variant="contained" onClick={() => register(piaf)}>
                    S’inscrire
                  </Button>
                )}
                {piaffeur?.id === user?.id && piaf.statut === "occupe" && !hideButtons && (
                  <Button disabled={loading} color="primary" variant="contained" onClick={() => unregister(piaf)}>
                    Demander un remplacement
                  </Button>
                )}
              </PiafRow>
            )
          })
        ) : (
          <CircularProgress />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SlotInfo
