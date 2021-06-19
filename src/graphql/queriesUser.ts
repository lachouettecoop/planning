import { gql } from "@apollo/client"

export const LOGGED_IN_USER = gql`
  query LOGGED_IN_USER($id: ID!) {
    user(id: $id) {
      id
      rolesChouette {
        id
        roleUniqueId
        libelle
      }
      nom
      prenom
      email
      telephone
      actif
      statut
      nbPiafEffectuees
      nbPiafAttendues
      nbPiafGH
      nbPiafCaisse
    }
  }
`
export const USER_UPDATE = gql`
  mutation USER_UPDATE($idUser: ID!, $email: String, $telephone: String) {
    updateUser(input: { id: $idUser, email: $email, telephone: $telephone }) {
      user {
        id
        email
        telephone
      }
    }
  }
`

export const USERS = gql`
  query USERS {
    users(enabled: true) {
      id
      nom
      prenom
      email
      actif
      rolesChouette {
        id
        libelle
        roleUniqueId
      }
      statut
      reserve {
        id
        informations
        creneauGeneriques {
          id
          heureDebut
          heureFin
          jour
        }
      }
      absenceLongueDureeCourses
      absenceLongueDureeSansCourses
      nbPiafEffectuees
      nbPiafAttendues
      nbPiafGH
      nbPiafCaisse
    }
  }
`
