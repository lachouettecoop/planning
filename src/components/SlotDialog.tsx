import type { PIAF } from "src/types/model"
import type { ISlot } from "src/types/app"

import { useState } from "react"
import { Button, capitalize, Dialog, DialogContent, DialogTitle, IconButton } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import styled from "@emotion/styled/macro"

import { formatTime, formatDateLong } from "src/helpers/date"
import { REGISTRATION_UPDATE } from "src/graphql/queries"
import { useUser } from "src/providers/user"
import apollo from "src/helpers/apollo"
import Piaf from "src/components/Piaf"
import { handleError } from "src/helpers/errors"

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
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Status = styled.div`
  flex: 1;
  margin: 0 8px;
`

const getPiafTitle = ({ statut, piaffeur, role }: PIAF) => {
  if (statut === "occupe") {
    return (
      <span>
        <strong>
          {piaffeur.prenom} {piaffeur.nom}
        </strong>{" "}
        ({role.libelle})
        <br />
        <a href={`mailto:${piaffeur.email}`}>{piaffeur.email}</a>
        <br />
        <a href={`tel:${piaffeur.telephone}`}>{piaffeur.telephone}</a>
      </span>
    )
  }
  return "Disponible"
}

interface Props {
  slot: ISlot
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const SlotInfo = ({ slot, show, handleClose }: Props) => {
  const [loading, setLoading] = useState(false)
  const { user } = useUser<true>()

  const userPiaf = slot.piafs.find(({ piaffeur, statut }) => piaffeur?.id == user?.id && statut == "occupe")

  const register = async (piaf: PIAF) => {
    const roles = user?.rolesChouette.edges
    if (!roles || !roles.find((r) => r.node.id == piaf.role.id)) {
      alert(`Pour t'inscrire à cette PIAF tu dois d'abord passer la formation ${piaf.role.libelle}`)
      return
    }

    setLoading(true)

    // If there is a piaf with status "remplacement" and the same role,
    // the user will be register in this piaf by default
    let idPiaf = piaf.id
    const piafReplacement = slot.piafs.find(({ statut, role }) => statut == "remplacement" && role.id == piaf.role.id)
    if (piafReplacement) {
      idPiaf = piafReplacement.id
    }

    apollo
      .mutate({
        mutation: REGISTRATION_UPDATE,
        variables: { idPiaf, idPiaffeur: user?.id, statut: "occupe" },
      })
      .then((response) => {
        console.log(response)
        alert("Inscription OK. Merci !")
      })
      .catch(handleError)

    setLoading(false)
  }

  const unregister = async (piaf: PIAF) => {
    setLoading(true)

    apollo
      .mutate({
        mutation: REGISTRATION_UPDATE,
        variables: { idPiaf: piaf.id, idPiaffeur: user?.id, statut: "remplacement" },
      })
      .then((response) => {
        console.log(response)
        alert("Désinscription faite : la PIAF est désormais en recherche de remplacement")
      })
      .catch(handleError)

    setLoading(false)
  }

  return (
    <Dialog open={show} onClose={handleClose} fullWidth maxWidth="xs">
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
        {slot.piafs.map((piaf) => (
          <PiafRow key={piaf.id}>
            <Piaf piaf={piaf} />
            <Status>{getPiafTitle(piaf)}</Status>
            {(piaf.statut == "" || piaf.statut == "remplacement" || !piaf.statut) && !userPiaf && (
              <Button disabled={loading} color="primary" variant="contained" onClick={() => register(piaf)}>
                S’inscrire
              </Button>
            )}
            {piaf.piaffeur && piaf.piaffeur.id == user?.id && piaf.statut == "occupe" && (
              <Button disabled={loading} color="primary" variant="contained" onClick={() => unregister(piaf)}>
                Demander un remplacement
              </Button>
            )}
          </PiafRow>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default SlotInfo
