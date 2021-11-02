import { User } from "src/types/model"

export const formatName = (user: User) => `${user.prenom} ${user.nom}`
