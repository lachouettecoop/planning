export type ID = string

export enum RoleId {
  GrandHibou = "GH",
  Chouettos = "CH",
  Caissier = "CA",
  GrandHibou_Formateur = "GHF",
  Caissier_Formateur = "CAF",
  AdminMag = "MAG",
  AdminBdM = "BDM",
  // only for icons:
  PIAF = "P",
  Formateur = "F",
}

export interface Role {
  id: ID
  libelle: string
  roleUniqueId: RoleId
}

export interface CreneauGenerique {
  id: ID
  titre: string
  frequence: string
  jour: number
  heureDebut: string // ISO datetime
  heureFin: string // ISO datetime
  actif: boolean
  horsMag: boolean
}

export interface Poste {
  id: ID
  reservationChouettos: User
  creneauGenerique: CreneauGenerique
  role: Role
  description: string
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
  nbPiafGH?: number
  nbPiafCaisse?: number
  affichageDonneesPersonnelles: boolean
  attenteCommissionParticipation: boolean
}

export interface Creneau {
  id: ID
  titre: string
  creneauGenerique: CreneauGenerique | null
  debut: string // ISO datetime
  fin: string // ISO datetime
  informations: string
  horsMag: boolean
  piafs: PIAF[]
}

export interface InfoCreneau {
  piaffeursCount: number
  piaffeursCountFirstPiaf: number
}

export interface PIAF {
  id: ID
  role: Role | null
  piaffeur: User | null
  creneau: Creneau
  visible: boolean
  pourvu: boolean
  nonPourvu: boolean
  statut: "occupe" | "remplacement" | "" | null // empty = available
  informations: string | null
  infoCreneau: InfoCreneau
  description: string
}
