import { DataGrid, GridColDef, GridRowData } from "@material-ui/data-grid"
import { CircularProgress } from "@material-ui/core"

import { useQuery } from "@apollo/client"
import { useState } from "react"

import { USERS } from "src/graphql/queriesUser"
import { User } from "src/types/model"
import { ErrorMessage } from "src/helpers/errors"
import UserInfoDialog from "src/components/UserInfoDialog"
import { userData } from "src/types/model"

type Result = { users: User[] }

function createData(
  id: string,
  name: string,
  lastName: string,
  status: string,
  roles: string,
  absenceWithPurchase: boolean,
  absenceWithoutPurchase: boolean,
  nbPiafEffectuees: number,
  nbPiafAttendues: number
) {
  return {
    id,
    name,
    lastName,
    status,
    roles,
    absenceWithPurchase,
    absenceWithoutPurchase,
    nbPiafEffectuees,
    nbPiafAttendues,
  }
}

export default function UserDataGrid() {
  const { data, loading, error } = useQuery<Result>(USERS)
  const [selectedRow, setSelectedRow] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
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
    .sort((userA, userB) => (userA.nom > userB.nom ? 1 : -1))
    .forEach((user) => {
      rows.push(
        createData(
          user.id,
          user.prenom,
          user.nom,
          user.statut,
          user.rolesChouette.map((r) => r.libelle).join(", "),
          user.absenceLongueDureeCourses,
          user.absenceLongueDureeSansCourses,
          user.nbPiafEffectuees,
          user.nbPiafAttendues
        )
      )
    })

  const onRowClick = (param: GridRowData) => {
    setSelectedRow(param.row)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

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
        <DataGrid rows={rows} columns={columns} onRowClick={onRowClick} />
      </div>
      <UserInfoDialog open={openDialog} handleClose={handleCloseDialog} data={selectedRow}></UserInfoDialog>
    </>
  )
}
