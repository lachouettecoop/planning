import type { ISlot } from "src/types/app"

import { useState } from "react"
import { Button, capitalize, Dialog, DialogContent, DialogTitle, IconButton } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import styled from "@emotion/styled/macro"
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns"

import { PIAF, RoleId, User } from "src/types/model"
import { formatTime, formatDateLong } from "src/helpers/date"
import { REGISTRATION_UPDATE, PIAFS_COUNT, PIAF_CREATE } from "src/graphql/queries"
import { useUser } from "src/providers/user"
import apollo from "src/helpers/apollo"
import Loader from "src/components/Loader"
import PiafCircle, { getStatus } from "src/components/PiafCircle"
import { handleError } from "src/helpers/errors"
import { useDialog } from "src/providers/dialog"
import { getIdRoleAccompagnateur, hasRole, hasRoleFormation } from "src/helpers/role"

const MAX_PIAF_PER_WEEK = 3
const MAX_PIAF_PER_DAY = 2

type Result = { piafs: PIAF[] }

const getPiafCount = async (slot: ISlot, userId: string, type: "week" | "day") => {
  const after = type === "day" ? startOfDay(slot.start) : startOfWeek(slot.start)
  const before = type === "day" ? endOfDay(slot.start) : endOfWeek(slot.start)
  const { data } = await apollo.query<Result>({
    query: PIAFS_COUNT,
    variables: { userId, after, before },
  })
  //The filter by statut on the database does not work
  return data.piafs.filter((p) => p.statut === "occupe").length
}

const getRegistrationPiafId = (slot: ISlot, piaf: PIAF) => {
  const replacementPiaf = slot.piafs?.find(({ statut, role }) => statut === "remplacement" && role.id === piaf.role.id)
  if (replacementPiaf) {
    // If there is a PIAF with status "remplacement" and the same role,
    // the user will be registered to it instead of the requested one.
    return replacementPiaf.id
  }
  return piaf.id
}

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
`
const Title = styled.div`
  span {
    color: ${({ theme }) => theme.palette.grey[600]};
    margin-left: 5px;
  }
`
const PiafRow = styled.div`
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`
const Status = styled.div`
  flex: 1;
  margin: 0 8px;
  span {
    color: ${({ theme }) => theme.palette.grey[600]};
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

  const register = async (piaf: PIAF) => {
    setLoading(true)

    try {
      const roles = user?.rolesChouette
      if (!roles || !hasRole(piaf.role.roleUniqueId, roles)) {
        setLoading(false)
        openDialog(`Pour t’inscrire à cette PIAF, tu dois d’abord passer la formation ${piaf.role.libelle}`)
        return
      }

      const userId = (user as User).id

      const piafOfWeek = await getPiafCount(slot, userId, "week")
      if (piafOfWeek >= MAX_PIAF_PER_WEEK) {
        setLoading(false)
        openDialog(`Il n’est pas possible de s’inscrire à plus de ${MAX_PIAF_PER_WEEK} PIAF par semaine`)
        return
      }

      const piafOfDay = await getPiafCount(slot, userId, "day")
      if (piafOfDay >= MAX_PIAF_PER_DAY) {
        setLoading(false)
        openDialog(`Il n’est pas possible de s’inscrire à plus de ${MAX_PIAF_PER_DAY} PIAF par jour`)
        return
      }

      const piafId = getRegistrationPiafId(slot, piaf)

      await apollo.mutate({
        mutation: REGISTRATION_UPDATE,
        variables: { piafId, userId, statut: "occupe" },
      })

      if (hasRoleFormation(roles)) {
        const idRoleAccompagnateur = getIdRoleAccompagnateur(piaf.role.roleUniqueId)
        if (idRoleAccompagnateur) {
          await apollo.mutate({
            mutation: PIAF_CREATE,
            variables: {
              idCreneau: slot.id,
              idRole: idRoleAccompagnateur,
            },
          })
        } else {
          console.error("PIAF formation sans role accompagnateur")
        }
      }

      openDialog("Inscription effectuée. Merci !")
    } catch (error) {
      handleError(error)
    }

    setLoading(false)
  }

  const unregister = async (piaf: PIAF) => {
    setLoading(true)

    try {
      const userId = (user as User).id

      await apollo.mutate({
        mutation: REGISTRATION_UPDATE,
        variables: { piafId: piaf.id, userId, statut: "remplacement" },
      })

      openDialog("Désinscription effectuée : la PIAF est désormais en recherche de remplacement !")
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
                  piafCurrentUser.role.roleUniqueId === RoleId.GrandHibou &&
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
          <Loader />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SlotInfo
