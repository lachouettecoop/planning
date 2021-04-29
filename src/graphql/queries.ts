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
      statut
      nbPiafEffectuees
      nbPiafAttendues
    }
  }
`

export const SLOTS = gql`
  query SLOTS($id: ID!) {
    creneau(id: $id) {
      titre
      debut
      fin
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
          prenom
          nom
        }
      }
    }
  }
`

export const PIAFS = gql`
  query PIAFS($userId: String, $after: String, $before: String, $statut: String) {
    piafs(piaffeur: $userId, creneau_debut: { after: $after, before: $before }, statut: $statut) {
      id
      statut
      pourvu
      creneau {
        id
        titre
        debut
        fin
      }
      piaffeur {
        id
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

export const PIAFS_COUNT = gql`
  query PIAFS_COUNT($userId: String, $after: String, $before: String, $statut: String) {
    piafs(piaffeur: $userId, creneau_debut: { after: $after, before: $before }, statut: $statut) {
      id
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
  mutation REGISTRATION_UPDATE($idPiaf: ID!, $userId: String!, $statut: String!) {
    updatePiaf(input: { id: $idPiaf, piaffeur: $userId, statut: $statut }) {
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

export const RESERVE_CREATE = gql`
  mutation RESERVE_CREATE($user: String, $informations: String, $creneauGenerique: [String]) {
    createReserve(input: { user: $user, informations: $informations, creneauGeneriques: $creneauGenerique }) {
      reserve {
        id
        informations
        user {
          id
          username
        }
        creneauGeneriques {
          id
          jour
          frequence
          heureDebut
          heureFin
        }
      }
    }
  }
`

export const RESERVE_UPDATE = gql`
  mutation RESERVE_UPDATE($id: ID!, $user: String, $informations: String, $creneauGenerique: [String]) {
    updateReserve(input: { id: $id, user: $user, informations: $informations, creneauGeneriques: $creneauGenerique }) {
      reserve {
        id
        informations
        user {
          id
          username
        }
        creneauGeneriques {
          id
          jour
          frequence
          heureDebut
          heureFin
        }
      }
    }
  }
`

export const RESERVE_USER = gql`
  query RESERVE_USER($idUser: String) {
    reserves(user: $idUser) {
      id
      informations
      creneauGeneriques {
        id
      }
    }
  }
`

export const CRENEAUX_GENERIQUES = gql`
  query CRENEAUX_GENERIQUES {
    creneauGeneriques {
      id
      heureDebut
      heureFin
      titre
      jour
      actif
      postes {
        id
        role {
          libelle
        }
      }
    }
  }
`
