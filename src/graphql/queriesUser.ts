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
      codeBarre
      nbPiafEffectuees
      nbPiafAttendues
      nbPiafGH
      nbPiafCaisse
      affichageDonneesPersonnelles
      absenceLongueDureeCourses
      absenceLongueDureeSansCourses
      attenteCommissionParticipation
    }
  }
`
export const USER_UPDATE = gql`
  mutation USER_UPDATE($idUser: ID!, $email: String, $telephone: String, $affichageDonneesPersonnelles: Boolean) {
    updateUser(
      input: {
        id: $idUser
        email: $email
        telephone: $telephone
        affichageDonneesPersonnelles: $affichageDonneesPersonnelles
      }
    ) {
      user {
        id
        email
        telephone
        affichageDonneesPersonnelles
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
      codeBarre
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
      attenteCommissionParticipation
    }
  }
`

export const USER_UPDATE_STOP_ABSENCE_WITHOUT_SHOPPING = gql`
  mutation($id: ID!) {
    updateUser(input: { id: $id, absenceLongueDureeSansCourses: false }) {
      user {
        id
        username
        nom
        prenom
        absenceLongueDureeSansCourses
        absenceLongueDureeCourses
      }
    }
  }
`
export const USER_UPDATE_STOP_ABSENCE_WITH_SHOPPING = gql`
  mutation($id: ID!) {
    updateUser(input: { id: $id, absenceLongueDureeCourses: false }) {
      user {
        id
        username
        nom
        prenom
        absenceLongueDureeSansCourses
        absenceLongueDureeCourses
      }
    }
  }
`

export const USER_SET_AWAITING_PARTICIPATION_GROUP = gql`
  mutation($id: ID!) {
    updateUser(input: { id: $id, attenteCommissionParticipation: true }) {
      user {
        id
        username
        nom
        prenom
        attenteCommissionParticipation
      }
    }
  }
`
