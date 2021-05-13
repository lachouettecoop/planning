import { DataGrid, GridColumns, GridRowData, GridValueFormatterParams } from "@material-ui/data-grid"

import { useQuery } from "@apollo/client"
import { useState } from "react"
import styled from "@emotion/styled/macro"

import { Role, User } from "src/types/model"
import { USERS } from "src/graphql/queriesUser"
import Loader from "src/components/Loader"
import UserInfoDialog from "src/components/UserInfoDialog"
import { ErrorMessage } from "src/helpers/errors"
import { formatRoles } from "src/helpers/role"

const StyledGrid = styled(DataGrid)`
  margin-top: 16px;
  height: calc(100vh - 150px);
  .MuiDataGrid-row {
    cursor: pointer;
  }
`

const booleanFormatter = ({ value }: GridValueFormatterParams) => (value ? "oui" : "non")

type Result = { users: User[] }

const COLUMNS: GridColumns = [
  { field: "nom", headerName: "Nom", flex: 1 },
  { field: "prenom", headerName: "Prenom", flex: 1 },
  { field: "statut", headerName: "Statut", flex: 1 },
  {
    field: "rolesChouette",
    headerName: "Roles",
    flex: 2,
    valueFormatter: ({ value }: GridValueFormatterParams) => formatRoles(value as Role[]),
  },
  {
    field: "absenceLongueDureeCourses",
    headerName: "Absence avec courses",
    flex: 1,
    valueFormatter: booleanFormatter,
  },
  {
    field: "absenceLongueDureeSansCourses",
    headerName: "Absence sans courses",
    flex: 1,
    valueFormatter: booleanFormatter,
  },
]

const Users = () => {
  const { data, loading, error } = useQuery<Result>(USERS)
  const [selectedRow, setSelectedRow] = useState<User>()
  const [openDialog, setOpenDialog] = useState(false)

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (!data) {
    return null
  }

  const rows = data.users.slice().sort((left, right) => (left.nom > right.nom ? 1 : -1))

  const onRowClick = ({ row }: GridRowData) => {
    setSelectedRow(row)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <>
      <StyledGrid rows={rows} columns={COLUMNS} onRowClick={onRowClick} autoPageSize />
      <UserInfoDialog open={openDialog} handleClose={handleCloseDialog} data={selectedRow} />
    </>
  )
}

export default Users
