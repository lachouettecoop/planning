import type { ISlot } from "src/types/app"

import { useState } from "react"
import { Button, TextField } from "@material-ui/core"
import styled from "@emotion/styled/macro"
import { startOfWeek, endOfWeek, startOfDay, endOfDay, isPast } from "date-fns"

import { PIAF, User, RoleId } from "src/types/model"
import PiafCircle from "src/components/PiafCircle"
import { useDialog } from "src/providers/dialog"
import { useRoles } from "src/providers/roles"
import { useUser } from "src/providers/user"
import { PIAFS_COUNT, REGISTRATION_UPDATE } from "src/graphql/queries"
import apollo from "src/helpers/apollo"
import { hasRole } from "src/helpers/role"
import { handleError } from "src/helpers/errors"
import { isTaken, getPiafRole } from "src/helpers/piaf"
import { sendEmail } from "src/helpers/request"
import { formatDateTime, formatDateShort } from "src/helpers/date"
import { formatName } from "src/helpers/user"

const MAX_PIAF_PER_WEEK = 3
const MAX_PIAF_PER_DAY = 2
//const PERCENTAGE_NEW_CHOUETTOS = 50
const ADMIN_ROLES = [RoleId.AdminBdM, RoleId.AdminMag]

const Row = styled.div`
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  button {
    margin-left: 8px;
  }
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
  a {
    text-decoration: none;
  }
`
const InfoPiaf = styled.div`
  display: block;
`

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
/*
Feature not available due to the reset of the counters
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
}*/
const getRegistrationPiaf = (slot: ISlot, piaf: PIAF) => {
  const replacementPiaf = slot.piafs?.find(
    ({ statut, role }) => statut === "remplacement" && role?.id === piaf.role?.id
  )
  if (replacementPiaf) {
    // If there is a PIAF with status "remplacement" and the same role,
    // the user will be registered in it instead of the requested one.
    return replacementPiaf
  }
  return piaf
}

const getGHEmail = (slot: ISlot) => {
  const GHPiaf = slot.piafs?.find(({ statut, role }) => statut === "occupe" && role?.id === RoleId.GrandHibou)
  return GHPiaf?.piaffeur?.email
}

const sendEmailReplacedPiaf = (piaf: PIAF, slot: ISlot, user: User) => {
  const replacedUserMail = (piaf.piaffeur as User).email
  if (replacedUserMail) {
    sendEmail(
      replacedUserMail,
      "PIAF remplacée",
      `Ta PIAF du ${formatDateTime(slot.start)} a été pourvue. Tu n’es plus en charge de cette PIAF.`
    )
  }

  if (piaf.role?.roleUniqueId != RoleId.GrandHibou) {
    const ghEmail = getGHEmail(slot)
    if (ghEmail) {
      sendEmail(
        ghEmail,
        "PIAF remplacée",
        `La PIAF du ${formatDateTime(slot.start)} a été pourvue.
        ${formatName(user)} est maintenant inscrit pour cette PIAF.`
      )
    }
  }
}

interface Props {
  piaf: PIAF
  slot: ISlot
}

const PiafRow = ({ piaf, slot }: Props) => {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState("")
  const { openDialog, openQuestion } = useDialog()
  const { user } = useUser<true>()
  const roles = useRoles()

  const currentUserIsAdmin = user
    ? ADMIN_ROLES.some((role) => user.rolesChouette.some(({ roleUniqueId }) => roleUniqueId === role))
    : false

  const currentUserPiafInSlot =
    user && slot.piafs?.find(({ piaffeur, statut }) => piaffeur?.id === user.id && statut === "occupe")

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInfo(target.value)
  }

  const register = async () => {
    if (!piaf.role) {
      openDialog("Cette PIAF n’a pas de rôle. Contacte l’administrateur pour lui signaler cette erreur.")
      return
    }

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

      /* if (!checkMaximumNumberOfNewChouettos(loggedUser, piaf)) {
        setLoading(false)
        openDialog(`Il n’est pas possible d’avoir plus de ${PERCENTAGE_NEW_CHOUETTOS}% de nouveaux chouettos par PIAF`)
        return
      }
*/
      const ok = await openQuestion(
        `Es-tu sûr·e de vouloir t’inscrire à cette PIAF du ${formatDateShort(slot.start)} en tant que ${
          piaf.role.libelle
        }?`
      )

      if (!ok) {
        return
      }

      setLoading(true)
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
    const ok = await openQuestion(
      `N’oublie pas de chercher un·e remplaçant·e sur Facebook, Zulip, appel aux autres Chouettos… Plus ton créneau est proche, plus c’est important! Es-tu sûr·e de vouloir te désinscrire ?`
    )

    if (!ok) {
      return
    }

    setLoading(true)

    try {
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

  const { piaffeur, informations } = piaf
  const taken = isTaken(piaf)
  const isFuture = !isPast(slot.start)
  const piafRole = roles.find(({ roleUniqueId }) => roleUniqueId == getPiafRole(piaf))

  // show contact infos only if the current user is the GH of the slot or is an admin
  const showInfos = currentUserIsAdmin || currentUserPiafInSlot?.role?.roleUniqueId === RoleId.GrandHibou

  return (
    <Row>
      <PiafCircle piaf={piaf} />
      <Status>
        {taken && piaffeur ? formatName(piaffeur) : "Place disponible"}
        <br />
        <span> {piafRole?.libelle}</span>
      </Status>
      {taken && piaffeur && piaffeur.id != user?.id && (
        <Contact>
          {showInfos && (
            <>
              <a href={`mailto:${piaffeur.email}`}>{piaffeur.email}</a>
              <br />
              <a href={`tel:${piaffeur.telephone}`}>{piaffeur.telephone}</a>
              <br />
            </>
          )}
          {informations}
        </Contact>
      )}
      {!taken && !currentUserPiafInSlot && isFuture && (
        <TextField
          name="informations"
          multiline
          label="Informations (optionnel)"
          value={info}
          onChange={handleInputChange}
        />
      )}
      {!taken && !currentUserPiafInSlot && isFuture && (
        <Button disabled={loading} color="primary" variant="contained" onClick={register}>
          S’inscrire
        </Button>
      )}
      {piaffeur?.id === user?.id && taken && isFuture && (
        <InfoPiaf>
          <div>{informations}</div>
          <Button disabled={loading} color="primary" variant="contained" onClick={unregister}>
            Demander un remplacement
          </Button>
        </InfoPiaf>
      )}
    </Row>
  )
}

export default PiafRow
