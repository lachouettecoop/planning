import { DataGrid, GridColDef } from "@material-ui/data-grid"
import { CircularProgress } from "@material-ui/core"

import { useQuery } from "@apollo/client"

import { USERS } from "src/graphql/queriesUser"
import { User } from "src/types/model"
import { ErrorMessage } from "src/helpers/errors"

type Result = { users: User[] }
type userData = {
  id: string
  name: string
  lastName: string
  status: string
  roles: string
  absenceWithPurchase: boolean
  absenceWithoutPurchase: boolean
}

function createData(
  id: string,
  name: string,
  lastName: string,
  status: string,
  roles: string,
  absenceWithPurchase: boolean,
  absenceWithoutPurchase: boolean
) {
  return { id, name, lastName, status, roles, absenceWithPurchase, absenceWithoutPurchase }
}

export default function UserDataGrid() {
  const { data, loading, error } = useQuery<Result>(USERS)
  const rows: userData[] = []

  if (loading) {
    return <CircularProgress />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (!data) {
    return null
  }

  data?.users
    .slice()
    .sort((userA, userB) => {
      if (userA.nom > userB.nom) {
        return 1
      }
      if (userA.nom < userB.nom) {
        return -1
      }
      // a must be equal to b
      return 0
    })
    .forEach((user) => {
      rows.push(
        createData(
          user.id,
          user.prenom,
          user.nom,
          user.statut,
          user.rolesChouette.map((r) => r.libelle).join(", "),
          user.absenceLongueDureeCourses,
          user.absenceLongueDureeSansCourses
        )
      )
    })
  console.log(data)

  const columns: GridColDef[] = [
    { field: "lastName", headerName: "Nom", width: 150 },
    { field: "name", headerName: "Prenom", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "roles", headerName: "Roles", width: 150 },
    { field: "absenceWithPurchase", headerName: "Absence avec courses", width: 150 },
    { field: "absenceWithoutPurchase", headerName: "Absence sans courses", width: 150 },
  ]

  return (
    <>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </>
  )
}
