import type { ISlot } from "src/types/app"

import { useState } from "react"
import { Button, TextField } from "@material-ui/core"
import styled from "@emotion/styled/macro"
import { startOfWeek, endOfWeek, startOfDay, endOfDay, isPast } from "date-fns"

import { PIAF, User, RoleId } from "src/types/model"
import PiafCircle from "src/components/PiafCircle"
import { useDialog } from "src/providers/dialog"
import { useRoles } from "src/providers/roles"
import { PIAFS_COUNT, REGISTRATION_UPDATE } from "src/graphql/queries"
import apollo from "src/helpers/apollo"
import { hasRole } from "src/helpers/role"
import { handleError } from "src/helpers/errors"
import { isTaken, getPiafRole } from "src/helpers/piaf"
import { sendEmail } from "src/helpers/request"
import { formatDateLong, formatTime } from "src/helpers/date"

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
  return data.piafs.filter((p) => p.statut === "occupe" && p.nonPourvu === false).length
}

const checkMaximumNumberOfNewChouettos = (user: User, piaf: PIAF) => {
  // There is a maximum percentage for PIAF of new Chouettos
  if (user.nbPiafEffectuees === 0) {
    const piafeursCount = piaf.infoCreneau.piaffeursCount
    const maxPiafeursFirstPiaf = Math.floor((piafeursCount * PERCENTAGE_NEW_CHOUETTOS) / 100)
    const piafeursFirstPiaf = piaf.infoCreneau.piaffeursCountFirstPiaf

    if (piafeursFirstPiaf >= maxPiafeursFirstPiaf) {
      return false
    }
  }
  return true
}
const getRegistrationPiaf = (slot: ISlot, piaf: PIAF) => {
  const replacementPiaf = slot.piafs?.find(({ statut, role }) => statut === "remplacement" && role.id === piaf.role.id)
  if (replacementPiaf) {
    // If there is a PIAF with status "remplacement" and the same role,
    // the user will be registered in it instead of the requested one.
    return replacementPiaf
  }
  return piaf
}

const getGHEmail = (slot: ISlot) => {
  const GHPiaf = slot.piafs?.find(({ statut, role }) => statut === "occupe" && role.id === RoleId.GrandHibou)
  if (GHPiaf) {
    return GHPiaf.piaffeur?.email
  }
  return ""
}

const sendEmailReplacedPiaf = (piaf: PIAF, slot: ISlot, user: User) => {
  const replacedUserMail = (piaf.piaffeur as User).email
  if (replacedUserMail) {
    sendEmail(
      replacedUserMail,
      "PIAF remplacée",
      `Votre PIAF du ${formatDateLong(slot.start)} à ${formatTime(
        slot.start
      )} a été pourvue. Vous n'êtes plus en charge de cette PIAF.`
    )
  }

  if (piaf.role.roleUniqueId != RoleId.GrandHibou) {
    const ghEmail = getGHEmail(slot)
    if (ghEmail) {
      sendEmail(
        ghEmail,
        "PIAF remplacée",
        `La PIAF du ${formatDateLong(slot.start)} à ${formatTime(slot.start)} a été pourvue.
        ${user.prenom} ${user.nom} est maintenant inscrit pour cette PIAF.`
      )
    }
  }
}

const PiafRow = ({ piaf, user, slot }: Props) => {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState("")
  const { openDialog } = useDialog()
  const currentUserIsInSlot = slot.piafs?.find(
    ({ piaffeur, statut }) => piaffeur?.id === user?.id && statut === "occupe"
  )
  const roles = useRoles()

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

      const loggedUser = user as User

      const piafOfWeek = await getPiafCount(slot, loggedUser.id, "week")
      if (piafOfWeek >= MAX_PIAF_PER_WEEK) {
        setLoading(false)
        openDialog(`Il n’est pas possible de s’inscrire à plus de ${MAX_PIAF_PER_WEEK} PIAF par semaine`)
        return
      }

      const piafOfDay = await getPiafCount(slot, loggedUser.id, "day")
      if (piafOfDay >= MAX_PIAF_PER_DAY) {
        setLoading(false)
        openDialog(`Il n’est pas possible de s’inscrire à plus de ${MAX_PIAF_PER_DAY} PIAF par jour`)
        return
      }

      if (!checkMaximumNumberOfNewChouettos(loggedUser, piaf)) {
        setLoading(false)
        openDialog(`Il n’est pas possible d’avoir plus de ${PERCENTAGE_NEW_CHOUETTOS}% de nouveaux chouettos par PIAF`)
        return
      }

      const registrationPiaf = getRegistrationPiaf(slot, piaf)
      if (registrationPiaf.statut === "remplacement") {
        sendEmailReplacedPiaf(registrationPiaf, slot, loggedUser)
      }

      await apollo.mutate({
        mutation: REGISTRATION_UPDATE,
        variables: {
          piafId: registrationPiaf.id,
          userId: loggedUser.id,
          statut: "occupe",
          informations: info,
        },
      })

      openDialog("Inscription effectuée. Merci !")
    } catch (error) {
      handleError(error as Error)
    }

    setLoading(false)
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

      openDialog("Désinscription effectuée : la PIAF est désormais en recherche de remplacement !")
    } catch (error) {
      handleError(error as Error)
    }

    setLoading(false)
  }

  const { id, piaffeur } = piaf
  const taken = isTaken(piaf)

  const roleUser = roles.find((r) => r.roleUniqueId == getPiafRole(piaf))

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
