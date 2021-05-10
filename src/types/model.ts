export type ID = string

export type RoleUniqueId = "CH" | "GH" | "GHF" | "GHA" | "CA" | "CAF" | "CAA" | "MAG" | "BdM"

export interface Role {
  id: ID
  libelle: string
  roleUniqueId: RoleUniqueId
}

export interface CreneauGenerique {
  id: ID
  titre: string
  frequence: string
  jour: number
  heureDebut: string // ISO datetime
  heureFin: string // ISO datetime
  actif: boolean
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
  creneauGeneriques: CreneauGenerique[]
}

export interface User {
  id: ID
  email: string
  username: string
  rolesChouette: Role[]
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
  actif: boolean // what’s the difference with "enabled"?
  carteImprimee: boolean
  gh: boolean // grand hibou
  poste: Poste
  statut: string
  reserve: Reserve
  absenceLongueDureeCourses: boolean
  absenceLongueDureeSansCourses: boolean
  nbPiafEffectuees: number
  nbPiafAttendues: number
}

export interface Creneau {
  id: ID
  titre: string
  creneauGenerique: CreneauGenerique
  debut: string // ISO datetime
  fin: string // ISO datetime
  informations: string
  piafs: PIAF[]
}

export interface PIAF {
  id: ID
  role: Role
  piaffeur?: User
  creneau: Creneau
  visible: boolean
  pourvu: boolean
  statut: "occupe" | "remplacement" | "" | null // empty = available
}

export interface userData {
  id: string
  name: string
  lastName: string
  status: string
  roles: string
  absenceWithPurchase: boolean
  absenceWithoutPurchase: boolean
  nbPiafEffectuees: number
  nbPiafAttendues: number
}
