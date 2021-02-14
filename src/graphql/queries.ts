import { gql } from "@apollo/client"
// import { statusPiaf } from "src/helpers/constants"

export const LOGGED_IN_USER = gql`
  query LOGGED_IN_USER($id: ID!) {
    user(id: $id) {
      id
      username
      rolesChouette {
        edges {
          node {
            id
            libelle
          }
        }
      }
      nom
      prenom
      email
    }
  }
`

export const NEXT_PIAFS = gql`
  query NEXT_PIAFS($piaffeur: String) {
    piafs(piaffeur: $piaffeur) {
      edges {
        node {
          id
          creneau {
            date
            heureDebut
            heureFin
          }
          piaffeur {
            prenom
            nom
            username
          }
          role {
            id
            libelle
          }
        }
      }
    }
  }
`

export const PLANNING = gql`
  query PLANNING($after: String, $before: String) {
    creneaus(date: { after: $after, before: $before }) {
      edges {
        node {
          id
          date
          heureFin
          heureDebut
          titre
          piafs {
            edges {
              node {
                id
                statut
                role {
                  id
                  libelle
                }
                piaffeur {
                  id
                  nom
                  prenom
                  email
                  telephone
                }
              }
            }
          }
        }
      }
    }
  }
`

export const REGISTRATION = gql`
  mutation REGISTRATION($idPiaf: ID!, $idPiaffeur: String) {
    # updatePiaf(input: { id: $idPiaf, piaffeur: $idPiaffeur, statut: statusPiaf.Disponible }) {
    updatePiaf(input: { id: $idPiaf, piaffeur: $idPiaffeur, statut: "" }) {
      piaf {
        id
        piaffeur {
          id
        }
        statut
      }
    }
  }
`
export const DEREGISTRATION = gql`
  mutation DEREGISTRATION($idPiaf: ID!) {
    # updatePiaf(input: { id: $idPiaf, piaffeur: null, statut: statusPiaf.Remplacement }) {
    updatePiaf(input: { id: $idPiaf, piaffeur: null, statut: "remplacement" }) {
      piaf {
        id
        piaffeur {
          id
        }
        statut
      }
    }
  }
`
