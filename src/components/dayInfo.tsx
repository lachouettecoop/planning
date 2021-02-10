import { Dialog, DialogContent, DialogTitle } from "@material-ui/core"

import { formatTime, formatDate } from "src/helpers/date"
import { REGISTRATION } from "src/graphql/queries"
import { useUser } from "src/providers/user"
import apollo from "src/helpers/apollo"
import { Creneau } from "src/types/model"

interface Props {
  creneau: Creneau
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const DayInfo = ({ creneau, show, handleClose }: Props) => {
  const { user } = useUser<true>()
  const registration = async (idPIAF: string) => {
    apollo
      .mutate({
        mutation: REGISTRATION,
        variables: { idPiaffeur: user?.id, idPiaf: idPIAF },
      })
      .then((response) => {
        console.log(response)
      })
      .catch((response) => console.log(response))
  }

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>
        {creneau.titre}
        <button onClick={handleClose}>X</button>
      </DialogTitle>
      <DialogContent>
        <div>{formatDate(new Date(creneau.date))}</div>
        <div>
          {formatTime(new Date(creneau.heureDebut))} – {formatTime(new Date(creneau.heureFin))}
        </div>
        <ul>
          {creneau.piafs.edges.map(({ node }) => (
            <li key={node.id}>
              {node.piaffeur?.nom} {node.piaffeur?.prenom} {node.statut} {node.role.libelle}
              <button onClick={() => registration(node.id)}>S&apos;inscrire</button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export default DayInfo
