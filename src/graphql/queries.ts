import { gql } from "@apollo/client"

export const SLOTS = gql`
  query SLOTS($id: ID!) {
    creneau(id: $id) {
      titre
      informations
      debut
      fin
      horsMag
      creneauGenerique {
        frequence
      }
      piafs {
        id
        statut
        informations
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
          nbPiafGH
          nbPiafCaisse
        }
      }
    }
  }
`

export const PIAFS = gql`
  query PIAFS($userId: String, $after: String, $before: String, $statut: String, $validated: Boolean) {
    piafs(piaffeur: $userId, creneau_debut: { after: $after, before: $before }, statut: $statut, pourvu: $validated) {
      id
      statut
      pourvu
      nonPourvu
      informations
      creneau {
        id
        titre
        debut
        fin
        horsMag
      }
      piaffeur {
        id
        nom
        prenom
        email
        telephone
        nbPiafGH
        nbPiafCaisse
        affichageDonneesPersonnelles
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
  query PIAFS_COUNT($userId: String, $after: String, $before: String) {
    piafs(piaffeur: $userId, creneau_debut: { after: $after, before: $before }) {
      id
      statut
      nonPourvu
      creneau {
        debut
        fin
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
      informations
      horsMag
      creneauGenerique {
        frequence
      }
      piafs {
        id
        statut
        informations
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
          nbPiafGH
          nbPiafCaisse
          affichageDonneesPersonnelles
        }
      }
    }
  }
`

export const REGISTRATION_UPDATE = gql`
  mutation REGISTRATION_UPDATE($piafId: ID!, $userId: String!, $statut: String!, $informations: String) {
    updatePiaf(input: { id: $piafId, piaffeur: $userId, statut: $statut, informations: $informations }) {
      piaf {
        id
        piaffeur {
          id
        }
        statut
        informations
      }
    }
  }
`
export const VALIDATE_PIAF = gql`
  mutation VALIDATE_PIAF($piafId: ID!, $validate: Boolean) {
    updatePiaf(input: { id: $piafId, pourvu: $validate }) {
      piaf {
        id
        piaffeur {
          id
        }
        pourvu
      }
    }
  }
`

export const PIAF_NON_POURVU = gql`
  mutation PIAF_NON_POURVU($piafId: ID!, $nonPourvu: Boolean) {
    updatePiaf(input: { id: $piafId, nonPourvu: $nonPourvu }) {
      piaf {
        id
        piaffeur {
          id
        }
        pourvu
        nonPourvu
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

export const PIAF_CREATE = gql`
  mutation PIAF_CREATE($idCreneau: String!, $idRole: String) {
    createPiaf(input: { creneau: $idCreneau, role: $idRole, visible: true, pourvu: false, nonPourvu: false }) {
      piaf {
        id
        creneau {
          id
        }
        piaffeur {
          id
        }
        role {
          id
        }
      }
    }
  }
`

export const PIAF_GET = gql`
  query PIAF_GET($id: ID!) {
    piaf(id: $id) {
      id
      creneau {
        id
      }
      piaffeur {
        id
      }
      role {
        id
      }
    }
  }
`

export const ROLES = gql`
  query ROLES {
    roles {
      id
      libelle
      roleUniqueId
    }
  }
`
