import type { ISlot } from "src/types/app"

import { useState } from "react"
import { Button, TextField } from "@material-ui/core"
import styled from "@emotion/styled/macro"
import { startOfWeek, endOfWeek, startOfDay, endOfDay, isPast } from "date-fns"

import { PIAF, User, RoleId } from "src/types/model"
import PiafCircle from "src/components/PiafCircle"
import { useDialog } from "src/providers/dialog"
import { useRoles } from "src/providers/roles"
import { PIAFS_COUNT, PIAF_CREATE, REGISTRATION_UPDATE } from "src/graphql/queries"
import apollo from "src/helpers/apollo"
import { getTrainerRoleId, hasRole, needsTraining } from "src/helpers/role"
import { handleError } from "src/helpers/errors"
import { isTaken, getPiafRole } from "src/helpers/piaf"
import { useDatePlanning } from "src/providers/datePlanning"

const MAX_PIAF_PER_WEEK = 3
const MAX_PIAF_PER_DAY = 2
const PERCENTAGE_NEW_CHOUETTOS = 50

const Row = styled.div`
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
const InfoPiaf = styled.div`
  display: block;
`

interface Props {
  piaf: PIAF
  user: User | null
  slot: ISlot
}

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

const checkMaximumNumberOfNewChouettos = (user: User | null, piaf: PIAF) => {
  // There is a maximum percentage for PIAF of new Chouettos
  if (user?.nbPiafEffectuees === 0) {
    const piafeursCount = piaf.infoCreneau.piaffeursCount
    const maxPiafeursFirstPiaf = Math.floor((piafeursCount * PERCENTAGE_NEW_CHOUETTOS) / 100)
    const piafeursFirstPiaf = piaf.infoCreneau.piaffeursCountFirstPiaf

    if (piafeursFirstPiaf >= maxPiafeursFirstPiaf) {
      return false
    }
  }
  return true
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

const PiafRow = ({ piaf, user, slot }: Props) => {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState("")
  const { openDialog } = useDialog()
  const currentUserIsInSlot = slot.piafs?.find(
    ({ piaffeur, statut }) => piaffeur?.id === user?.id && statut === "occupe"
  )
  const rolesBD = useRoles()
  const { refetch } = useDatePlanning()

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInfo(target.value)
  }

  const register = async () => {
    setLoading(true)

    try {
      const userRoles = user?.rolesChouette
      if (!userRoles || !hasRole(piaf.role.roleUniqueId, userRoles)) {
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

      if (!checkMaximumNumberOfNewChouettos(user, piaf)) {
        setLoading(false)
        openDialog(`Il n’est pas possible d’avoir plus de ${PERCENTAGE_NEW_CHOUETTOS}% de nouveaux chouettos par PIAF`)
        return
      }

      const piafId = getRegistrationPiafId(slot, piaf)

      await apollo.mutate({
        mutation: REGISTRATION_UPDATE,
        variables: {
          piafId,
          userId,
          statut: "occupe",
          informations: info,
        },
      })

      let registerOK = true
      if (needsTraining(user, piaf.role.roleUniqueId)) {
        registerOK = await addTrainerPiaf(piaf.role.roleUniqueId)
      }
      if (registerOK) openDialog("Inscription effectuée. Merci !")
    } catch (error) {
      handleError(error)
    }

    setLoading(false)
  }

  const addTrainerPiaf = async (roleUniqueId: RoleId) => {
    const idRoleTrainer = getTrainerRoleId(roleUniqueId)
    if (idRoleTrainer) {
      const roleTrainer = rolesBD.find((r) => r.roleUniqueId == idRoleTrainer)
      if (roleTrainer) {
        await apollo.mutate({
          mutation: PIAF_CREATE,
          variables: {
            idCreneau: slot.id,
            idRole: roleTrainer.id,
          },
        })
        refetch()
      } else {
        openDialog(`Le role ${idRoleTrainer} n'a pas pu être trouvé. Svp, contactez votre administrateur`)
        return false
      }
    } else {
      openDialog(`Il n'y a pas un role formateur pour ${roleUniqueId}. Svp, contactez votre administrateur`)
      return false
    }
    return true
  }

  const unregister = async () => {
    setLoading(true)

    try {
      //Delete info in memory
      setInfo("")

      const userId = (user as User).id

      await apollo.mutate({
        mutation: REGISTRATION_UPDATE,
        variables: { piafId: piaf.id, userId, statut: "remplacement", informations: null },
      })

      if (needsTraining(user, piaf.role.roleUniqueId)) {
        openDialog(
          "Désinscription effectuée ! Svp, mettez vous en contact avec le BdM pour enlever la PIAF accompagnateur·trice"
        )
      } else {
        openDialog("Désinscription effectuée : la PIAF est désormais en recherche de remplacement !")
      }
    } catch (error) {
      handleError(error)
    }

    setLoading(false)
  }

  const { id, piaffeur } = piaf
  const taken = isTaken(piaf)

  const roleUser = rolesBD.find((r) => r.roleUniqueId == getPiafRole(piaf))

  return (
    <Row key={id}>
      <PiafCircle piaf={piaf} />
      <Status>
        {taken && piaffeur ? `${piaffeur.prenom} ${piaffeur.nom}` : "Place disponible"}
        <br />
        <span> {roleUser?.libelle}</span>
      </Status>
      {taken &&
        currentUserIsInSlot &&
        currentUserIsInSlot.role.roleUniqueId === RoleId.GrandHibou &&
        piaffeur &&
        piaffeur.id != user?.id && (
          //Show info contacts only if the current user is the GH of the slot
          <Contact>
            <a href={`mailto:${piaffeur.email}`}>{piaffeur.email}</a>
            <br />
            <a href={`tel:${piaffeur.telephone}`}>{piaffeur.telephone}</a>
            <div>{piaf.informations}</div>
          </Contact>
        )}
      {!taken && !currentUserIsInSlot && !isPast(slot.start) && (
        <TextField
          name="informations"
          multiline
          label="Information (optionnel)"
          value={info}
          onChange={handleInputChange}
        ></TextField>
      )}
      {!taken && !currentUserIsInSlot && !isPast(slot.start) && (
        <Button disabled={loading} color="primary" variant="contained" onClick={register}>
          S’inscrire
        </Button>
      )}
      {piaffeur?.id === user?.id && taken && !isPast(slot.start) && (
        <InfoPiaf>
          <div>{piaf.informations}</div>
          <Button disabled={loading} color="primary" variant="contained" onClick={unregister}>
            Demander un remplacement
          </Button>
        </InfoPiaf>
      )}
    </Row>
  )
}

export default PiafRow
