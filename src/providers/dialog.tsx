import { createContext, useContext, useState, FC } from "react"

import InfoDialog from "src/components/InfoDialog"
import YesNoDialog from "src/components/YesNoDialog"

export enum TypeDialog {
  YesNo,
  Information,
}

interface IDialogContext {
  openDialog: (message: string, title?: string, typeDialog?: TypeDialog) => void
  closeDialog: () => void
  //onConfirm?: () => void
}

const DialogContext = createContext({} as IDialogContext)

export const DialogProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [typeDialog, setTypeDialog] = useState<TypeDialog>(TypeDialog.Information)

  const openDialog = (newMessage: string, newTitle = "", newTypeDialog: TypeDialog = TypeDialog.Information) => {
    setMessage(newMessage)
    setTitle(newTitle)
    setTypeDialog(newTypeDialog)
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
  }

  const onConfirm = () => {
    //This is an example
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog /*, onConfirm */ }}>
      {children}
      {typeDialog == TypeDialog.Information && (
        <InfoDialog open={open} handleClose={closeDialog} title={title} message={message}></InfoDialog>
      )}
      {typeDialog == TypeDialog.YesNo && (
        <YesNoDialog
          open={open}
          handleClose={closeDialog}
          title={title}
          message={message}
          onConfirm={onConfirm}
        ></YesNoDialog>
      )}
    </DialogContext.Provider>
  )
}

export const useDialog = () => useContext(DialogContext)
