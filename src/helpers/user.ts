import { RoleId, User } from "src/types/model"

export const formatName = (user: User) => `${user.prenom} ${user.nom}`

export const currentUserIsPA = (user: User) => {
  console.log(user)
  const result = user.rolesChouette.some(({ roleUniqueId }) => roleUniqueId === RoleId.PosteAccueil)
  if (result) console.log("user is PA")
  return result
}
