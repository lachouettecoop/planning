import { gql } from "@apollo/client"

export const LOGGED_IN_USER = gql`
  query LOGGED_IN_USER($id: ID!) {
    user(id: $id) {
      id
      username
      roles
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
                role {
                  id
                  libelle
                }
                piaffeur {
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
    updatePiaf(input: { id: $idPiaf, piaffeur: $idPiaffeur }) {
      piaf {
        id
        piaffeur {
          id
        }
      }
    }
  }
`
