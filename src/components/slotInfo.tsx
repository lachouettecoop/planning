import {
  Backdrop,
  Button,
  capitalize,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import clsx from "clsx"
import React, { useState } from "react"

import { formatTime, formatDateLong } from "src/helpers/date"
import { REGISTRATION, DEREGISTRATION } from "src/graphql/queries"
import { useUser } from "src/providers/user"
import apollo from "src/helpers/apollo"
import { Creneau, PIAF } from "src/types/model"
import { idRoleGH, idRoleCaissier, statusPiaf } from "src/helpers/constants"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      float: "right",
    },
    piafList: {
      listStyle: "none",
      paddingLeft: "0px",
    },
    piafIcon: {
      display: "inline-flex",
      background: "grey",
      height: "2em",
      width: "2em",
      maxWidth: "32px",
      borderRadius: "50%",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    piafAvailable: {
      border: "green 2px solid",
    },
    piafReplacement: {
      border: "orange 2px solid",
    },
    title: {
      margin: "0 10px",
      color: "gray",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

interface Props {
  creneau: Creneau
  show: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const SlotInfo = ({ creneau, show, handleClose }: Props) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const { user } = useUser<true>()
  const userAlreadyRegister: boolean = creneau.piafs.edges.find(
    (p) => p.node.piaffeur?.id == user?.id && p.node.statut == statusPiaf.Occupe
  )
    ? true
    : false

  const registration = async (piaf: PIAF) => {
    const roles = user?.rolesChouette.edges || []
    if (!roles.find((r) => r.node.id == piaf.role.id)) {
      alert("Si tu veux t´inscrire dans cette PIAF tu dois passer la formation avant")
    } else {
      setLoading(true)
      // If there is a piaf with status "remplacement" and the same role,
      // the user will be register in this piaf by default
      let idPiaf = piaf.id
      const piafReplacement = creneau.piafs.edges.find(
        (p) => p.node.statut == statusPiaf.Remplacement && p.node.role.id == piaf.role.id
      )
      if (piafReplacement) {
        idPiaf = piafReplacement.node.id
      }
      apollo
        .mutate({
          mutation: REGISTRATION,
          variables: { idPiaffeur: user?.id, idPiaf: idPiaf },
        })
        .then((response) => {
          console.log(response)
        })
        .catch((response) => console.log(response))

      setLoading(false)
    }
  }
  const deregistration = async (piaf: PIAF) => {
    setLoading(true)
    apollo
      .mutate({
        mutation: DEREGISTRATION,
        variables: { idPiaf: piaf.id },
      })
      .then((response) => {
        console.log(response)
      })
      .catch((response) => console.log(response))

    setLoading(false)
  }

  return (
    <Dialog open={show} onClose={handleClose}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DialogTitle>
        <Button className={classes.closeButton} onClick={handleClose}>
          X
        </Button>
        <div>{capitalize(formatDateLong(new Date(creneau.date)))}</div>
        <div>
          {formatTime(new Date(creneau.heureDebut))} – {formatTime(new Date(creneau.heureFin))}
          <span className={classes.title}>{creneau.titre}</span>
        </div>
      </DialogTitle>
      <DialogContent>
        <ul className={classes.piafList}>
          {creneau.piafs.edges
            .slice()
            .sort((a, b) => {
              const idRoleA = a.node.role.id.split("/")
              const idRoleB = b.node.role.id.split("/")
              return parseInt(idRoleA[idRoleA.length - 1]) - parseInt(idRoleB[idRoleB.length - 1])
            })
            .map(({ node: piaf }) => (
              <li key={piaf.id}>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={2}
                    className={clsx(classes.piafIcon, {
                      [classes.piafAvailable]: !piaf.piaffeur && piaf.statut != statusPiaf.Remplacement,
                      [classes.piafReplacement]: piaf.statut == statusPiaf.Remplacement,
                    })}
                  >
                    <img
                      hidden={piaf.role.id == idRoleGH || piaf.role.id == idRoleCaissier}
                      width="100%"
                      src="img/chouettos.png"
                    ></img>
                    {piaf.role.id == idRoleGH ? "GH" : ""}
                    {piaf.role.id == idRoleCaissier ? "C" : ""}
                  </Grid>
                  <Grid item xs={4}>
                    <div hidden={piaf.statut == statusPiaf.Occupe}>Place disponible</div>
                    <div hidden={piaf.statut != statusPiaf.Occupe}>
                      {piaf.piaffeur?.prenom} {piaf.piaffeur?.nom} {piaf.role.libelle}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div hidden={piaf.statut != statusPiaf.Occupe}>{piaf.piaffeur?.email}</div>
                    <div hidden={piaf.statut != statusPiaf.Occupe}>{piaf.piaffeur?.telephone}</div>
                    {(piaf.statut == statusPiaf.Disponible || piaf.statut == statusPiaf.Remplacement || !piaf.statut) &&
                      !userAlreadyRegister && (
                        <Button
                          disabled={loading}
                          color="primary"
                          variant="contained"
                          onClick={() => registration(piaf)}
                        >
                          S´inscrire
                        </Button>
                      )}
                    {piaf.piaffeur && piaf.piaffeur.id == user?.id && piaf.statut == statusPiaf.Occupe && (
                      <Button
                        disabled={loading}
                        color="primary"
                        variant="contained"
                        onClick={() => deregistration(piaf)}
                      >
                        Demander un remplacement
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </li>
            ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export default SlotInfo
