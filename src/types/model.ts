import { List } from "src/helpers/apollo"

export type ID = string

export interface Role {
  id: ID
  libelle: string
}

export interface CreneauGenerique {
  id: ID
  titre: string
  frequence: string
  jour: number
  heureDebut: string // ISO datetime
  heureFin: string // ISO datetime
}

export interface Poste {
  id: ID
  reservationChouettos: User
  creneauGenerique: CreneauGenerique
  role: Role
}

export interface Reserve {
  id: ID
  informations: string
  user: User
}

export interface User {
  id: ID
  email: string
  username: string
  roles: string[]
  enabled: boolean
  civilite: string
  nom: string
  prenom: string
  telephone: string
  codeBarre: string
  domaineCompetence: string
  photo: string
  dateNaissance: string // ISO datetime
  notes: string
  actif: boolean // what's the difference with "enabled"?
  carteImprimee: boolean
  gh: boolean // grand hibou
  poste: Poste
  reserve: Reserve
}

export interface Creneau {
  id: ID
  titre: string
  creneauGenerique: CreneauGenerique
  date: string // ISO datetime
  heureDebut: string // ISO datetime
  heureFin: string // ISO datetime
  informations: string
  piafs: List<PIAF>
}

export interface PIAF {
  id: ID
  role: Role
  piaffeur: User
  creneau: Creneau
  visible: boolean
  pourvu: boolean
  statut: string
}
