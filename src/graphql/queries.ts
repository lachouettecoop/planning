import { gql } from "@apollo/client"

export const LOGGED_IN_USER = gql`
  query LOGGED_IN_USER($id: ID!) {
    user(id: $id) {
      id
      username
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
      statuts {
        id
        libelle
        actif
        dateDebut
        dateFin
      }
    }
  }
`

export const USER_PIAFS_BY_DATE = gql`
  query USER_PIAFS_BY_DATE($idPiaffeur: String, $after: String, $before: String) {
    piafs(piaffeur: $idPiaffeur, after: $after, before: $before) {
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
`

export const PLANNING = gql`
  query PLANNING($after: String, $before: String) {
    creneaus(debut: { after: $after, before: $before }) {
      id
      debut
      fin
      titre
      piafs {
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

export const USER_UPDATE = gql`
  mutation USER_UPDATE($idUser: ID!, $email: String, $telephone: String) {
    updateUser(input: { id: $idUser, email: $email, telephone: $telephone }) {
      user {
        id
        username
        email
        telephone
      }
    }
  }
`
