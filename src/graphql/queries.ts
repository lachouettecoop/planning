import { gql } from "@apollo/client"

export const LOGGED_IN_USER = gql`
  query LOGGED_IN_USER($id: ID!) {
    user(id: $id) {
      id
      username
      rolesChouette {
        edges {
          node {
            id
            roleUniqueId
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
            debut
            fin
          }
          piaffeur {
            prenom
            nom
            username
          }
          role {
            id
            roleUniqueId
            libelle
          }
        }
      }
    }
  }
`

export const PLANNING = gql`
  query PLANNING($after: String, $before: String) {
    creneaus(debut: { after: $after, before: $before }) {
      edges {
        node {
          id
          debut
          fin
          titre
          piafs {
            edges {
              node {
                id
                statut
                role {
                  id
                  roleUniqueId
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

export const REGISTRATION_UPDATE = gql`
  mutation REGISTRATION_UPDATE($idPiaf: ID!, $idPiaffeur: String!, $statut: String!) {
    updatePiaf(input: { id: $idPiaf, piaffeur: $idPiaffeur, statut: $statut }) {
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
