import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core"

import { formatTime, formatDateLong } from "src/helpers/date"
import { REGISTRATION, DEREGISTRATION } from "src/graphql/queries"
import { useUser } from "src/providers/user"
import apollo from "src/helpers/apollo"
import { Creneau, PIAF } from "src/types/model"

interface Props {
  creneau: Creneau
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const DayInfo = ({ creneau, show, handleClose }: Props) => {
  const { user } = useUser<true>()
  const userAlreadyRegister: boolean = creneau.piafs.edges.find((p) => p.node.piaffeur?.id == user?.id) ? true : false
  const registration = async (piaf: PIAF) => {
    const roles = user?.rolesChouette.edges || []
    if (!roles.find((r) => r.node.id == piaf.role.id)) {
      alert("Si tu veux t´inscrire dans cette PIAF tu dois passer la formation avant")
    } else {
      apollo
        .mutate({
          mutation: REGISTRATION,
          variables: { idPiaffeur: user?.id, idPiaf: piaf.id },
        })
        .then((response) => {
          console.log(response)
        })
        .catch((response) => console.log(response))
    }
  }
  const deregistration = async (piaf: PIAF) => {
    apollo
      .mutate({
        mutation: DEREGISTRATION,
        variables: { idPiaf: piaf.id },
      })
      .then((response) => {
        console.log(response)
      })
      .catch((response) => console.log(response))
  }

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>
        {formatDateLong(new Date(creneau.date))}
        <span>
          <Button onClick={handleClose}>X</Button>
        </span>
        <div>
          {formatTime(new Date(creneau.heureDebut))} – {formatTime(new Date(creneau.heureFin))}
          <span>{creneau.titre}</span>
        </div>
      </DialogTitle>
      <DialogContent>
        <ul>
          {creneau.piafs.edges
            .slice()
            .sort((a, b) => {
              const idRoleA = a.node.role.id.split("/")
              const idRoleB = b.node.role.id.split("/")
              return parseInt(idRoleA[idRoleA.length - 1]) - parseInt(idRoleB[idRoleB.length - 1])
            })
            .map(({ node: piaf }) => (
              <li key={piaf.id}>
                {piaf.piaffeur?.prenom} {piaf.piaffeur?.nom} {piaf.role.libelle}
                {!piaf.piaffeur && !userAlreadyRegister && (
                  <Button color="primary" variant="contained" onClick={() => registration(piaf)}>
                    S´inscrire
                  </Button>
                )}
                {piaf.piaffeur && piaf.piaffeur.id == user?.id && (
                  <Button color="primary" variant="contained" onClick={() => deregistration(piaf)}>
                    Demander un remplacement
                  </Button>
                )}
              </li>
            ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export default DayInfo
